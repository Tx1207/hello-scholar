已完成经确认的 successor Spec 事务，且未实现代码。

变更：

- 新建 `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-191500/hello-scholar/specs/session-auth/SPEC-012-signed-session-tokens/spec.md`
  - `status: draft`
  - `supersedes: [SPEC-005]`
  - 定义带 `kid`、`sub`、`iat`、`exp` 的 signed stateless session tokens
  - 保留迁移期旧 opaque token 验证，迁移完成后移除旧存储
  - 明确审计事件格式保持不变
- 更新 `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-191500/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - `status: superseded`
  - `revision: 3`
  - `superseded_by: SPEC-012`
  - Revision History 记录替代关系
- 使用绝对 CLI 更新：
  - `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-191500/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-191500/hello-scholar/specs/session-auth/INDEX.md`

验证：

- `docs sync`: 0 errors
- `docs check`: 0 errors；仅报告缺少 Plan/Tasks 的既有 notices
- `npm test`: 1/1 通过
- 未修改 `SPEC-011`、`architecture.md`、`src/token-store.js` 或 `test/token-store.test.js`

result: 已创建 draft SPEC-012 signed stateless session tokens，并与 SPEC-005 建立双向无环 supersession；仅更新必要 Spec 与生成 Index。
