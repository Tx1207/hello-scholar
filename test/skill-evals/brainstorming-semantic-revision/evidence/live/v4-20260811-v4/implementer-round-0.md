当前影响已确认：

- 变更属于 `SPEC-001` 的同一 relevance 生命周期，应修订现有 Spec；不涉及 `SPEC-004` 的多样性策略。
- `src/ranking.py` 当前通过 `lexical_score * 0.7 + semantic * 0.2 + freshness * 0.1` 排序，语义阈值写死为 `0.62`。
- `tests/test_ranking.py` 仅覆盖旧阈值行为，未覆盖短语完全匹配与普通词项匹配之间的精确优先级。
- 公开入口、返回结构、稳定 tie 顺序、freshness 以及 post-ranking diversity 均可保持不变。
- 本轮未修改任何项目文件；Git 工作区保持干净。

唯一的材料性设计问题是：当前 `Document` 只有一个 `lexical_score`，没有独立的短语完全匹配信号。要形成可审核且可实现的修订稿，必须确定短语完全匹配如何表达：

**是否同意扩展内部文档评分数据，新增一个独立的 phrase-exact 信号（例如 `phrase_exact_score`/布尔标记），并在不改变 `rank_documents` 公开入口与返回结构的前提下，将其作为高于普通 lexical score 的排序层级？**

请先确认这一点；我会在你的回答后再比较具体方案。本轮已按要求停止，不会写文件、分类 Spec、创建 Plan 或实现代码。
