已完成当前事实确认，且未修改任何文件。

- `SPEC-001` 是相关性排序的唯一 owner；`SPEC-004` 明确不负责 lexical、phrase、semantic 或 freshness 权重。
- 当前实现入口为 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v3-20260811b/src/ranking.py:12` 的 `rank_documents`，返回 `list[str]`，稳定输入顺序处理并列。
- 当前评分为 lexical `0.7`、semantic `0.2`、freshness `0.1`；semantic fallback 阈值为 `0.62`。
- 当前 `Document` 只有 `lexical_score`、`intent_score`、`freshness_score`，测试尚未定义“短语完全匹配”信号。
- 因此，阈值从 `0.62` 调至 `0.68` 可直接归入 `SPEC-001`；但“短语完全匹配高于普通词项匹配”需要先确定信号如何进入现有稳定评分合同。公开入口、返回结构、多样性策略和 freshness 规则均可保持不变。

唯一需要你决定的材料性问题：

**短语完全匹配应当作为现有 `lexical_score` 的上游语义（不扩展 `Document` 或入口参数），还是允许在 `Document` 内增加一个独立的 phrase-match 信号以便评分层显式保证其优先级？**

我会等待这个决定后，再比较可行方案；本轮不会写 Spec、Plan、Tasks 或源码。
