分类：`Create Successor Spec`

候选与依据：

- `SPEC-005`：候选被替代 Spec。它拥有 session token 的身份、签发、验证、过期、撤销及 server-side store 生命周期；本请求移除验证时的 token-store lookup，并最终删除存储，改变了既有实现模型与生命周期边界。
- `SPEC-011`：不是 owner。其边界明确不决定 opaque 或 signed token 表示；本请求保持审计事件格式不变，因此不修改该 Spec。
- `Create Independent Spec`：不适用。新设计仍属于 `session-auth`，且直接替换现有 `SPEC-005` 的公共认证模型，不具备独立于旧模型的生命周期。
- `Update Existing Spec`：不适用。迁移期兼容旧 token、最终移除存储，属于替代现有设计，而非同一设计内的语义修订。

稳定身份依据：

- ID：现有最大 Spec 编号为 `SPEC-011`，因此 successor 使用 `SPEC-012`。
- Topic：沿用现有 owner `session-auth`。
- 设计名：`signed-stateless-session-tokens`，对应“signed stateless session tokens 替代 opaque stored tokens”的稳定公共能力；迁移期双验证、最终删除存储属于方案与生命周期细节，不进入身份名。

拟议事务的完整 canonical 路径：

- 新 successor Spec：`/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-040000/hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
- 更新被替代 Spec：`/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-040000/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
- CLI 生成并更新的索引：`/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-040000/hello-scholar/specs/INDEX.md`

本轮未写入任何文件；已核验工作树保持干净。请明确确认以下完整身份后，我才会创建 draft successor 并建立互惠 supersession 关系：

`/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-040000/hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`

result: 已将请求唯一归类为 Create Successor Spec，锁定 SPEC-012 canonical 身份并等待确认后再写入。
