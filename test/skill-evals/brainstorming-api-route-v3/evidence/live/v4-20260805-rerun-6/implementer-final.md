Round 4 已完成并通过自审：

- 已将审核通过的完整 Spec 写入：
  `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-070000/hello-scholar/specs/batch-retrieval/SPEC-014-public-batch-retrieval-api/spec.md`
- 保持 `status: draft`、`revision: 1`，未冒充正式 acceptance。
- 已运行 `docs check → docs sync → docs check`：
  - 0 errors
  - 全部 4 个 Index 为 current
  - 仅有预期的 Plan/Tasks missing notices
- 生成的 Index：
  - `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-070000/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-070000/hello-scholar/specs/batch-retrieval/INDEX.md`
- 最终 Bundle 仅包含 `spec.md` 和生成的 Index；没有创建 `plan.md`、`tasks.md`、代码或其他工件。

规划 owner：`writing-plans`。其输入是已接受的 `SPEC-014` revision 1、当前 Architecture、相关源码和测试；由于当前 Spec 仍为 draft，按 owner 规则下一步应先完成 Spec acceptance，之后再由 `writing-plans` 创建同一 Bundle 下的 `plan.md`。

result: 已写入并验证保持 draft 的 SPEC-014，同步批量检索设计已转交 writing-plans 等待 Spec acceptance。
