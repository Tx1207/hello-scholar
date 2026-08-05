已按确认执行设计归档，未修改任何代码、Plan 或 Tasks。

- 创建 draft `SPEC-012`：签名无状态会话 token，包含 `kid`、`sub`、`iat`、`exp`，迁移期兼容旧 opaque token，完成后移除 token store。
- 更新 `SPEC-005`：`revision: 3`、`status: superseded`、`superseded_by: SPEC-012`。
- `SPEC-012.supersedes: [SPEC-005]`，双向、无环。
- `SPEC-011` 未修改，审计事件格式与边界保持不变。
- 修改路径只有两个关系性 Spec 与两个 CLI 生成 Index。
- `docs sync`、`docs check`、`git diff --check` 通过；Eval 主流程另按 Protocol 执行 `npm test`，通过。
