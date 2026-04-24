# 文献集合清单 Schema

当某个 Zotero collection 在“集合范围”内被导入或审计时，使用这份笔记。

## 规范路径

```text
Knowledge/Zotero-Collection-{collection-slug}-Inventory.md
```

## Frontmatter

```yaml
---
type: zotero-collection-inventory
collection: Cross Subject
collection_slug: cross-subject
source: zotero
coverage_expected: 16
coverage_actual: 16
updated: 2026-03-18T00:00:00Z
---
```

## 必需章节

```markdown
# Cross Subject Inventory

## Coverage Summary
- Expected items: 16
- Canonical notes: 16 / 16

## Item Mapping
| Zotero Key | Item Title | Canonical Note | Status |
|---|---|---|---|
| ABCDEFGH | Example title | Papers/Wang-2026-Example-Paper.md | covered |

## Triage
- fully covered
- skipped or bridge-only notes
- items that still need full notes
```

## 规则
- 每个 collection slug 只保留一份持久化 inventory note。
- `Canonical Note` 应使用相对于项目的笔记路径。
- `Canonical Note` 通常遵循 `Papers/{FirstAuthor}-{Year}-{ShortTitle}.md`。
- `Status` 应使用小而稳定的词汇集，如 `covered`、`bridge-only`、`skipped`、`needs-review`。
- 每次重新批量处理该 collection 时，都要更新覆盖数量。
