已按确认执行，仅更新必要 Spec 与 CLI 生成的索引；未修改实现代码或审计事件 Spec。

修改文件：
- `hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
  - 新建 `SPEC-012`
  - 类型为 `system-design`
  - 状态为 `draft`
  - 定义带 `kid`、`sub`、`iat`、`exp` 的签名无状态 token
  - 定义无 token-store 验证、迁移期旧 token fallback，以及迁移完成后的存储清理
  - 声明审计事件格式由 `SPEC-011` 负责且保持不变
  - `supersedes: [SPEC-005]`
- `hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - 设置 `superseded_by: SPEC-012`
- CLI 生成索引：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/session-auth/INDEX.md`

检查：
- `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs sync`：成功，写入 2 个索引。
- `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs check`：3 个 Specs、2 个索引，0 errors；仅报告既有的缺少 Plan/Tasks notices。
- `npm test`：1 通过、0 失败。
- 未修改 `src/token-store.js`、测试或 `SPEC-011`。
