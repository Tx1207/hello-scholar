已完成经确认的 successor 事务，未修改代码、测试或审计事件 Spec。

- 新建 draft Spec：`hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
  - `id: SPEC-012`
  - `status: draft`
  - `revision: 1`
  - `supersedes: [SPEC-005]`
- 更新旧 Spec：`hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - `status: superseded`
  - `revision: 3`
  - `superseded_by: SPEC-012`
  - 已追加替代关系修订历史
- `SPEC-011` 审计事件 Spec 保持不变。
- CLI 已生成并更新：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/session-auth/INDEX.md`

验证结果：

- `docs sync`：`written 2, deleted 0, errors 0`
- `docs check`：`specs 3, errors 0`
- 双向 supersession 已确认且无环
- `npm test`：1 项通过
- 未实现代码，未创建 Plan 或 Tasks。

result: Round 1 已完成，SPEC-012 draft 已创建并与 SPEC-005 建立双向无环替代关系，必要索引更新且验证全部通过。
