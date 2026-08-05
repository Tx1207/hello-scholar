分类：`Create Successor Spec`

候选与依据：

- `Update Existing Spec`（`SPEC-005`）：不选。虽然仍是 session authentication，但新设计不再以 opaque token 和 token store lookup 作为正式验证路径。
- `Create Independent Spec`：不选。该请求直接替换现有 session token 的签发、验证、存储与迁移生命周期，并非可独立存在的旁支能力。
- `Create Successor Spec`：选择。新设计以带 `kid`、`sub`、`iat`、`exp` 的签名 stateless token 替代 `SPEC-005` 的 opaque server-side token；验证路径移除 token store lookup，迁移期暂时兼容旧 token，完成后删除存储。这满足“替代活跃实现模型并移除既有存储边界”的 successor 条件。
- `SPEC-011`（Session security audit events）继续作为独立候选 owner，但其审计事件格式和边界不变，不应被替代或合并。

稳定身份依据：

- 既有 owner：`session-auth`
- 公共能力：stateless signed session tokens
- 稳定设计名：`signed-stateless-session-tokens`
- 下一个 Spec ID：`SPEC-012`（当前最大 ID 为 `SPEC-011`）
- `SPEC-005` 是被替代 Spec，`SPEC-011` 不受 successor 事务影响。

拟议 successor canonical 路径：

```text
hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md
```

本次 successor 事务完整涉及的 canonical 路径：

```text
hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md
hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md
hello-scholar/specs/INDEX.md
hello-scholar/specs/session-auth/INDEX.md
```

其中 `SPEC-005` 后续需指向 `SPEC-012` 并标记为 `superseded`；新 Spec 创建为 `draft`，并在 `supersedes` 中写入 `SPEC-005`。`SPEC-011` 不写入本次事务。

下一道确认门：请确认创建 successor `SPEC-012`，完整绑定路径为 `hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`。本轮未写入任何文件。
