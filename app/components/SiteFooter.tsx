import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><strong>缠论原典</strong><span>从出处到定义，从定义到可验证的规则。</span></div>
      <div className="footer-links"><Link href="/about">资料说明</Link><Link href="/corrections">勘误原则</Link></div>
      <p>用于理论研究与资料整理，不构成投资建议。</p>
    </footer>
  );
}
