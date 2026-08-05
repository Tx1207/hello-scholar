分类：`Create Successor Spec`

候选与依据：

- `SPEC-005`（当前设计）：候选被替代对象。它规定 opaque token、每次请求查 server-side token store、存储删除即时撤销；新请求移除 token-store lookup、改用带 `kid`、`sub`、`iat`、`exp` 的签名 token，替换了既有的 token 表示、验证模型和存储生命周期，因此不是同一设计的扩展。
- `SPEC-011`（审计能力）：不是被替代对象。它明确不选择 opaque 或 signed token representation，且审计事件格式保持不变；该 Spec 继续独立拥有审计事件契约。
- 独立设计不适用：新方案仍解决同一 session authentication 问题，并直接取代 `SPEC-005` 的活跃实现模型；迁移期兼容旧 token 验证，完成后删除存储，属于替代关系而非并行能力。

建议的新公共设计身份与完整 canonical 路径：

- 新 Spec：`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
- 被替代 Spec：`hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
- 事务涉及的生成索引：`hello-scholar/specs/session-auth/INDEX.md`、`hello-scholar/specs/INDEX.md`

下一道确认门：

请明确确认替代关系 `SPEC-012` supersedes `SPEC-005`，并确认完整新路径身份 `session-auth/SPEC-012-signed-stateless-session-tokens`。确认后才创建 draft successor Spec、将 `SPEC-005` 标记为 superseded 并建立互惠关系；不会修改 `SPEC-011`、架构、源码、测试、Plan 或 Tasks。

停点：已完成设计归档分类；零写入，等待确认，不开始正式文档编写。
