分类：**替代设计（以 successor Spec 取代现有设计）**

候选及依据：

- **修改现有设计**：不采用。虽然新方案仍属于 session token，但它移除了 `SPEC-005` 的核心认证路径——每次请求查 token store——并改变 token 身份、验证、过期和迁移生命周期，不是局部修订。
- **独立设计**：不采用。新方案直接替换 `SPEC-005` 当前负责的 token identity 与 validation；旧 token 仅在迁移期兼容验证，最终删除存储，不是并行、独立能力。
- **替代设计**：采用。签名 token 引入 `kid`、`sub`、`iat`、`exp`，验证不再依赖 token store，迁移期兼容旧 token，迁移完成后清理存储，构成对 `SPEC-005` 的 successor。`SPEC-011` 明确不选择 token 表示形式，因此保持不变；审计事件格式也保持不变。

依据证据：

- 现有设计声明 token 必须通过权威 token store 验证，并以删除存储条目实现即时撤销。
- 当前运行时代码在 `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-020000/src/token-store.js` 中保存 `{subject, expiresAt}`，验证依赖 `Map` 查找。
- 现有测试覆盖 opaque token 的存储验证、过期和撤销。
- 审计 Spec 的边界明确写明不决定 opaque 或 signed token 表示方式。

拟议 successor transaction 的完整 canonical paths：

- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-020000/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-020000/hello-scholar/specs/session-auth/SPEC-012-signed-session-tokens/spec.md`（拟新建，尚未写入）
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-020000/hello-scholar/specs/session-auth/INDEX.md`（由 CLI 更新）
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-020000/hello-scholar/specs/INDEX.md`（由 CLI 更新）

当前停止点：等待你确认采用“替代设计”；本轮未写入任何文件，也未开始正式文档编写。

result: 已完成设计归档分类：该请求应作为替代 SPEC-005 的 successor 设计，SPEC-011 保持不变，现等待确认后再写文档。
