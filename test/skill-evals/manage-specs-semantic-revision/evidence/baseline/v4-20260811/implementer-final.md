已按确认的 `Update Existing Spec` 完成修订，未创建其他文档、Plan、Tasks、代码、Run 或 memory。

目标 Spec：

`/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`

完整 draft 结果：
- `status: draft`
- `revision: 3`
- 保留 `SPEC-001`、Topic、Bundle 路径及原有生命周期边界。
- 新增短语完全匹配优先于普通词项的相关性规则。
- 语义 `intent_score` 回退阈值从 `0.62` 修订为 `0.68`。
- 保留公开 `rank_documents` 入口、返回结构、freshness 规则、确定性评分和稳定 tie 行为。
- 明确保留 `SPEC-004` 对结果多样性的独立 ownership；本 Spec 不接管 diversity。
- Revision History 已追加 revision 3，旧 revision 2 内容仅保留为历史记录。

已由指定绝对 CLI 刷新：
- `/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline/hello-scholar/specs/INDEX.md`
- `/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline/hello-scholar/specs/search-ranking/INDEX.md`

验证结果：
- `python3 -m unittest discover -s tests -v`：2/2 tests passed。
- `hello-scholar docs check`：2 个 Index current，0 errors；仅有既有 Plan/Tasks 缺失 notices。
- `git diff --check`：通过。
- 最终变更范围仅为上述 Spec 与两份生成 Index；Python 缓存已清理。

result: SPEC-001 已完成 revision 3 draft 修订并刷新 Index，所有批准的未受影响契约均已保留。
