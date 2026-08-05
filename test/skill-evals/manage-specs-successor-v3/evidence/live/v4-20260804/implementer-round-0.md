候选比较：

- **Update Existing Spec**：不适用。请求改变了 `SPEC-005` 的核心认证模型：从 opaque token + token store 查询，改为带 `kid/sub/iat/exp` 的签名 token，并最终移除存储。
- **Create Independent Spec**：不适用。新设计仍解决同一会话 token 的签发与验证问题，不能独立于现有生命周期。
- **Create Successor Spec**：适用。它替代 `SPEC-005` 的活跃实现模型和存储边界；迁移期兼容旧 token，完成后旧设计成为历史。
- **Need Human Classification**：不适用。现有文档和运行时代码已足以确定唯一边界。

**唯一分类：`Create Successor Spec`**

依据：

- `SPEC-005` 规定 opaque token、每次请求查权威 token store、删除存储项立即撤销。
- `src/token-store.js` 和 `test/token-store.test.js` 证明当前实现依赖内存 token store，并覆盖过期与撤销。
- `architecture.md` 明确 `SPEC-005` 拥有 token 身份与验证。
- `SPEC-011` 只拥有审计事件契约，明确不选择 token 表示；本请求保持其事件格式不变，因此不替代它。

拟创建的最终路径：`hello-scholar/specs/session-auth/SPEC-012-signed-session-tokens/spec.md`

受影响的 Specs：`SPEC-005` 将被替代；`SPEC-011` 保持不变。已运行 `docs sync`、`docs check`，工作树无改动，停在确认门。
