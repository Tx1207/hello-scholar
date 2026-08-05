manage-specs 分类结果：

**`Create Independent Spec`**

证据：

- Architecture 说明当前只有单文档查找，且不存在 batch contract。
- `SPEC-013-retrieval-rate-limits` 明确只负责租户请求预算，并排除 single versus batch API response contracts。
- `SPEC-007-replica-read-consistency` 明确只负责存储选择，并排除 HTTP request cardinality、partial failures 和 batch response shape。
- 新能力具有独立的公共接口、逐项结果、部分失败、按项重试、100 项上限、兼容性和测试验收边界，可独立批准、实施、验证及回滚。
- 异步作业与客户端聚合是同一设计问题的候选方案，不应创建并行 Spec。

完整 canonical path：

`hello-scholar/specs/batch-retrieval/SPEC-014-public-synchronous-batch-retrieval-api/spec.md`

该路径保留公共接口身份 `public synchronous batch retrieval API`；`SPEC-014` 是基于现有最大 ID `SPEC-013` 分配的下一个 ID。

下一道确认门：明确确认创建该精确路径的独立 Spec：

`hello-scholar/specs/batch-retrieval/SPEC-014-public-synchronous-batch-retrieval-api/spec.md`

result: 已完成同步批量检索能力的独立 Spec 身份分类，确认前零写入并停在精确 canonical path 确认门。
