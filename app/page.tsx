import Link from "next/link";

const topics = [
  ["K线与包含", "从第一根K线开始，理解方向、包含与唯一处理。"],
  ["分型与严格笔", "把顶底分型、独立K线和端点修正放进同一套规则。"],
  ["线段与中枢", "从笔到更高级别结构，明确概念之间的边界。"],
  ["背驰与买卖点", "回到原文语境，区分定义、条件与事后解释。"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="缠论原典首页">
          <span className="seal">缠</span>
          <span><strong>缠论原典</strong><small>eczsc.com</small></span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/courses">教你炒股票</Link>
          <Link href="/topics">专题索引</Link>
          <Link href="/corrections">原文更正</Link>
          <Link href="/about">研读方法</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">从原文出发 · 让定义可查 · 让规则可证</p>
          <h1>不急着解释走势，<br />先把原文读准确。</h1>
          <p className="lede">
            一个以《教你炒股票》系列、作者回复与勘误记录为基础的缠论知识站。
            原文、回复、整理者注释分层呈现，让每条结论都能回到出处。
          </p>
          <div className="hero-actions">
            <Link className="primary" href="/courses">从第 1 课开始</Link>
            <Link className="secondary" href="/topics">按概念查找</Link>
          </div>
        </div>
        <aside className="principle-card" aria-label="本站原则">
          <span>01</span>
          <p>原文不是装饰，<br />而是判断的边界。</p>
          <div className="ink-line" />
          <small>区分原文、作者回复、读者提问与本站释义</small>
        </aside>
      </section>

      <section className="evidence-strip" aria-label="资料规模">
        <div><strong>108</strong><span>篇课程逐课索引</span></div>
        <div><strong>968</strong><span>条规则与证据记录</span></div>
        <div><strong>116</strong><span>处勘误与版本说明</span></div>
      </section>

      <section className="topic-section">
        <div className="section-heading">
          <p className="eyebrow">知识路径</p>
          <h2>从最小结构，走向完整走势</h2>
          <p>每个专题都同时给出定义、上下文、相关回复和容易混淆的边界。</p>
        </div>
        <div className="topic-grid">
          {topics.map(([title, desc], index) => (
            <Link href="/topics" className="topic-card" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <p>“市场的走势是有级别的，级别是客观存在的。”</p>
        <span>— 原文摘句 · 后续将附课程与日期出处</span>
      </section>

      <footer>
        <div><strong>缠论原典</strong><span>以可核查的方式，保存一套思想的来路。</span></div>
        <p>本站用于理论研究与资料整理，不构成投资建议。</p>
      </footer>
    </main>
  );
}
