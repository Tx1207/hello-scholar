分类：`Create Successor Spec`

候选与依据：

- `SPEC-005 — Opaque server-side session tokens`  
  当前拥有 session token 的身份、签发、验证、过期和撤销生命周期；其目标设计要求每次请求查询 token store。新方案改用包含 `kid`、`sub`、`iat`、`exp` 的签名 token，并使验证无状态，因此替换了该 Spec 的活跃实现模型和存储生命周期边界。
- `SPEC-011 — Session security audit events`  
  仅负责稳定的审计事件格式，并明确不选择 opaque 或 signed token 表示。请求说明审计事件格式不变，因此不修改或替代该 Spec。

Stable Identity Test：

- 全局最大 Spec 编号为 `011`，候选 successor 分配 `SPEC-012`。
- 复用既有 owner：Topic 为 `session-auth`。
- 跨方案稳定身份为 signed stateless session tokens；迁移期旧 token 验证属于迁移约束，不改变身份名称。
- canonical design name 为 `signed-stateless-session-tokens`。

拟议事务影响的完整 canonical repository-relative path：

`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`

确认门：请明确确认创建 successor `SPEC-012`，精确身份为 `session-auth / signed-stateless-session-tokens`，路径为上述完整路径。当前未写入任何项目文件；收到确认前不会创建或修改文档。
