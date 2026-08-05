分类：**Create Successor Spec**

候选与依据：

- `hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - 当前拥有 session token 的身份与验证生命周期。
  - 现设计要求每次验证查询 token store，并以删除存储记录实现撤销。
  - 新请求改为签名 token、请求侧验证不查 store，并计划迁移后删除存储；这替换了既有认证实现模型及存储生命周期，属于后继设计而非修订。
- `hello-scholar/specs/session-auth/SPEC-011-session-audit-events/spec.md`
  - 明确审计事件独立于 opaque 或 signed token 表示。
  - 用户要求审计事件格式不变，因此它不是被替代的 Spec，也不需要修改。

拟由 successor transaction 影响的完整路径：

- `hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - 标记被新设计替代，建立 `superseded_by` 关系并递增语义 Revision。
- `hello-scholar/specs/session-auth/SPEC-012-signed-session-tokens/spec.md`
  - 新建 successor Spec，`supersedes: [SPEC-005]`，初始保持 `draft`。
- `hello-scholar/specs/INDEX.md`
- `hello-scholar/specs/session-auth/INDEX.md`
  - 仅由 CLI 生成更新。

当前未修改 `architecture.md`、`src/token-store.js`、`test/token-store.test.js` 或审计 Spec；实现、迁移和正式文档编写均未开始。只读 `docs check` 结果为 0 errors，工作树无变化；`docs sync` 因可能写入文件且当前明确禁止确认前修改而未执行。

下一道确认门：请确认上述 **Create Successor Spec** 分类，以及精确的 successor 身份 `SPEC-012`、Topic `session-auth`、设计路径 `SPEC-012-signed-session-tokens` 和其替代 `SPEC-005` 的关系。

result: 已完成 session token 设计归档分类，确认前停在 successor Spec 写入门前。
