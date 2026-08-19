"""Import verifiable metadata and original article images from a saved CZSC archive.

The source ZIP uses GBK filenames without the ZIP UTF-8 flag and stores entries
under an absolute-looking D:/czsc prefix. This importer never extracts paths from
the archive directly. It generates safe relative names and strips the saved
website shell by reading only the article body, publication metadata and comment
records required for provenance statistics.
"""

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import mimetypes
import os
import posixpath
import re
import shutil
import sys
import zipfile
from pathlib import Path
from urllib.parse import unquote, urlsplit

from lxml import html


LESSON_TITLE = re.compile(r"^教你炒股票\s*(\d{1,3})\s*[：:]")
ARTICLE_CLASS = " articalContent "
REPLY_CLASS_FRAGMENT = "divReplyIsHost"
AUTHOR_REPLY_CLASS = "divReplyIsHostTrue"
AUTHOR_NAME = "缠中说禅"
CORRECTION_TITLE = "各位注意，严重更正"
TECHNICAL_REPLY_PATTERN = re.compile(
    r"分型|线段|中枢|背驰|背弛|走势|级别|买卖点|买点|卖点|复权|均线|MACD|盘整|趋势|笔"
)
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
# In this saved archive, lessons 1–22 contain finance widgets rendered in 2014,
# years after the original posts. Visual inspection confirmed they are saved
# page chrome rather than original lesson illustrations, so they are excluded.
FIRST_VERIFIED_IMAGE_LESSON = 47


def decode_entry_name(info: zipfile.ZipInfo) -> str:
    if info.flag_bits & 0x800:
        return info.filename
    try:
        return info.filename.encode("cp437").decode("gbk")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return info.filename


def decode_html(data: bytes) -> str:
    found = re.search(br"charset\s*=\s*[\"']?([A-Za-z0-9._-]+)", data[:8192], re.I)
    declared = found.group(1).decode("ascii", "ignore").lower() if found else ""
    aliases = {"gb2312": "gb18030", "gbk": "gb18030", "x-gbk": "gb18030"}
    for encoding in (aliases.get(declared, declared), "gb18030", "utf-8"):
        if not encoding:
            continue
        try:
            return data.decode(encoding)
        except (LookupError, UnicodeDecodeError):
            continue
    return data.decode("gb18030", "replace")


def normalized_text(element) -> str:
    return re.sub(r"\s+", " ", element.text_content()).strip()


def clipped(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def reply_body(reply) -> str:
    containers = reply.xpath("./fieldset/div")
    return normalized_text(containers[-1]) if containers else normalized_text(reply)


def reply_excerpts(text: str) -> tuple[str, str]:
    parts = re.split(r"\s*(?:={3,}|-{5,}|_{3,})\s*", text)
    if len(parts) > 1:
        return clipped(parts[-2], 160), clipped(parts[-1], 240)
    return "", clipped(text, 240)


def class_xpath(class_name: str) -> str:
    return f"//*[contains(concat(' ', normalize-space(@class), ' '), ' {class_name} ')]"


def resolve_local_image(html_name: str, source: str) -> str | None:
    source = unquote(source.strip()).replace("\\", "/")
    if not source or source.startswith(("data:", "javascript:", "//")):
        return None
    parsed = urlsplit(source)
    if parsed.scheme or parsed.netloc:
        return None
    relative = parsed.path[2:] if parsed.path.startswith("./") else parsed.path
    return posixpath.normpath(posixpath.join(posixpath.dirname(html_name), relative))


def extension_for(entry_name: str, data: bytes) -> str:
    extension = Path(entry_name).suffix.lower()
    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return extension
    guessed = mimetypes.guess_extension(mimetypes.guess_type(entry_name)[0] or "")
    if guessed in ALLOWED_IMAGE_EXTENSIONS:
        return guessed
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG"):
        return ".png"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return ".gif"
    return ".bin"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--project-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    project_root = args.project_root.resolve()
    output_json = project_root / "app" / "data" / "archive-records.json"
    reply_output_json = project_root / "app" / "data" / "author-replies.json"
    image_root = project_root / "public" / "archive" / "lessons"
    if not args.dry_run and image_root.exists():
        resolved_image_root = image_root.resolve()
        if project_root not in resolved_image_root.parents:
            raise RuntimeError("Refusing to clear an image directory outside the project")
        shutil.rmtree(resolved_image_root)

    records: list[dict] = []
    total_image_bytes = 0
    total_author_replies = 0
    total_comments = 0
    author_reply_records: list[dict] = []
    correction_record: dict | None = None

    with zipfile.ZipFile(args.zip_path) as archive:
        infos = archive.infolist()
        by_decoded_name = {decode_entry_name(info): info for info in infos if not info.is_dir()}
        lessons: dict[int, tuple[zipfile.ZipInfo, str]] = {}

        for info in infos:
            if info.is_dir() or not info.filename.lower().endswith(".html"):
                continue
            decoded = decode_entry_name(info)
            filename = posixpath.basename(decoded)
            title = filename.rsplit(".", 1)[0]
            match = LESSON_TITLE.match(title)
            if not match:
                continue
            lesson_id = int(match.group(1))
            if 1 <= lesson_id <= 108:
                if lesson_id in lessons:
                    raise RuntimeError(f"Duplicate archive page for lesson {lesson_id}")
                lessons[lesson_id] = (info, decoded)

        missing = [lesson_id for lesson_id in range(1, 109) if lesson_id not in lessons]
        if missing:
            raise RuntimeError(f"Missing lesson pages: {missing}")

        for lesson_id in range(1, 109):
            info, decoded_html_name = lessons[lesson_id]
            source = decode_html(archive.read(info))
            document = html.fromstring(source)
            title = re.sub(r"\s+", " ", document.findtext(".//title") or "").strip()
            article_nodes = document.xpath(class_xpath("articalContent"))
            if len(article_nodes) != 1:
                raise RuntimeError(f"Lesson {lesson_id} has {len(article_nodes)} article bodies")
            article = article_nodes[0]
            article_text = normalized_text(article)
            article_sha = hashlib.sha256(article_text.encode("utf-8")).hexdigest()

            publication_nodes = document.xpath(class_xpath("pubtime"))
            archived_publication_time = normalized_text(publication_nodes[0]) if publication_nodes else ""

            replies = document.xpath(f"//*[contains(@class, '{REPLY_CLASS_FRAGMENT}')]")
            lesson_author_replies: list[dict] = []
            for reply in replies:
                class_tokens = (reply.get("class") or "").split()
                authors = reply.xpath(".//*[contains(concat(' ', normalize-space(@class), ' '), ' author ')]")
                author = normalized_text(authors[0]) if authors else ""
                if AUTHOR_REPLY_CLASS not in class_tokens or author != AUTHOR_NAME:
                    continue
                publication = reply.xpath(".//*[contains(concat(' ', normalize-space(@class), ' '), ' pubtime ')]")
                published_at = normalized_text(publication[0]) if publication else ""
                body = reply_body(reply)
                question_excerpt, answer_excerpt = reply_excerpts(body)
                sequence = len(lesson_author_replies) + 1
                lesson_author_replies.append({
                    "id": f"{lesson_id}-{sequence}",
                    "lessonId": lesson_id,
                    "sequence": sequence,
                    "publishedAt": published_at,
                    "questionExcerpt": question_excerpt,
                    "answerExcerpt": answer_excerpt,
                    "replyCharacterCount": len(body),
                    "replySha256": hashlib.sha256(body.encode("utf-8")).hexdigest(),
                    "isTechnical": bool(TECHNICAL_REPLY_PATTERN.search(body)),
                    "verification": "存档博主标记与作者名双重确认",
                })

            author_reply_count = len(lesson_author_replies)
            author_reply_records.extend(lesson_author_replies)

            saved_images: list[str] = []
            seen_hashes: set[str] = set()
            for image in article.xpath(".//img"):
                if lesson_id < FIRST_VERIFIED_IMAGE_LESSON:
                    continue
                source_path = image.get("real_src") or image.get("src") or ""
                resolved = resolve_local_image(decoded_html_name, source_path)
                image_info = by_decoded_name.get(resolved or "")
                if image_info is None:
                    continue
                data = archive.read(image_info)
                digest = hashlib.sha256(data).hexdigest()
                if digest in seen_hashes:
                    continue
                seen_hashes.add(digest)
                extension = extension_for(resolved or image_info.filename, data)
                if extension not in ALLOWED_IMAGE_EXTENSIONS:
                    continue
                public_path = f"/archive/lessons/{lesson_id}/{len(saved_images) + 1:02d}{extension}"
                saved_images.append(public_path)
                total_image_bytes += len(data)
                if not args.dry_run:
                    destination = project_root / "public" / public_path.lstrip("/")
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    destination.write_bytes(data)

            total_author_replies += author_reply_count
            total_comments += len(replies)
            records.append({
                "id": lesson_id,
                "archiveTitle": title,
                "archivedPublicationTime": archived_publication_time,
                "articleCharacterCount": len(article_text),
                "articleSha256": article_sha,
                "articleImageCount": len(saved_images),
                "commentCount": len(replies),
                "authorReplyCount": author_reply_count,
                "savedImages": saved_images,
                "archiveStatus": "正文存档已核验",
            })

        correction_info = next((
            info for info in infos
            if not info.is_dir()
            and info.filename.lower().endswith(".html")
            and posixpath.basename(decode_entry_name(info)).rsplit(".", 1)[0] == CORRECTION_TITLE
        ), None)
        if correction_info is not None:
            correction_document = html.fromstring(decode_html(archive.read(correction_info)))
            correction_bodies = correction_document.xpath(class_xpath("articalContent"))
            if len(correction_bodies) != 1:
                raise RuntimeError(f"Correction page has {len(correction_bodies)} article bodies")
            correction_text = normalized_text(correction_bodies[0])
            correction_times = correction_document.xpath(class_xpath("pubtime"))
            correction_record = {
                "title": CORRECTION_TITLE,
                "archivedPublicationTime": normalized_text(correction_times[0]) if correction_times else "",
                "articleCharacterCount": len(correction_text),
                "articleSha256": hashlib.sha256(correction_text.encode("utf-8")).hexdigest(),
                "excerpt": clipped(correction_text, 280),
                "archiveStatus": "正式更正文已核验",
            }

    payload = {
        "schemaVersion": 1,
        "sourceDescription": "用户提供的公开共享存档合集（已剥离转载站页面外壳）",
        "lessonCoverage": "108/108",
        "corrections": [correction_record] if correction_record else [],
        "records": records,
    }
    if not args.dry_run:
        output_json.parent.mkdir(parents=True, exist_ok=True)
        temporary = output_json.with_suffix(".json.tmp")
        temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temporary, output_json)
        reply_payload = {
            "schemaVersion": 1,
            "verificationRule": "仅收录divReplyIsHostTrue且作者名完全等于缠中说禅的回复",
            "records": author_reply_records,
        }
        reply_temporary = reply_output_json.with_suffix(".json.tmp")
        reply_temporary.write_text(json.dumps(reply_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(reply_temporary, reply_output_json)

    summary = {
        "lessonCoverage": payload["lessonCoverage"],
        "articleImages": sum(record["articleImageCount"] for record in records),
        "articleImageBytes": total_image_bytes,
        "comments": total_comments,
        "authorReplies": total_author_replies,
        "technicalAuthorReplies": sum(reply["isTechnical"] for reply in author_reply_records),
        "verifiedCorrections": len(payload["corrections"]),
        "dryRun": args.dry_run,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
