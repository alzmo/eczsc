import Link from "next/link";

const lessons = [
  [1, "不会赢钱的经济人，只是废人！", "2006-06-07", "市场与人的第一课"],
  [2, "没有庄家，有的只是赢家和输家！", "2006-06-08", "放下庄家思维"],
  [3, "你的喜好，你的死亡陷阱！", "2006-06-09", "操作与自我"],
  [17, "走势终完美", "2006-12-18", "走势类型的基础命题"],
  [20, "走势中枢级别扩张及第三类买卖点", "2007-01-05", "中枢与买卖点"],
  [29, "转折的力度与级别", "2007-02-09", "背驰与级别"],
  [62, "分型、笔与线段", "2007-06-30", "几何结构基础"],
  [67, "线段的划分标准", "2007-08-01", "线段划分"],
  [71, "线段划分标准的再分辨", "2007-08-16", "边界与歧义"],
  [81, "图例、更正及分型、走势类型的哲学本质", "2007-09-17", "更正与理论边界"],
  [91, "走势结构的两重表里关系", "2008-01-15", "多级别联动"],
  [108, "何谓底部？从月线看中期走势演化", "2008-08-29", "底部的精确定义"],
];

export default function Courses() {
  return (
    <main className="inner-page">
      <header className="site-header compact"><Link href="/" className="brand"><span className="seal">缠</span><span><strong>缠论原典</strong><small>eczsc.com</small></span></Link><nav><Link href="/courses">教你炒股票</Link><Link href="/topics">专题索引</Link><Link href="/corrections">原文更正</Link><Link href="/about">研读方法</Link></nav></header>
      <section className="page-intro"><p className="eyebrow">108 lessons</p><h1>《教你炒股票》</h1><p>按照原始发表顺序阅读。每篇课程将逐步补齐作者回复、概念标签、勘误和相关课程。</p></section>
      <section className="lesson-list" aria-label="课程目录">
        {lessons.map(([no,title,date,tag]) => <article className="lesson-row" key={no}><span className="lesson-no">{String(no).padStart(3,"0")}</span><div><h2>{title}</h2><p>{tag}</p></div><time>{date}</time><span className="coming">索引整理中</span></article>)}
      </section>
      <p className="archive-note">本页先展示知识路径中的代表课程；108 篇完整目录与逐课内容正在导入。</p>
    </main>
  );
}
