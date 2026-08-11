基于当前事实和已确认约束，有三种可行方案。

### 方案 A：在 `Document` 中增加确定性短语匹配标记，由评分器施加内部 bonus（推荐）

- 保持 `rank_documents` 的公开入口和参数不变。
- 为 `Document` 增加一个默认值为 `False` 的短语匹配字段；调用方在已有 lexical 解析阶段确定是否完整匹配查询短语。
- `rank_documents` 在原有 lexical、semantic、freshness 评分之外，对完整短语匹配施加固定 lexical bonus。
- 普通词项、semantic 和 freshness 仍按现有规则参与评分；semantic fallback 阈值改为 `0.68`。
- 稳定排序仍使用现有输入顺序作为 tie-breaker。

**优点：** 短语规则显式、可测试、确定性强；不会把短语语义误塞进 semantic 分数，也不改变入口或返回结构。  
**代价：** `Document` 输入模型增加一个兼容默认字段；需要明确 bonus 的数值及其“不压过更高质量 lexical/semantic/freshness 结果”的边界。

### 方案 B：由调用方把短语 bonus 预先合并进 `lexical_score`

- 不改变 `Document` 结构，也不改变 `rank_documents` 签名。
- 调用方将完整短语匹配 bonus 直接折算进现有 `lexical_score`。
- 排名器只继续消费既有 lexical 分数，同时把阈值改为 `0.68`。

**优点：** 排名器接口和数据结构完全不变，改动最小。  
**代价：** `rank_documents` 无法区分短语匹配和普通词项匹配；短语优先级的合同被隐藏在调用方，测试和审计难以证明；不同调用方可能产生不一致的 lexical 分数。它也削弱了 `SPEC-001` 对 relevance weights 的集中 ownership。

### 方案 C：在 `rank_documents` 内部从现有数据推断短语匹配

- 尝试根据当前 `lexical_score` 或其他现有字段推断完整短语匹配。
- 保持所有接口和结构不变。

**优点：** 表面上零接口变化。  
**代价：** 当前 `Document` 没有 query、文本或 phrase-match 信息，单凭一个综合 lexical 分数无法可靠区分完整短语与普通词项；确定性 lexical bonus 无法被正确实现。因此不建议采用。

### 建议

建议选择**方案 A**：将“是否完整查询短语匹配”作为已有 lexical 阶段产生的确定性事实传入，评分器负责统一施加 bonus；保持 `rank_documents` 公开入口、返回结构、多样性策略、freshness 规则和稳定 tie 规则不变。阈值 `0.62 → 0.68` 属于同一 relevance Spec 的语义修订，短语 bonus 也应纳入 `SPEC-001`，而不是新建独立 Spec。

下一步需要你选择方案 A、B 或 C；在选择前我不会确定 owner、起草完整 Spec，或修改任何文件。
