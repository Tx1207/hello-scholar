# Properties（Frontmatter）参考

Properties 使用位于笔记开头的 YAML frontmatter：

```yaml
---
title: My Note Title
date: 2024-01-15
tags:
  - project
  - important
aliases:
  - My Note
  - Alternative Name
cssclasses:
  - custom-class
status: in-progress
rating: 4.5
completed: false
due: 2024-02-01T14:30:00
---
```

## Property 类型

| Type | Example |
|------|---------|
| Text | `title: My Title` |
| Number | `rating: 4.5` |
| Checkbox | `completed: true` |
| Date | `date: 2024-01-15` |
| Date & Time | `due: 2024-01-15T14:30:00` |
| List | `tags: [one, two]` 或 YAML 列表 |
| Links | `related: "[[Other Note]]"` |

## 默认 Properties

- `tags`：笔记标签，可搜索，也会出现在 graph view
- `aliases`：笔记别名，会用于链接建议
- `cssclasses`：应用到阅读/编辑视图中的 CSS classes

## Tags

```markdown
#tag
#nested/tag
#tag-with-dashes
#tag_with_underscores
```

Tags 可以包含：
- 任意语言的字母
- 数字（但不能作为首字符）
- 下划线 `_`
- 连字符 `-`
- 正斜杠 `/`（用于嵌套）

在 frontmatter 中可这样写：

```yaml
---
tags:
  - tag1
  - nested/tag2
---
```
