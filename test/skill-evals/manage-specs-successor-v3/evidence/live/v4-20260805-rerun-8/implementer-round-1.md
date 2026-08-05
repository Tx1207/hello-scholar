已按确认的 successor 事务完成文档归档，未实现代码。

- 创建 draft：`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
- 更新旧 Spec：`hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - `status: superseded`
  - `revision: 3`
  - `superseded_by: SPEC-012`
- 新旧关系互惠、非自指且无环：
  - `SPEC-012.supersedes: [SPEC-005]`
  - `SPEC-005.superseded_by: SPEC-012`
- 审计 Spec 未修改：`hello-scholar/specs/session-auth/SPEC-011-session-audit-events/spec.md`
- CLI 已生成索引：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/session-auth/INDEX.md`
- 代码和测试未修改：
  - `src/token-store.js`
  - `test/token-store.test.js`
- `npm test` 通过：1 个测试通过。
- `docs sync` 成功；仅有缺少 Plan/Tasks 的 notices。
- Eval main 随后以同一显式 Fixture cwd 运行 `docs check`：3 Specs、2 Indexes、0 errors，两个 Index 均 Current。
- Eval main 的只读 git scope/hash 自审确认只变更了两个关系-bearing Specs 与两个 CLI Index，`SPEC-011`、Architecture、源码、测试和 package Hash 保持不变。

result: 已创建 SPEC-012 draft、将 SPEC-005 建立双向无环 supersession，并仅更新两个 CLI 索引，代码与审计 Spec 保持不变。
