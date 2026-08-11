当前确认结果：

- 变更属于搜索相关性排序，现有归属最可能是 `SPEC-001`（`SPEC-004` 明确不拥有 lexical、phrase、semantic 或 freshness 权重）。
- 当前实现入口是 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/src/ranking.py:12` 的 `rank_documents(documents, intent_threshold=0.62)`，返回 `list[str]`；多样性策略不在该模块中。
- 当前 `Document` 只有 `lexical_score`、`intent_score`、`freshness_score`，没有短语完全匹配信号。因此“短语完全匹配高于普通词项匹配”不能仅通过把阈值 `0.62` 改为 `0.68` 实现。
- 当前评分为 `lexical * 0.7 + semantic * 0.2 + freshness * 0.1`；低于阈值的 intent score 被置零。现有测试只覆盖基本 lexical 优先和 `0.61` 被忽略，尚未覆盖短语优先、`0.68` 边界、freshness 或稳定 tie。
- `SPEC-001` 当前已接受、revision 2，并明确记录阈值 `0.62`；本次是语义修订，后续应在用户批准完整修订稿后更新该 Spec，保持公开入口、返回结构、多样性策略和 freshness 规则不变。
- 文档检查通过结构校验，现有两个 Index 当前有效；仅提示两个已接受 Spec 尚无 Plan/Tasks。工作区未发现未提交变更。

可行设计：

1. **新增短语匹配信号**
   - 扩展内部 `Document` 数据以表达 phrase-exact 分数，再在 relevance score 中给予其高于普通 lexical 的优先级。
   - 优点：语义清晰、可直接测试“phrase > ordinary terms”。
   - 代价：会改变输入数据模型；需要确认这是否属于允许保持不变的“公开入口”范围。

2. **复用现有 `lexical_score` 的编码约定**
   - 由调用方将短语完全匹配编码成更高的 `lexical_score`，排序器只负责保持该优先级，同时把阈值改为 `0.68`。
   - 优点：不改入口、不改返回结构、实现最小。
   - 代价：排序模块无法验证或表达 phrase 与普通词项的区别，契约依赖调用方未记录的分数标度。

3. **增加内部排序策略但保持 `Document` 构造兼容**
   - 通过额外的内部 phrase-match 映射或策略参数提供短语信息，入口返回值不变。
   - 优点：可表达明确规则。
   - 代价：会引入新的隐式数据通道或参数，复杂度高于当前需求，且仍需定义调用方如何提供信号。

在继续比较完整修订稿之前，需要确认一个会改变接口边界的决定：

**“公开入口不变”是否也意味着 `Document` 的构造字段必须完全不变？**  
请在以下两项中选择其一：

- **A：字段也必须不变**，接受由调用方编码 `lexical_score` 来体现短语优先；
- **B：只要求 `rank_documents` 的入口与返回结构不变**，允许为 `Document` 增加一个明确的 phrase-match 字段。
