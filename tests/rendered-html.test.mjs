import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

async function htmlAt(path) {
  const response = await render(path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("首页呈现真实资料规模和主要入口", async () => {
  const html = await htmlAt("/");
  assert.match(html, /缠论原典/);
  assert.match(html, /完整108课/);
  assert.match(html, /专题索引/);
  assert.match(html, /108\/108/);
  assert.match(html, /1,165/);
  assert.doesNotMatch(html, /968|116条/);
});

test("关键课程具有独立可访问页面", async () => {
  const lesson62 = await htmlAt("/courses/62");
  assert.match(lesson62, /分型、笔与线段/);
  assert.match(lesson62, /2007-06-30/);
  assert.match(lesson62, /返回108课目录/);
  assert.match(lesson62, /<title>第62课：分型、笔与线段｜缠论原典<\/title>/);
  assert.match(lesson62, /https:\/\/blog\.sina\.com\.cn\/chzhshch/);
  assert.match(lesson62, /查看完整镜像/);
  assert.match(lesson62, /本地存档核验/);
  assert.match(lesson62, /\/archive\/lessons\/62\/01\.jpeg/);
  assert.match(lesson62, /property="og:image" content="https:\/\/eczsc\.com\/archive\/lessons\/62\/01\.jpeg"/);
  const lesson108 = await htmlAt("/courses/108");
  assert.match(lesson108, /何谓底部/);
  assert.doesNotMatch(lesson108, /property="og:image"/);
});

test("目录与专题页可服务端呈现", async () => {
  const courses = await htmlAt("/courses");
  assert.match(courses, /全部 108 篇/);
  assert.match(courses, /完整目录与本地存档均已核验/);
  assert.match(courses, /访问作者原博客/);
  assert.match(courses, /查看存档核验/);
  const topics = await htmlAt("/topics");
  assert.match(topics, /多级别与当下/);
});

test("存档核验页呈现清洗结果和证据规模", async () => {
  const archive = await htmlAt("/archive");
  assert.match(archive, /存档核验/);
  assert.match(archive, /108\/108/);
  assert.match(archive, /75,349/);
  assert.match(archive, /1,165/);
  assert.match(archive, /清理的是网站外壳，不是资料来路/);
});

test("课程筛选和搜索不依赖浏览器脚本", async () => {
  const chapter = await htmlAt("/courses?chapter=fractals-segments");
  assert.match(chapter, /class="active" href="\/courses\?chapter=fractals-segments"/);
  assert.doesNotMatch(chapter, /不会赢钱的经济人/);
  const search = await htmlAt("/courses?q=分型");
  assert.match(search, /分型、笔与线段/);
  assert.doesNotMatch(search, /没有庄家，有的只是赢家和输家/);
  assert.match(search, /<form action="\/courses" method="get">/);
});
