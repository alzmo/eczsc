import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "缠论原典｜从原文出发理解缠论",
  description: "以《教你炒股票》系列、作者回复和勘误记录为基础的缠论知识索引。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
