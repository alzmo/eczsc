import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="缠论原典首页">
        <span className="seal">缠</span>
        <span><strong>缠论原典</strong><small>eczsc.com</small></span>
      </Link>
      <nav aria-label="主导航">
        <Link href="/courses">108课</Link>
        <Link href="/topics">专题索引</Link>
        <Link href="/corrections">更正与版本</Link>
        <Link href="/about">本站方法</Link>
      </nav>
    </header>
  );
}
