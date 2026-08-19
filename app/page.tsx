/* eslint-disable @next/next/no-html-link-for-pages -- native navigation keeps the archive usable without client JavaScript */
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { archiveSummary } from "./data/archive";
import { chapters, lessons } from "./data/lessons";

const featured = [17, 20, 62, 67, 81, 91].map((id) => lessons[id - 1]);

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">从原文出发 · 让定义可查 · 让规则可证</p>
          <h1>先找到出处，<br />再讨论走势。</h1>
          <p className="lede">以《教你炒股票》108课为主线，把课程、作者回复、更正与本站整理分层呈现。这里不是另造一套缠论，而是为每个概念保留来路。</p>
          <div className="hero-actions"><a className="primary" href="/courses">浏览完整108课</a><a className="secondary" href="/replies">检索作者回复</a></div>
        </div>
        <aside className="principle-card"><span>资料原则 · 01</span><p>原文不是装饰，<br />而是判断的边界。</p><div className="ink-line" /><small>原文、作者回复、正式更正与本站释义，四层分开标记。</small></aside>
      </section>

      <section className="evidence-strip" aria-label="本站资料规模">
        <div><strong>{archiveSummary.lessonCoverage}</strong><span>课程正文存档核验</span></div><div><strong>{archiveSummary.authorReplies.toLocaleString("zh-CN")}</strong><span>双重确认作者回复</span></div><div><strong>{archiveSummary.images}</strong><span>核验后保留的原始图解</span></div>
      </section>

      <section className="topic-section">
        <div className="section-heading"><p className="eyebrow">Reading map</p><h2>从最小结构，走向完整走势</h2><p>课程按发表顺序保存，同时提供专题入口。两条路径互相校验：既不割裂上下文，也不让概念埋没在时间线里。</p></div>
        <div className="chapter-grid">{chapters.map((chapter, index) => <a href={`/courses?chapter=${chapter.id}`} className="chapter-card" key={chapter.id}><span>0{index + 1}</span><small>第 {chapter.range[0]}—{chapter.range[1]} 课</small><h3>{chapter.title}</h3><p>{chapter.description}</p><b>进入研读 →</b></a>)}</div>
      </section>

      <section className="featured-section">
        <div className="section-heading"><p className="eyebrow">Core lessons</p><h2>结构研究的关键课程</h2><p>如果你的目标是理解分型、笔、线段、中枢和多级别联动，可以从这些课程建立骨架，再回到完整时间线。</p></div>
        <div className="featured-list">{featured.map((lesson) => <a href={`/courses/${lesson.id}`} key={lesson.id}><span>{String(lesson.id).padStart(3,"0")}</span><strong>{lesson.title}</strong><time>{lesson.date}</time><b>→</b></a>)}</div>
      </section>

      <section className="manifesto"><span>本站立场</span><p>不把解释写成原话，<br />不把争议写成定论，<br />不把历史案例写成收益承诺。</p><a href="/about">了解本站的整理方法 →</a></section>
      <SiteFooter />
    </main>
  );
}
