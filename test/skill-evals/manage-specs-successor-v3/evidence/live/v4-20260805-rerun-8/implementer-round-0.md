分类：`Create Successor Spec`

候选与依据：

- `Update Existing Spec` — 候选：`SPEC-005`，路径为 `hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`。现有 Spec 确实拥有 session token 的身份与验证能力，但本请求移除 opaque token 的存储查找，并将验证模型改为带 `kid`、`sub`、`iat`、`exp` 的签名无状态 token；这不是同一生命周期模型内的语义修订。
- `Create Independent Spec` — 不采用。请求仍属于现有 `session-auth` owner 的同一公共能力边界，且不是可独立拥有、批准、回滚的旁支能力。
- `Create Successor Spec` — 采用。新设计替代活跃的 opaque stored token 模型，并在迁移期兼容旧 token、完成后删除存储；这是移除既有存储与验证生命周期边界的替代设计。审计事件格式保持不变，因此 `SPEC-011`（`hello-scholar/specs/session-auth/SPEC-011-session-audit-events/spec.md`）不变。

稳定身份测试：

- 既有 owner：`session-auth`。
- 已确认公共能力：signed stateless session tokens 替代 opaque stored tokens。
- 稳定设计名：`signed-stateless-session-tokens`；迁移期兼容、最终删除存储属于候选方案与生命周期细节，不改变身份。
- 拟定 successor ID：`SPEC-012`（当前最大 ID 为 `SPEC-011`，按规则加一并保留三位）。

拟议事务的完整 canonical 路径：

- 新建：`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
- 更新被替代 Spec：`hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
- 不变：`hello-scholar/specs/session-auth/SPEC-011-session-audit-events/spec.md`
- 不变：`hello-scholar/architecture.md`
- 不变：`src/token-store.js`
- 不变：`test/token-store.test.js`
- 由 CLI 生成/更新的索引（确认后事务的一部分）：`hello-scholar/specs/INDEX.md`、`hello-scholar/specs/session-auth/INDEX.md`

当前保持零写入；未运行会写入索引的同步命令，也未创建或修改任何 Spec。

请确认采用以下完整 successor 身份后，我才会创建 draft 并建立互惠的 supersession 关系：

`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
