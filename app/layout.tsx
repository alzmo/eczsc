import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://eczsc.com"),
  title: {
    default: "缠论原典｜从原文出发理解缠论",
    template: "%s",
  },
  description: "以《教你炒股票》系列、作者回复和勘误记录为基础的缠论知识索引。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "缠论原典",
    title: "缠论原典｜从原文出发理解缠论",
    description: "以《教你炒股票》108课为主线，让定义可查，让规则可证。",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "缠论原典" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "缠论原典｜从原文出发理解缠论",
    description: "以《教你炒股票》108课为主线，让定义可查，让规则可证。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
