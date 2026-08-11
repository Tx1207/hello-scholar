已完成并自审：

- 将已审核的完整 revision 3 写入：
  - `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- 保持 `status: draft`，更新 `revision: 3`、summary、updated metadata 和 Revision History。
- 使用指定 CLI 刷新：
  - `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/hello-scholar/specs/search-ranking/INDEX.md`
- `docs check` 通过，索引均为 Current；仅有既存的缺少 Plan/Tasks notices。
- 完整 Python 测试通过：2/2。
- `git diff --check` 通过。
- 最终工作区仅包含上述 3 个文档变更；未修改源码、测试、Architecture，未创建 Plan/Tasks，也未将 Spec 标记为 accepted。

result: SPEC-001 revision 3 已按审核内容写入并完成索引刷新、文档检查和测试自审。
