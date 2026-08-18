import Link from "next/link";
const groups = [
  ["01", "K线、包含与分型", ["K线包含关系", "结合律与处理方向", "顶分型与底分型", "分型的确认"]],
  ["02", "笔与线段", ["笔的定义", "旧笔与新笔", "端点与修正", "线段划分标准"]],
  ["03", "走势与中枢", ["走势终完美", "走势类型", "中枢定义", "中枢延伸与扩展"]],
  ["04", "背驰与买卖点", ["趋势力度", "背驰与盘整背驰", "三类买卖点", "区间套定位"]],
  ["05", "多级别与四象", ["级别递归", "两重表里关系", "四种笔状态", "多周期联立"]],
  ["06", "原文争议边界", ["作者正式更正", "回复中的补充", "版本差异", "本站暂不定论"]],
];
export default function Topics(){return <main className="inner-page"><header className="site-header compact"><Link href="/" className="brand"><span className="seal">缠</span><span><strong>缠论原典</strong><small>eczsc.com</small></span></Link><nav><Link href="/courses">教你炒股票</Link><Link href="/topics">专题索引</Link><Link href="/corrections">原文更正</Link><Link href="/about">研读方法</Link></nav></header><section className="page-intro"><p className="eyebrow">Concept map</p><h1>专题索引</h1><p>不是另造一套术语，而是把散落在课程与回复中的定义按概念重新连接。</p></section><section className="concept-list">{groups.map(([no,title,items])=><article className="concept-group" key={String(no)}><span>{no as string}</span><div><h2>{title as string}</h2><ul>{(items as string[]).map(x=><li key={x}>{x}</li>)}</ul></div></article>)}</section></main>}
