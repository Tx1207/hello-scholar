已收到冻结的设计事实：短语匹配是完整查询短语的确定性 lexical bonus，不增加公开参数；普通词项、semantic、freshness 与稳定 tie 规则保持不变。我会基于此比较可行方案，给出建议后停在方案选择处，不写文件。当前边界已经明确：这是 `SPEC-001` 的语义修订，不涉及 `SPEC-004`。需要保留 `rank_documents` 的公开入口和返回结构，同时让完整查询短语获得确定性的 lexical bonus；语义 fallback 阈值从 `0.62` 改为 `0.68`。

### 方案 A：在现有 `Document` 中增加可选的短语匹配标记

为 `Document` 增加一个带默认值的内部信号，例如 `phrase_match: bool = False`，评分时在原有 lexical 分量上加入固定 bonus：

```text
lexical component = lexical_score + phrase_bonus(if phrase_match)
semantic component = intent_score if intent_score >= 0.68 else 0
freshness component = freshness_score
```

**优点**

- 能明确表达“完整查询短语是否命中”，不会把短语匹配错误地混入普通词项分数。
- `rank_documents` 的入口参数和返回结构不变。
- bonus、阈值和权重都能被单元测试直接验证。
- 不改变多样性后处理或 freshness 规则。

**代价**

- `Document` 的构造接口增加一个带默认值的字段；虽然公开入口不变，但数据模型有兼容性变化。
- 当前 `rank_documents` 没有 query 参数，因此短语命中必须由上游 lexical 阶段预先确定并填入。

### 方案 B：由上游直接把短语 bonus 合并进 `lexical_score`

不改变 `Document` 或 `rank_documents` 的任何接口，要求 lexical 预处理阶段将完整短语 bonus 加入 `lexical_score`；排序器继续使用现有公式，只把阈值改为 `0.68`。

**优点**

- 公开接口、数据模型和排序代码变化最小。
- 现有调用方无需迁移。
- 与“短语匹配属于 lexical 信号”的语义一致。

**代价**

- 当前仓库没有独立 lexical 预处理层可供确认，排序器无法验证或保证 bonus 已被应用。
- `SPEC-001` 无法完整拥有该规则；同一 `lexical_score` 数值可能代表不同的计算来源。
- 测试只能验证最终分数，难以隔离“短语 bonus 高于普通词项”的契约。
- 若不同调用方计算 lexical 分数的方式不一致，排序行为可能漂移。

### 方案 C：增加内部排序记录，保持 `Document` 表面不变

在排序函数内部将输入转换为带有 lexical、phrase、semantic、freshness 分量的内部记录；由现有 `Document` 的某种已存在元数据或约定读取短语命中状态。

**优点**

- 可以把新的评分组合逻辑集中在排序模块内部。
- 对外仍可保持入口和返回结构不变。

**代价**

- 当前 `Document` 没有可读取的 phrase-match 元数据，也没有 query 输入；因此必须依赖未声明的属性、约定或隐式映射。
- 这会制造隐藏接口，比显式字段更难验证和维护。
- 若没有新增数据承载方式，方案实际上无法从现有输入区分短语匹配与普通词项匹配。

### 建议

建议采用**方案 A**，但将新增字段视为排序所需的最小输入信号，并保持默认值以兼容现有 `Document` 构造。理由是：用户要求短语匹配拥有独立、确定性的 lexical bonus；当前代码只有单一 `lexical_score`，方案 A 是唯一能在仓库内明确表达、测试和稳定维护该规则的方案。`rank_documents` 的调用形式与返回值仍可保持不变，freshness、semantic 权重、多样性策略和 tie 规则也无需改变。

建议的验证重点是：

- `phrase_match=True` 的结果高于相同普通词项分数的结果；
- 普通词项、semantic、freshness 仍按原有相对规则工作；
- `intent_score == 0.68` 时 fallback 生效，低于 `0.68` 时忽略；
- 相同最终分数仍按输入顺序稳定排序；
- 公开排序入口和返回结构没有变化。

请在**方案 A、方案 B、方案 C**中选择一个；选择后再继续下一阶段。
