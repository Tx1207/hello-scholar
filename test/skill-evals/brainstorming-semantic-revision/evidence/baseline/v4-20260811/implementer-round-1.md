冻结消息已解决前一轮的材料问题：短语匹配是确定性的 lexical bonus，不能新增公开参数；普通词项、semantic、freshness 继续参与原评分，返回结构与稳定 tie 规则不变。

基于当前事实：

- `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/src/ranking.py` 的实际入口没有 `query` 参数，只有 `rank_documents(documents, intent_threshold=0.62)`。
- `Document` 当前只有三个分数域，没有 phrase-match 字段。
- `SPEC-001` 已拥有 lexical、semantic、freshness 权重与 intent fallback 阈值；`SPEC-004` 明确不拥有这些规则。
- 因此，短语识别不能在现有排序器中重新计算，除非改变入口或数据结构，这都超出“不新增公开参数”的约束。

可行方案：

1. **在进入 `rank_documents` 前把确定性 phrase bonus 合并进 `lexical_score`**
   - 将 `lexical_score` 的定义扩展为“普通词项 lexical 分数 + 完整查询短语 bonus”。
   - `rank_documents` 保持入口、返回值、权重公式和 tie 行为不变；只把默认 intent threshold 从 `0.62` 改为 `0.68`。
   - 优点：公开 API 和 `Document` 结构都不变，改动最小，符合当前代码边界。
   - 风险：需要在 Spec 中明确 lexical score 的来源和 bonus 的确定性、范围及“不改变 freshness”的约束；当前仓库没有 phrase 提供方代码，验证重点会落在契约测试上。

2. **给 `Document` 增加 phrase-match 字段**
   - 排序器内部将该字段转换成 lexical bonus，再叠加普通词项分数。
   - 优点：模型表达更直接，排序器可以单独测试 phrase 优先级。
   - 风险：虽然不增加 `rank_documents` 参数，但改变了公开数据结构/构造方式，与“不新增公开参数、公开入口不变”的意图不完全一致；还需要定义缺省值和兼容行为。

3. **增加内部策略对象或映射，仍由入口接收额外 phrase 信息**
   - 通过策略或隐藏映射向评分函数注入完整短语匹配状态。
   - 优点：可以保持 `Document` 表面字段不变。
   - 风险：会形成隐式输入通道，当前代码没有查询上下文承载它，复杂度和可观察性都差于方案 1，不适合这个范围。

**建议采用方案 1。**  
它把 phrase bonus 视为 lexical 信号的确定性组成部分，不引入新的公开参数或返回字段；后续修订应明确 phrase-exact lexical score 必须优先于普通词项匹配，同时保留原有 semantic/freshness 计算和稳定输入顺序 tie 规则。阈值应沿用当前 `>=` 语义，将 fallback 边界改为 `0.68`：`0.67` 不生效，`0.68` 生效。

后续 Spec 修订的验证范围应包括：

- 完整短语匹配高于普通词项匹配；
- `intent_score` 在 `0.67` 时被忽略、在 `0.68` 时生效；
- semantic 不能破坏 phrase lexical 优先级；
- freshness 规则与权重保持不变；
- 相同总分仍按输入顺序稳定排序；
- `rank_documents` 的公开入口和 `list[str]` 返回结构不变；
- 多样性策略不改动。

等待你选择或批准推荐的设计方向；在此之前不会写 Spec、Plan、Tasks 或代码。

needs input: 请确认采用方案 1，或指定方案 2/3 作为完整修订稿的设计基础。
