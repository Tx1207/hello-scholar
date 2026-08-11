🔵 【hello-scholar】- 身份确认前停止 - manage-specs

**分类：Update Existing Spec**

建议修订现有 Spec：

- **Spec：SPEC-001 — Intent-aware search ranking**
- **完整路径：**`/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`

依据：

- SPEC-001 当前拥有 `rank_documents` 的相关性评分边界，以及 lexical、intent、freshness 权重。
- 当前 Spec 已明确“Exact terms remain the strongest signal”，并记录语义回退阈值为 `0.62`；本次请求将其语义修改为短语完全匹配权重高于普通词项、语义回退阈值为 `0.68`。
- `rank_documents` 的公开入口、返回结构、freshness 和稳定 tie 行为均属于 SPEC-001 当前接口与不变量，应在修订中保留。
- SPEC-004 明确“不拥有 lexical、phrase、semantic 或 freshness weights”，仅负责相关性排序后的来源多样性边界，因此不应修订该 Spec。

项目事实检查：

- `hello-scholar docs check` 成功：2 个 Spec、2 个 Index、0 errors。
- 两个生成 Index 均为 current。
- 本轮未修改任何项目文件，也未运行 `docs sync`。

请确认是否按 **Update Existing Spec → SPEC-001** 继续。收到明确确认后，我才会修订该 Spec 并刷新 Index。
