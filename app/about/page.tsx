import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "本站方法｜缠论原典", description: "缠论原典的资料分层、来源核验、争议处理与风险说明。" };

const methods = [
  ["01", "先保存上下文", "标题、发表日期、课程顺序和讨论对象一起保存。短摘句只能导航，不能替代全文。"],
  ["02", "区分说话的人", "作者正文、作者回复、读者问题、转载者注释和本站整理分别标记。"],
  ["03", "以后文核对前文", "正式更正和后续限定进入证据链，不把早期表述孤立地当成最终规则。"],
  ["04", "让规则可以被检验", "能写成程序的规则必须给出输入、边界、反例和逐根验证过程。"],
  ["05", "保留尚未确定的部分", "中阴与当下本就包含未确定性；资料不足时明确写“待核验”。"],
  ["06", "研究不等于荐股", "历史案例用于理解结构，不用于暗示未来收益，更不提供个股买卖承诺。"],
];

export default function About(){return <main className="inner-page"><SiteHeader /><section className="page-intro split-intro"><div><p className="eyebrow">Methodology</p><h1>本站方法</h1></div><p>这是一座资料站，也是一套研究约束。目标不是抢着给出答案，而是让每个答案都能回到证据。</p></section><section className="method-grid">{methods.map(([no,title,text])=><article key={no}><span>{no}</span><h2>{title}</h2><p>{text}</p></article>)}</section><section className="about-source"><div><p className="eyebrow">Source policy</p><h2>本站不全文复制其他资料站</h2></div><p>我们保存课程目录、必要的短摘句、出处和本站原创整理；完整原文通过来源链接阅读。这样既保持可核查，也尊重档案维护者的长期劳动。</p></section><aside className="disclaimer"><strong>重要说明</strong><p>本站用于理论研究和资料索引，不提供个股推荐，不承诺收益，不构成证券投资建议。市场具有风险，任何交易决定由使用者自行承担。</p></aside><SiteFooter /></main>}
