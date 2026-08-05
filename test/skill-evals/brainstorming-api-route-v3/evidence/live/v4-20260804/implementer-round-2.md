分类：`Create Independent Spec`

依据：

- 候选 `SPEC-007`（`storage-consistency`）只负责副本读一致性，明确不负责 HTTP 请求基数、部分失败或批量响应形状。
- 候选 `SPEC-013`（`request-control`）只负责请求预算和限流，明确不定义单项与批量 API 响应契约。
- 同步批量逐项结果是新的公共接口能力，拥有独立的批准、实施、验证和回滚生命周期。
- 异步作业与客户端聚合属于同一设计问题的备选方案，应保留在该 Spec 的候选方案与权衡中，不创建并行 Spec。
- 当前全局最大 Spec 编号为 `013`，因此新身份使用 `SPEC-014`。

Canonical Bundle 路径：

```text
hello-scholar/specs/batch-retrieval-api/SPEC-014-batch-retrieval-api/spec.md
```

下一道确认门：请确认创建 `SPEC-014`、Topic `batch-retrieval-api`、设计身份 `batch-retrieval-api` 的独立 Spec Bundle。当前未写入任何项目文件；`docs check` 已通过且报告 0 errors。
