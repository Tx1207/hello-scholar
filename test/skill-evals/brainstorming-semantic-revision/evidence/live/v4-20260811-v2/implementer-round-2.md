🔵 【hello-scholar】- 完整修订稿待整份审核 - brainstorming / manage-specs

已按 `manage-specs` 完成身份确认。`hello-scholar docs check` 结果为 2 个 Spec、2 个 Index、0 个错误；Index 均为 Current。现有的 Plan/Tasks 缺失仅为 notices，不阻塞本次设计修订。工作区保持零写入。

## Spec 身份分类

**Update Existing Spec**

目标能力与 `SPEC-001` 已有相同的问题、owner 和生命周期：都属于 `src/ranking.py` 的 relevance scoring，涵盖 lexical、semantic intent 和 freshness。此次变化不是独立能力，也不替换协议、存储或生命周期边界，因此不创建新 Spec 或 successor。

Canonical Spec：

```text
hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md
```

建议 revision：`3`，状态保持 `draft`，等待本次完整修订稿审核。

## Baseline 与 Delta 处置

- 当前 lexical、semantic intent、freshness 共同构成 relevance score：**Keep**
- `rank_documents` 公开入口及 `list[str]` 返回结构：**Keep**
- 输入相同则得分确定：**Keep**
- 稳定输入顺序 tie-break：**Keep**
- exact lexical hits 强于 semantic-only hits：**Modify**，增加完整查询短语的 bounded lexical bonus 规则
- semantic fallback threshold `0.62`：**Modify** 为 `0.68`
- freshness 参与原有评分：**Keep**
- diversity 与 pagination 不属于本 Spec：**Keep**
- `SPEC-004` 的 post-ranking source cap：**Keep，不改动**
- 原“Revision 2: bounded semantic intent fallback at threshold 0.62”：**Modify** 为新的 revision history 记录
- 公开新增参数：**Remove / 不添加**
- 现有 public return shape：**Keep**

# Intent-aware Search Ranking

## Value and Current Decision

`SPEC-001` 统一拥有搜索 relevance scoring。Revision 3 在不改变公开 ranking 入口、返回结构、freshness 规则、diversity 策略或稳定排序规则的前提下，使完整查询短语的确定性 lexical match 高于普通词项匹配，并将 semantic fallback threshold 从 `0.62` 提高至 `0.68`。

## Problem and Current Facts

Keyword-only ranking misses semantically relevant documents, while unconstrained semantic matches can outrank exact query terms.

当前实现位于 `src/ranking.py`：

- lexical score 权重为 `0.7`
- semantic intent score 权重为 `0.2`
- freshness score 权重为 `0.1`
- `intent_score` 低于 threshold 时不参与 semantic fallback
- 当前 threshold 为 `0.62`
- 排序按 descending score；相同 score 按输入顺序稳定排序
- `rank_documents` 的公开入口和 `list[str]` 返回结构已被现有代码与测试使用

当前 `Document` 没有独立的 phrase-match 信号。因此，完整查询短语是否匹配必须由已有 lexical 阶段以确定性事实提供给 scoring layer；不得从综合 `lexical_score` 反向推断。

## Goals and Non-goals

### Goals

1. 完整查询短语匹配应高于普通词项匹配。
2. phrase match 使用确定性的 bounded lexical bonus。
3. 普通词项、semantic intent 和 freshness 继续参与原有评分。
4. semantic fallback threshold 从 `0.62` 提高到 `0.68`。
5. 保持 `rank_documents` 的公开入口和返回结构不变。
6. 保持稳定 tie 规则不变。
7. 保持 `SPEC-004` 的 post-ranking source diversity 策略不变。
8. 使相同输入产生确定性得分和排序。

### Non-goals

1. 不改变公开 ranking function 的参数列表。
2. 不改变返回的 document ID 列表结构。
3. 不把 phrase matching 建模为 semantic intent。
4. 不重写普通 lexical、semantic 或 freshness 权重。
5. 不改变 freshness 的定义、计算或权重。
6. 不改变 source diversity、pagination 或 post-ranking 行为。
7. 不从 `lexical_score` 推断 phrase match。
8. 不引入新的独立 ranking service 或持久化数据迁移。

## Target Design

评分仍由 lexical、semantic intent 和 freshness 三部分组成，并增加一个只属于 lexical relevance 的 bounded phrase bonus：

```text
semantic =
    intent_score, if intent_score &gt;= 0.68
    0.0, otherwise

score =
    lexical_score * 0.7
    + phrase_bonus
    + semantic * 0.2
    + freshness_score * 0.1
```

`phrase_bonus` 是由 lexical 阶段确定的内部事实转换而来的固定 bounded bonus：

- 完整查询短语匹配时使用固定 bonus；
- 非完整短语匹配时 bonus 为 `0`;
- bonus 只对完整查询短语匹配生效一次，不按重复词项累计；
- bonus 的上限为 `0.15`，不得通过 phrase signal 无限放大 lexical relevance；
- bonus 不成为 `rank_documents` 的公开参数；
- phrase match 与普通词项匹配的判定由调用方 lexical 阶段完成，并以输入模型中的内部字段传递；
- phrase bonus 不改变 semantic fallback 的 eligibility；
- freshness contribution 保持 `freshness_score * 0.1`；
- 不增加额外的 diversity 或 post-ranking 调整。

为保持已有稳定行为，排序仍为：

```text
sorted(..., key=lambda item: (-score(document), input_index))
```

因此，当总分相同时，输入顺序优先。

## Interfaces, Data, and Invariants

### Public interface

```text
rank_documents(documents: list[Document], intent_threshold: float = 0.68) -&gt; list[str]
```

公开 function 名称、调用形态、返回类型和 document ID 输出保持不变。`intent_threshold` 仍是已有参数，但其默认值改为 `0.68`；不新增公开参数。

### Input data

`Document` 保留现有字段：

- `document_id`
- `lexical_score`
- `intent_score`
- `freshness_score`

增加一个具有兼容默认值的内部 phrase-match signal，用于表达“完整查询短语是否确定性匹配”。缺省值表示非 phrase match，以保持现有构造方式的兼容性。该字段不改变返回结构，也不向 `rank_documents` 增加独立参数。

### Invariants

1. exact lexical phrase match 的 bonus 只属于 lexical relevance。
2. phrase match 不会被 semantic threshold 过滤。
3. `intent_score &lt; 0.68` 时 semantic contribution 为零。
4. `intent_score &gt;= 0.68` 时 semantic contribution 仍按原有 `0.2` 权重计算。
5. freshness contribution 始终按原有规则计算。
6. 相同输入及相同 phrase signal 必须得到相同 score。
7. 总分相同必须保持输入顺序。
8. `rank_documents` 仍只返回 document IDs。
9. source diversity 仍在 relevance ranking 之后由 `SPEC-004` 负责。

## Implementation Boundaries

`SPEC-001` 负责：

- lexical phrase bonus 的 relevance 规则；
- phrase-match signal 在 scoring input 中的表达；
- semantic fallback threshold `0.68`；
- lexical、semantic 和 freshness score composition；
- 相关单元测试和确定性排序验证。

现有 lexical 阶段负责提供完整查询短语的确定性匹配事实，但不改变公开 ranking 入口。

`SPEC-004` 继续负责 post-ranking per-source cap。本次修订不修改该 Spec、source diversity 策略或 pagination。

不修改 Architecture、Plan、Tasks、持久化数据或公开返回结构。

## Acceptance and Validation

验收必须覆盖：

1. 完整查询短语匹配文档在普通词项匹配文档之前。
2. phrase bonus 只计算一次，且不会超过 `0.15` 上限。
3. phrase match 不依赖 semantic score。
4. semantic score 为 `0.67` 时被忽略。
5. semantic score 为 `0.68` 时按原有权重参与。
6. ordinary lexical、semantic 和 freshness contributions 仍按既有权重计算。
7. phrase match、semantic 和 freshness 组合后的总分排序正确。
8. 总分相同时仍按输入顺序排序。
9. `rank_documents` 的返回值仍为 document ID 列表。
10. 既有调用方式不需要新增公开参数。
11. source diversity 与 freshness 规则没有回归。

验证证据：

- 更新后的 `tests/test_ranking.py`
- phrase match、threshold boundary、freshness、stable tie 的单元测试
- 完整 Python test suite
- 代码与测试 diff，确认公开入口、返回结构和 `SPEC-004` 未改变

## Migration and Rollback

不需要存储数据迁移。部署 ranking service 时同步更新默认 semantic threshold 和 phrase-match input handling。

如需回滚：

1. 恢复 phrase bonus 为 `0`；
2. 将 semantic fallback threshold 恢复为 `0.62`；
3. 恢复上一版本 ranking service。

返回结构和持久化数据均不需要迁移或兼容转换。

## Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold 0.62.
- Revision 3: add a bounded deterministic lexical bonus for complete query phrase matches and raise the semantic fallback threshold to 0.68 while preserving the public ranking contract, freshness rules, stable ties, and post-ranking diversity boundary.

---

请对以上完整修订稿进行整份审核。当前仍不会写入 `spec.md`，不会运行 `docs sync`，也不会创建 Plan、Tasks 或修改源码；只有在你明确批准这份精确 revision 后，才进入 Spec 写入与后续审核流程。
