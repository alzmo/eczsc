import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { archiveMirrorSource, chapters, formatLessonNumber, getChapter, getLessonTags, lessons, originalBlogSource } from "../data/lessons";

export const metadata: Metadata = {
  title: "《教你炒股票》108课完整目录｜缠论原典",
  description: "按原始发表顺序整理《教你炒股票》108篇课程，可按课号、标题与概念检索。",
};

type PageProps = { searchParams: Promise<{ q?: string; chapter?: string }> };

export default async function Courses({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalized = query.toLowerCase();
  const chapterId = params.chapter ?? "all";
  const filtered = lessons.filter((lesson) => {
    const chapter = getChapter(lesson.id);
    const inChapter = chapterId === "all" || chapter.id === chapterId;
    const haystack = `${lesson.id} ${lesson.title} ${lesson.date} ${getLessonTags(lesson).join(" ")}`.toLowerCase();
    return inChapter && (!normalized || haystack.includes(normalized));
  });
  const chapterHref = (id: string) => `/courses?chapter=${id}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="page-intro course-intro">
        <div><p className="eyebrow">108 lessons · 2006—2008</p><h1>《教你炒股票》</h1></div>
        <div className="intro-note"><strong>完整目录已经建立</strong><p>标题与发表日期按原始顺序核验。原始出处为缠中说禅新浪博客；新浪已删除或缺失的内容，可通过完整镜像辅助核对。</p><div className="source-links"><a href={originalBlogSource} target="_blank" rel="noreferrer">访问作者原博客 ↗</a><a href={archiveMirrorSource} target="_blank" rel="noreferrer">查看完整镜像 ↗</a></div></div>
      </section>
      <section className="course-tools" aria-label="课程检索">
        <form action="/courses" method="get">
          {chapterId !== "all" && <input type="hidden" name="chapter" value={chapterId} />}
          <label htmlFor="course-search">搜索课程</label>
          <div className="search-row"><input id="course-search" name="q" defaultValue={query} placeholder="输入课号、标题或概念，例如：分型" /><button type="submit">搜索</button></div>
        </form>
        <nav className="chapter-filters" aria-label="课程分组">
          <a className={chapterId === "all" ? "active" : ""} href={chapterHref("all")}>全部 108 篇</a>
          {chapters.map((chapter) => <a className={chapterId === chapter.id ? "active" : ""} href={chapterHref(chapter.id)} key={chapter.id}>{chapter.title}</a>)}
        </nav>
        <p className="result-count">当前显示 {filtered.length} 篇</p>
      </section>
      <section className="lesson-list">
        {filtered.map((lesson) => {
          const chapter = getChapter(lesson.id);
          return <a className="lesson-row" href={`/courses/${lesson.id}`} key={lesson.id}><span className="lesson-no">{formatLessonNumber(lesson.id)}</span><div><h2>{lesson.title}</h2><p>{getLessonTags(lesson).join(" · ")}</p></div><time dateTime={lesson.date}>{lesson.date}</time><span className="chapter-name">{chapter.title}</span><b aria-hidden="true">→</b></a>;
        })}
        {!filtered.length && <div className="empty-state"><strong>没有找到匹配课程</strong><p>换一个关键词，或切回“全部108篇”。</p></div>}
      </section>
      <SiteFooter />
    </main>
  );
}
