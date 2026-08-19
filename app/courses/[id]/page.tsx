/* eslint-disable @next/next/no-html-link-for-pages -- native navigation keeps the archive usable without client JavaScript */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { archiveMirrorSource, formatLessonNumber, getChapter, getLesson, getLessonTags, lessons, originalBlogSource } from "../../data/lessons";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: String(lesson.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) return {};
  const title = `第${lesson.id}课：${lesson.title}｜缠论原典`;
  const description = `${lesson.date}发表。《教你炒股票》第${lesson.id}课的出处、专题定位与研读提示。`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) notFound();
  const chapter = getChapter(lesson.id);
  const previous = getLesson(lesson.id - 1);
  const next = getLesson(lesson.id + 1);
  const tags = getLessonTags(lesson);

  return (
    <main className="inner-page lesson-page">
      <SiteHeader />
      <article className="lesson-article">
        <a className="back-link" href="/courses">← 返回108课目录</a>
        <header className="lesson-title-block">
          <div className="lesson-index">{formatLessonNumber(lesson.id)}</div>
          <div><p className="eyebrow">教你炒股票 · 第 {lesson.id} 课</p><h1>{lesson.title}</h1><div className="lesson-meta"><time dateTime={lesson.date}>{lesson.date}</time><span>{chapter.title}</span></div></div>
        </header>

        <div className="lesson-content-grid">
          <section className="reading-card primary-reading">
            <p className="card-kicker">本站研读定位</p>
            <h2>{chapter.title}</h2>
            <p>{chapter.description}</p>
            <div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </section>
          <section className="reading-card">
            <p className="card-kicker">阅读时建议核对</p>
            <ol>{chapter.questions.map((question) => <li key={question}>{question}</li>)}</ol>
          </section>
          <aside className="source-card">
            <span>出处与存档</span>
            <h2>原始出处：缠中说禅新浪博客</h2>
            <p>新浪博客是作者原始发表地址。若原文已被删除、图片缺失或页面无法访问，可再使用完整镜像核对正文与现存资料；镜像不等同于原始出处。</p>
            <div className="source-links"><a href={originalBlogSource} target="_blank" rel="noreferrer">访问作者原博客 ↗</a><a href={archiveMirrorSource} target="_blank" rel="noreferrer">查看完整镜像 ↗</a></div>
          </aside>
        </div>

        <section className="layer-guide">
          <p className="eyebrow">Evidence layers</p>
          <h2>本站如何区分资料层级</h2>
          <div><article><b>原文</b><p>作者正式发表的课程正文，必须附标题与日期。</p></article><article><b>作者回复</b><p>仅收录能够确认发言身份和上下文的回复。</p></article><article><b>更正</b><p>作者后续明确修订的内容，优先于早期表述。</p></article><article><b>本站整理</b><p>用于检索与研读，不代表作者原话。</p></article></div>
        </section>

        <nav className="lesson-pagination" aria-label="相邻课程">
          {previous ? <a href={`/courses/${previous.id}`}><small>上一篇 · {formatLessonNumber(previous.id)}</small><strong>{previous.title}</strong></a> : <span />}
          {next ? <a href={`/courses/${next.id}`}><small>下一篇 · {formatLessonNumber(next.id)}</small><strong>{next.title}</strong></a> : <span />}
        </nav>
      </article>
      <SiteFooter />
    </main>
  );
}
