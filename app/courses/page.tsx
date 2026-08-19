import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { archiveSource } from "../data/lessons";
import { CourseExplorer } from "./CourseExplorer";

export const metadata: Metadata = {
  title: "《教你炒股票》108课完整目录｜缠论原典",
  description: "按原始发表顺序整理《教你炒股票》108篇课程，可按课号、标题与概念检索。",
};

export default function Courses() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="page-intro course-intro">
        <div><p className="eyebrow">108 lessons · 2006—2008</p><h1>《教你炒股票》</h1></div>
        <div className="intro-note"><strong>完整目录已经建立</strong><p>标题与发表日期按原始顺序核验。本站提供检索、研读路径和来源入口，不把整理者文字冒充原文。</p><a href={archiveSource} target="_blank" rel="noreferrer">查看原文档案 ↗</a></div>
      </section>
      <CourseExplorer />
      <SiteFooter />
    </main>
  );
}
