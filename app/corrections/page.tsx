import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { archiveSource } from "../data/lessons";

export const metadata: Metadata = { title: "更正与版本｜缠论原典", description: "记录作者正式更正、补充限定、版本差异和本站整理状态。" };

const records = [
  { date: "2007-09-13", kind: "原文更正线索", title: "《各位注意，严重更正》", note: "该文位于第80课与第81课之间，是研究分型、笔、线段时必须纳入的时间线节点。", lesson: 81 },
  { date: "2007-09-17", kind: "课程内更正", title: "第81课：图例、更正及分型、走势类型的哲学本质", note: "课程标题本身明确包含“更正”。阅读早期分型与线段材料时，应与本课及后续课程对照。", lesson: 81 },
  { date: "整理中", kind: "版本核验", title: "原博客、存档站与转载版本差异", note: "仅在能够同时保存来源、时间和差异内容时登记；尚未核验的数量不对外宣称。", lesson: null },
];

export default function Corrections(){return <main className="inner-page"><SiteHeader /><section className="page-intro split-intro"><div><p className="eyebrow">Corrections & versions</p><h1>更正与版本</h1></div><p>这里不追求一个漂亮但未经核验的数字。每条更正必须能回答：谁更正、何时更正、更正了什么、它影响哪些早期表述。</p></section><section className="correction-list">{records.map(record=><article key={record.title}><div><time>{record.date}</time><span>{record.kind}</span></div><div><h2>{record.title}</h2><p>{record.note}</p>{record.lesson ? <a href={`/courses/${record.lesson}`}>查看关联课程 →</a> : <a href={archiveSource} target="_blank" rel="noreferrer">前往资料源核对 ↗</a>}</div></article>)}</section><aside className="verification-note"><strong>核验规则</strong><p>“正式更正”只用于作者明确否定或替换早期表述；“补充限定”用于增加适用条件；“版本差异”只描述文本或配图差别；本站推论永远单独标注。</p></aside><SiteFooter /></main>}
