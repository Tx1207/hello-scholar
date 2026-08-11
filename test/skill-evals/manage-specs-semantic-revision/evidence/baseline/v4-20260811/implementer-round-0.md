分类：`Update Existing Spec`

证据：
- 目标变化属于相关性评分语义：短语完全匹配权重高于普通词项，并将 semantic fallback threshold 从 `0.62` 调整为 `0.68`。
- `SPEC-001` 已明确拥有 lexical、intent、freshness 信号及其配置，并维护 `rank_documents` 的稳定评分契约。
- `SPEC-004` 明确不负责 lexical、phrase、semantic、freshness 权重，仅负责 relevance ranking 之后的 source diversity，因此不应更新它。
- 公开 `rank_documents` 入口、返回结构、freshness 规则、稳定 tie 行为及 diversity 边界均属于现有契约，应在 `SPEC-001` 修订中保留。

拟更新的唯一 Spec：

`/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`

将保留 `SPEC-001` 身份与路径，进行语义修订并在确认后提升 revision、设为 `draft`、追加 Revision History；随后才运行 CLI 刷新生成的 Index。当前没有修改任何项目文件，也没有创建 Spec、Plan 或 Tasks。

needs input: 请确认更新身份为 `SPEC-001`（上述完整路径）。
