import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { archiveRecords, archiveSummary } from "../data/archive";
import { getLesson } from "../data/lessons";

export const metadata: Metadata = {
  title: "存档核验｜缠论原典",
  description: "公开共享存档中《教你炒股票》108课的正文、配图与作者回复核验状态。",
};

const imageRecords = archiveRecords.filter((record) => record.articleImageCount > 0);
const replyRecords = [...archiveRecords].sort((a, b) => b.authorReplyCount - a.authorReplyCount).slice(0, 8);

export default function ArchivePage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="page-intro split-intro">
        <div><p className="eyebrow">Archive verification</p><h1>存档核验</h1></div>
        <p>这批资料来自用户长期保存的公开共享档案。本站只提取文章正文的校验信息、原始图解和可确认的回复记录，转载站导航、广告、统计代码与动态行情组件均不进入资料层。</p>
      </section>
      <section className="archive-stats" aria-label="存档核验统计">
        <article><strong>{archiveSummary.lessonCoverage}</strong><span>课程正文完整覆盖</span></article>
        <article><strong>{archiveSummary.comments.toLocaleString("zh-CN")}</strong><span>存档讨论记录</span></article>
        <article><strong>{archiveSummary.authorReplies.toLocaleString("zh-CN")}</strong><span>双重确认作者回复</span></article>
        <article><strong>{archiveSummary.images}</strong><span>核验后保留的原始图解</span></article>
      </section>
      <section className="archive-method">
        <div><p className="eyebrow">Cleaning rules</p><h2>清理的是网站外壳，不是资料来路</h2></div>
        <ol><li>修复GBK中文文件名和异常的绝对路径。</li><li>只读取课程正文区域，不导入转载站页面结构。</li><li>删除广告、统计脚本、表情资源与后期动态行情组件。</li><li>为正文生成校验指纹，保留发表时间、评论数量和作者署名回复数量。</li><li>图片只有在正文中出现且经视觉核验后才公开展示。</li></ol>
      </section>
      <section className="archive-index">
        <header><p className="eyebrow">Recovered figures</p><h2>已恢复配图的课程</h2><p>共 {imageRecords.length} 课、{archiveSummary.images} 张图解。点击课程可查看存档证据与原图。</p></header>
        <div>{imageRecords.map((record) => { const lesson = getLesson(record.id); return <a href={`/courses/${record.id}`} key={record.id}><span>第 {record.id} 课</span><strong>{lesson?.title}</strong><small>{record.articleImageCount} 张图解</small></a>; })}</div>
      </section>
      <section className="archive-index">
        <header><p className="eyebrow">Reply leads</p><h2>作者回复线索较多的课程</h2><p>数字只表示当前存档中能够确认作者署名的回复，不推断已经丢失的内容。</p></header>
        <div>{replyRecords.map((record) => { const lesson = getLesson(record.id); return <a href={`/replies?lesson=${record.id}`} key={record.id}><span>第 {record.id} 课</span><strong>{lesson?.title}</strong><small>{record.authorReplyCount} 条确认回复</small></a>; })}</div>
      </section>
      <aside className="verification-note"><strong>来源说明</strong><p>{archiveSummary.sourceDescription}。存档用于核验，不改变原始出处：作者原始发表地址仍为新浪博客，完整镜像仅作辅助阅读。<a href="/replies">进入作者回复索引 →</a></p></aside>
      <SiteFooter />
    </main>
  );
}
