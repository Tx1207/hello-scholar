分类：`Create Independent Spec`

依据：
- `SPEC-002`（`hello-scholar/specs/search-ranking/SPEC-002-retrieval-ranking/spec.md`）明确不负责请求形状、批量限制、部分失败和端点灰度。
- `SPEC-009`（`hello-scholar/specs/observability/SPEC-009-request-tracing/spec.md`）明确不负责路由语义、批处理和错误契约。
- 当前架构只有单文档查找，没有批量路由；该请求具有独立的验收、灰度、关闭和回滚边界。

拟建最终路径：`hello-scholar/specs/document-retrieval/SPEC-010-batch-get-documents/spec.md`

已运行 `docs sync`、`docs check`，均无错误；工作树无改动。当前停止在创建确认门，等待确认该分类及路径后再创建 `draft` Spec。
