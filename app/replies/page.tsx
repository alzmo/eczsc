import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { authorReplies, replySummary } from "../data/replies";
import { getLesson, lessons } from "../data/lessons";

export const metadata: Metadata = {
  title: "作者回复索引｜缠论原典",
  description: "按课程、时间和关键词检索存档中经博主标记与作者名双重确认的缠中说禅回复节录。",
};

type PageProps = { searchParams: Promise<{ q?: string; lesson?: string; mode?: string; page?: string }> };
const PAGE_SIZE = 30;

export default async function RepliesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalized = query.toLowerCase();
  const lessonId = Number(params.lesson || 0);
  const mode = params.mode === "technical" ? "technical" : "all";
  const requestedPage = Math.max(1, Number(params.page || 1) || 1);
  const filtered = authorReplies.filter((reply) => {
    const lesson = getLesson(reply.lessonId);
    const matchesLesson = !lessonId || reply.lessonId === lessonId;
    const matchesMode = mode === "all" || reply.isTechnical;
    const haystack = `${reply.lessonId} ${lesson?.title ?? ""} ${reply.publishedAt} ${reply.questionExcerpt} ${reply.answerExcerpt}`.toLowerCase();
    return matchesLesson && matchesMode && (!normalized || haystack.includes(normalized));
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, pageCount);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const lessonsWithReplies = lessons.filter((lesson) => authorReplies.some((reply) => reply.lessonId === lesson.id));
  const pageHref = (page: number) => {
    const values = new URLSearchParams();
    if (query) values.set("q", query);
    if (lessonId) values.set("lesson", String(lessonId));
    if (mode !== "all") values.set("mode", mode);
    values.set("page", String(page));
    return `/replies?${values.toString()}`;
  };

  return <main className="inner-page"><SiteHeader />
    <section className="page-intro split-intro"><div><p className="eyebrow">Verified author replies</p><h1>作者回复索引</h1></div><p>这里只收录存档中同时具有“博主回复”标记、且作者名完全等于“缠中说禅”的记录。页面展示必要节录和校验指纹，完整上下文仍应回到对应课程存档核对。</p></section>
    <section className="reply-summary"><article><strong>{replySummary.total.toLocaleString("zh-CN")}</strong><span>双重确认回复</span></article><article><strong>{replySummary.technical.toLocaleString("zh-CN")}</strong><span>含技术关键词</span></article><article><strong>{replySummary.lessons}</strong><span>涉及课程</span></article></section>
    <section className="reply-tools"><form action="/replies" method="get"><label htmlFor="reply-search">检索回复节录</label><div className="reply-search-row"><input id="reply-search" name="q" defaultValue={query} placeholder="例如：分型、中枢、复权" /><select name="lesson" defaultValue={lessonId || ""} aria-label="按课程筛选"><option value="">全部课程</option>{lessonsWithReplies.map((lesson) => <option value={lesson.id} key={lesson.id}>第{lesson.id}课 · {lesson.title}</option>)}</select><select name="mode" defaultValue={mode} aria-label="按内容筛选"><option value="all">全部回复</option><option value="technical">技术相关</option></select><button type="submit">检索</button></div></form><p className="result-count">找到 {filtered.length.toLocaleString("zh-CN")} 条 · 第 {currentPage}/{pageCount} 页</p></section>
    <section className="reply-list">{shown.map((reply) => { const lesson = getLesson(reply.lessonId); return <article key={reply.id}><header><a href={`/courses/${reply.lessonId}`}>第 {reply.lessonId} 课 · {lesson?.title}</a><time>{reply.publishedAt}</time></header>{reply.questionExcerpt && <div className="reply-question"><span>上下文节录</span><p>{reply.questionExcerpt}</p></div>}<div className="reply-answer"><span>作者回复节录</span><p>{reply.answerExcerpt}</p></div><footer><span>{reply.isTechnical ? "技术相关" : "一般回复"}</span><code>{reply.replySha256.slice(0, 16)}…</code><small>{reply.replyCharacterCount} 字 · {reply.verification}</small></footer></article>; })}{!shown.length && <div className="empty-state"><strong>没有找到匹配回复</strong><p>请换一个关键词或清除筛选条件。</p></div>}</section>
    {pageCount > 1 && <nav className="reply-pagination" aria-label="回复分页">{currentPage > 1 ? <a href={pageHref(currentPage - 1)}>← 上一页</a> : <span />}{currentPage < pageCount ? <a href={pageHref(currentPage + 1)}>下一页 →</a> : <span />}</nav>}
    <aside className="verification-note"><strong>为什么从1,165修正为963？</strong><p>早期统计只要用户名包含“缠中说禅”就会计入，因此误收了后期读者账号。现在改为存档的博主标记与作者名完全匹配，两项必须同时成立。本站保留这次修正记录。</p></aside><SiteFooter /></main>;
}
