分类：`Create Independent Spec`

依据：
- 现有 `SPEC-002`（`hello-scholar/specs/search-ranking/SPEC-002-retrieval-ranking/spec.md`）只负责检索结果排序，并明确不负责请求形状、批量限制、部分失败或端点灰度。
- 现有 `SPEC-009`（`hello-scholar/specs/observability/SPEC-009-request-tracing/spec.md`）只负责请求追踪，并明确不负责路由语义、批处理或错误契约。
- 新能力具有独立的批量读取协议、最多 100 个 ID、输入顺序、单项缺失容错，以及可独立灰度和关闭的生命周期边界，能够独立批准、实施、验证和回滚。
- `docs check` 通过，报告 0 errors；工作树未修改。

拟建完整路径：

`hello-scholar/specs/document-retrieval/SPEC-010-batch-retrieval-api/spec.md`

当前停点：等待你确认创建该独立 Spec；确认前不写入设计文档或代码。
