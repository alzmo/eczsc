# 缠论原典（eczsc.com）

以《教你炒股票》108课、作者回复与正式更正为基础的公开资料索引。网站坚持把原始出处、公开镜像、用户存档和本站整理分层展示。

## 来源原则

- 缠中说禅新浪博客是作者原始发表地址。
- `chzhshch.blog` 仅作为公开镜像，用于补充失效页面与缺失图片。
- 用户长期保存的共享档案只用于正文指纹、发表时间、图片和回复线索核验。
- 清洗转载站导航、广告、统计脚本和后期动态组件，不抹去作品署名与资料来源。

本站不会把镜像误标成原始出处，也不会把本站归纳写成作者原话。

## 档案导入

导入脚本位于 `scripts/import_czsc_archive.py`。它修复压缩包中的 GBK 文件名，限定读取课程正文区域，并生成结构化核验数据与经确认的原始图解：

```powershell
python scripts/import_czsc_archive.py C:\path\to\czsc.zip
```

可先使用 `--dry-run` 检查统计而不写入网站文件。依赖列在 `scripts/requirements-archive.txt`。

## 开发与验证

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run build
npm test
```

网站不要求登录，所有资料页面均可匿名阅读。内容仅用于理论研究和资料索引，不构成证券投资建议。
