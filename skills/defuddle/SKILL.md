---
name: defuddle
description: 使用 Defuddle CLI 从网页中提取干净 Markdown 内容，移除导航和杂乱内容以节省 tokens。当用户提供 URL 需要阅读或分析在线文档、文章、博客或标准网页时，优先用它替代 WebFetch。
---

# Defuddle

使用 Defuddle CLI 从网页中提取干净、可读内容。处理标准网页时优先于 WebFetch 使用，因为它能移除导航、广告和杂乱内容，减少 token 消耗。

如未安装：`npm install -g defuddle`

## 用法

始终使用 `--md` 输出 Markdown：

```bash
defuddle parse <url> --md
```

保存到文件：

```bash
defuddle parse <url> --md -o content.md
```

提取特定 metadata：

```bash
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain
```

## 输出格式

| Flag | Format |
|------|--------|
| `--md` | Markdown（默认选择） |
| `--json` | 包含 HTML 和 markdown 的 JSON |
| (none) | HTML |
| `-p <name>` | 指定 metadata 属性 |
