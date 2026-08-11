当前有三种可行设计：

### 方案 A：将 phrase bonus 归一到现有 `lexical_score`（推荐）

由 lexical 评分产生方识别“完整查询短语匹配”，并把确定性 bonus 合并进传入 `rank_documents` 的 `lexical_score`。`ranking.py` 继续使用现有公式：

```text
lexical_score * 0.7 + semantic_score * 0.2 + freshness_score * 0.1
```

同时将 semantic fallback 阈值从 `0.62` 改为 `0.68`。

**优点**

- 不新增公开入口参数、返回字段或 `Document` 字段。
- 完全保留普通词项、semantic、freshness 和稳定 tie 规则。
- 与当前 `src/ranking.py` 的职责一致：它只消费相关性信号并排序。
- 对 `SPEC-004` 的多样性后处理没有影响。

**代价与风险**

- 当前仓库没有独立的 lexical scorer 或查询文本处理模块，因此需要在 Spec 中明确：`lexical_score` 已包含确定性的完整短语 bonus。
- 必须定义 bonus 的数值或归一化规则，确保完整短语匹配确实高于普通词项匹配，而不是只依赖测试样例的手工分数。
- 验证重点会落在 lexical score 生产合同及排序边界测试上。

### 方案 B：在 `Document` 中增加内部 phrase-match 信号

增加类似 `phrase_match_score` 或布尔字段，在 `score()` 内显式计算 bonus，再与现有 lexical 分数合并。

**优点**

- “短语优先”在排序代码中显式可见，验收更直接。
- 可以单独测试 phrase bonus 与普通词项、semantic、freshness 的相对关系。

**代价与风险**

- 即使不改变 `rank_documents` 的参数，`Document` 构造结构也会增加字段，实际扩大现有数据接口。
- 当前代码没有 query 或 phrase 归一化逻辑，新增字段会把 lexical 识别职责引入排序模块。
- 可能与“公开入口、返回结构不变”的兼容要求冲突，也会增加迁移和默认值问题。

### 方案 C：新增内部 ranking policy 或隐藏上下文

保持公开函数签名表面不变，在内部通过 policy、模块级配置或其他隐藏上下文提供 phrase bonus 规则。

**优点**

- 可以保留 `Document` 的现有字段。
- bonus 规则可集中配置。

**代价与风险**

- 隐藏输入会削弱同一输入得到同一结果的确定性不变量。
- 配置生命周期、测试隔离和调用方行为更复杂。
- 当前项目没有现成 policy/config 机制，属于为单一规则引入新抽象，超出最小变更范围。

### 建议

建议采用**方案 A**：把完整查询短语的确定性 bonus 定义为 `lexical_score` 的组成部分，在排序层不增加新的公开数据或参数；同时只调整 semantic fallback 阈值至 `0.68`。这样最符合当前 Architecture 与 `SPEC-001` 的边界，也能保持公开入口、返回结构、多样性策略、freshness 规则和 tie 规则不变。

在继续形成完整修订设计前，请选择：**采用方案 A、B 还是 C？**

needs input: 请确认 phrase bonus 采用哪一种设计方案。
