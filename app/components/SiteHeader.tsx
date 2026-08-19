/* eslint-disable @next/next/no-html-link-for-pages -- native navigation keeps the archive usable without client JavaScript */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="缠论原典首页">
        <span className="seal">缠</span>
        <span><strong>缠论原典</strong><small>eczsc.com</small></span>
      </a>
      <nav aria-label="主导航">
        <a href="/courses">108课</a>
        <a href="/archive">存档核验</a>
        <a href="/replies">作者回复</a>
        <a href="/topics">专题索引</a>
        <a href="/corrections">更正与版本</a>
        <a href="/about">本站方法</a>
      </nav>
    </header>
  );
}
