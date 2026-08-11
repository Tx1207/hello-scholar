基于当前 `SPEC-001`、`src/ranking.py` 和测试，短语匹配可以有三种可行设计：

### 方案 A：在 lexical 分量中加入固定 bonus

保持原有结构：

```text
base_score = lexical_score * 0.7
             + semantic_score * 0.2
             + freshness_score * 0.1

final_score = base_score + phrase_bonus
```

其中 `phrase_bonus` 由完整查询短语是否确定性匹配决定，不暴露为公开参数。

- 优点：最接近“lexical bonus”的语义；semantic、freshness 和普通词项仍按现有公式参与。
- 风险：若 bonus 没有依据 lexical/semantic/freshness 的取值范围明确设定，无法保证短语完全匹配一定高于普通词项匹配。bonus 过小会被其他信号抵消，过大会意外压制 semantic 和 freshness。
- 需要明确：bonus 的数值、适用的 score 范围，以及“高于”的比较边界。

### 方案 B：对 lexical 分量做确定性加权，再沿用原公式

例如：

```text
effective_lexical = lexical_score + phrase_bonus
final_score = effective_lexical * 0.7
              + semantic_score * 0.2
              + freshness_score * 0.1
```

- 优点：保持现有三项评分结构和权重解释，phrase bonus 明确属于 lexical 信号；对现有 freshness 与 semantic 影响最小、实现改动也最局部。
- 风险：同样需要证明 bonus 足以实现“短语完全匹配高于普通词项匹配”。若 lexical score 没有明确上界，单一固定值无法提供普遍保证。
- 兼容性：可在内部评分阶段派生，不增加公开入口参数或返回字段。

### 方案 C：采用 lexical 优先级层，再用原评分解决层内排序

先按确定性 phrase-match 标记分层：

```text
phrase_match=True  &gt;  phrase_match=False
```

同一层内再使用现有完整评分：

```text
lexical_score * 0.7
+ semantic_score * 0.2
+ freshness_score * 0.1
```

- 优点：可以严格保证任何完整查询短语匹配都高于普通词项匹配；semantic、freshness 和原有 lexical 分数仍参与层内排序；稳定 tie 规则可原样保留。
- 风险：这实际上是 lexicographic precedence，而非数值 bonus；如果普通词项文档的整体相关性明显更高，也会被 phrase 层级压在后面。需要在 Spec 中明确这是有意的排序合同。
- 兼容性：不增加公开参数或返回结构，但内部需要获得完整查询短语匹配结果。

### 建议

我建议采用**方案 B**，因为它最忠实于“确定性 lexical bonus”，并最大限度保留现有评分公式、semantic/freshness 贡献及公开契约。前提是当前项目能确认各评分的范围，并据此选出足以满足严格排序保证的 bonus。

如果项目要求“无论其他分数如何，短语完全匹配都必须严格领先”，则应改选**方案 C**；它的保证最清晰，但语义是优先级层而不是普通加分。

请选择 **A、B 或 C**；若选择 A/B，还请一并确认是否接受在 Spec 中显式固定 score 范围与 bonus 数值。
