import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getLessonTags, lessons } from "../data/lessons";

export const metadata: Metadata = { title: "专题索引｜缠论原典", description: "按分型、笔、线段、中枢、背驰、买卖点与多级别关系查找原始课程。" };

const topics = [
  { name: "分型", note: "三根处理后K线、确认、辅助操作与结构心理", ids: [62,65,79,81,82] },
  { name: "笔与线段", note: "从笔的基础结构到线段划分及后续再分辨", ids: [62,63,64,65,67,71,78,83] },
  { name: "中枢", note: "走势中枢、扩张、震荡与走势类型之间的关系", ids: [17,20,21,25,89,90,92,102] },
  { name: "背驰", note: "趋势、盘整背驰、力度、级别与辅助判断", ids: [15,24,25,27,29,37,43,44] },
  { name: "买卖点", note: "三类买卖点、完备性、再分辨与区间套定位", ids: [16,20,21,26,31,53,61,73] },
  { name: "多级别与当下", note: "多义性、同级别分解、图形生长与两重表里关系", ids: [32,33,36,38,39,40,68,88,91,93,99] },
];

export default function Topics(){
  return <main className="inner-page"><SiteHeader /><section className="page-intro split-intro"><div><p className="eyebrow">Concept map</p><h1>专题索引</h1></div><p>专题只负责建立连接，不改变课程原始顺序。每个概念都回到相关课程，而不是用一句“口诀”替代上下文。</p></section><section className="topic-index">{topics.map((topic,index)=><article key={topic.name}><header><span>0{index+1}</span><div><h2>{topic.name}</h2><p>{topic.note}</p></div></header><div className="topic-lessons">{topic.ids.map(id=>{const lesson=lessons[id-1]; return <a href={`/courses/${id}`} key={id}><small>第{id}课</small><strong>{lesson.title}</strong><span>{getLessonTags(lesson).join(" · ")}</span><b>→</b></a>})}</div></article>)}</section><SiteFooter /></main>
}
