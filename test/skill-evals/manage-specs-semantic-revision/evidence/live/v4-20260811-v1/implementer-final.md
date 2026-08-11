✅ 【hello-scholar】- Draft Spec 已完成，等待整文件审核 - manage-specs

已按确认的 `Update Existing Spec` 修订：

- 保留身份 `SPEC-001`、Topic、Bundle 路径和 `created`。
- `revision: 2 → 3`，`status: draft`，更新日期为 `2026-08-11`。
- phrase exact match 权重高于 ordinary term match。
- semantic-intent fallback 阈值更新为 `0.68`。
- 保留公开 `rank_documents` 入口、返回结构、freshness、稳定 tie 行为、来源多样性和 pagination 边界。
- 清除旧的“仅 exact-term”表述及历史中具体的旧阈值 `0.62`，保留简洁 Revision History。
- 未修改 source、tests、SPEC-004、Architecture、Plan、Tasks 或其他文档。

已运行：

```text
hello-scholar docs sync
docs sync: written 2, deleted 0, errors 0, notices 4
```

最终 Git 范围仅包含：

- `/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- `/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a/hello-scholar/specs/INDEX.md`
- `/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a/hello-scholar/specs/search-ranking/INDEX.md`

完整 Draft 如上文件所示，现交给你进行 whole-file review；尚未标记为 accepted。
