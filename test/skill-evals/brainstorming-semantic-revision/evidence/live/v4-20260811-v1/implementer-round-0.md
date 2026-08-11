已完成当前轮所需的只读确认，未修改任何文件，也未进入 Plan 或实现。

- 当前唯一相关 owner 是 `SPEC-001`：它负责 `rank_documents` 背后的 lexical、intent、freshness 相关性评分；`SPEC-004` 明确不拥有这些权重。
- 当前实现位于 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v1-20260811a/src/ranking.py`：入口实际为 `rank_documents(documents, intent_threshold=0.62)`，使用 `lexical_score * 0.7 + semantic * 0.2 + freshness_score * 0.1`，并以输入顺序稳定处理平分。
- 当前测试覆盖 exact lexical、semantic threshold，但没有独立的 phrase-match 信号或 phrase-vs-ordinary-term 边界。
- 用户已固定：语义阈值改为 `0.68`；公开入口、返回结构、多样性策略、freshness 规则不变。
- 当前设计事实存在一个关键未决点：现有 `Document` 只有一个 `lexical_score`，无法区分“短语完全匹配”和“普通词项匹配”；而 `SPEC-001` 的文档接口描述也与当前代码签名不完全一致。

needs input: 短语完全匹配是否可以作为 `Document` 内部新增的独立评分信号（保持 `rank_documents` 的公开调用入口和返回结构不变），还是必须从现有 `lexical_score` 中推导？
