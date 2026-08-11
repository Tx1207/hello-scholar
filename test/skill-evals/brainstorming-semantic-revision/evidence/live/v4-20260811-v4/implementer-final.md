已完成并验证：

- 仅写入 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`。
- `SPEC-001` 已更新为 `status: draft`、`revision: 3`、`updated: 2026-08-11`，并保留简洁 Revision History。
- 已通过绝对 CLI `hello-scholar docs sync` 刷新：
  - `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b/hello-scholar/specs/search-ranking/INDEX.md`
- 回读自审确认：bounded `0.15` phrase bonus、semantic threshold `0.68`、原 lexical/semantic/freshness 权重、公开入口、返回结构、稳定 tie、freshness 和 `SPEC-004` 多样性边界均已保留且内部一致。
- `hello-scholar docs check` 通过，`errors: 0`；仅保留既有 Plan/Tasks 缺失 notices。
- Git 变更仅包含上述一个 Spec 与两个生成 Index；未修改 Plan、Tasks、Architecture、source 或 tests。

result: SPEC-001 revision 3 已按批准修订稿写入，Index 已刷新并完成语义守恒自审。
