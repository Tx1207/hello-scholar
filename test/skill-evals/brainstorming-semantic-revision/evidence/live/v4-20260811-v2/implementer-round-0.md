🔵 【hello-scholar】- 设计事实确认 - brainstorming

已完成只读确认，工作区无未提交变更，未写入任何文件。

当前影响范围：

- `SPEC-001`（`hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`）拥有 lexical、semantic intent 和 freshness relevance 规则；当前语义回退阈值为 `0.62`。
- `SPEC-004`（`hello-scholar/specs/search-ranking/SPEC-004-result-diversity/spec.md`）只负责后排序 source cap，不应改变。
- `src/ranking.py` 的公开入口和返回类型是 `rank_documents(documents, intent_threshold=...) -> list[str]`；当前 `Document` 只有 `lexical_score`、`intent_score`、`freshness_score`。
- `tests/test_ranking.py` 已覆盖 exact、semantic threshold 行为，但当前模型没有独立的 phrase-match 信号。
- `hello-scholar/architecture.md` 确认 relevance scoring 归 `SPEC-001`，多样性归 `SPEC-004`。
- 公开入口、返回结构、多样性策略和 freshness 规则均可作为保留约束。

唯一需要先确认的材料性设计问题：

**“短语完全匹配高于普通词项匹配”中的短语匹配信号，是否已经在调用方计算并应作为新的 `Document` 字段传入，还是应由 `rank_documents` 根据现有文档/query 数据自行计算？**

🔄 下一步: 等待这一项设计决定后，再比较可行方案；当前不创建或修改 Spec、Plan、Tasks、源码或测试。
