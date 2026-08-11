已完成设计归档，未实现代码。

变更内容：

- 创建 draft Spec：`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
  - `id: SPEC-012`
  - `status: draft`
  - `revision: 1`
  - `supersedes: [SPEC-005]`
  - 覆盖 `kid`、`sub`、`iat`、`exp`、无 token-store 验证、迁移期旧 token 验证及迁移后清理。
  - 明确审计事件格式和 `SPEC-011` 保持不变。
- 更新 `hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - `status: superseded`
  - `revision: 3`
  - `superseded_by: SPEC-012`
  - 添加替代关系修订历史。
- 通过 CLI 更新生成：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/session-auth/INDEX.md`

验证结果：

- `docs check`：3 个 Specs、2 个 Indexes、0 errors。
- supersession 关系双向、非自指且无环。
- 源代码、测试和 `SPEC-011` 未修改。
- 仅存在上述 Spec 与 CLI 生成 Index 的工作区变更。
