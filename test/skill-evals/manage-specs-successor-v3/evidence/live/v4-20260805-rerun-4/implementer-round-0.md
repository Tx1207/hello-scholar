分类：**Create Successor Spec**

候选与依据：

- **Update Existing Spec（候选但不采用）**：`SPEC-005` 当前拥有 session token 的身份与验证生命周期边界，但新请求移除 token store 作为请求验证依据，并将 opaque token 替换为带签名的 `kid`、`sub`、`iat`、`exp` token。这不是同一设计模型的局部修订。
- **Create Independent Spec（候选但不采用）**：审计事件虽是独立 capability，但本请求改变的是 session token 的身份、验证和迁移生命周期，不是可脱离现有 token 设计而独立拥有的能力。
- **Create Successor Spec（采用）**：新设计替换 `SPEC-005` 的活跃 opaque、server-side lookup 和存储撤销模型；迁移期保留旧 token 验证，完成后删除存储，符合 successor 的替代设计和生命周期边界。`SPEC-011` 明确不选择 token 表示形式，审计事件格式保持不变，因此不应被替代或修改。

拟议 successor 的稳定身份为：

`session-auth` / `signed-stateless-session-tokens`

拟议 canonical 路径：

`/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`

若确认创建 successor，事务将影响以下完整 canonical 路径：

- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md`
  - 设置 `superseded_by: SPEC-012`
  - 将状态改为 `superseded`
  - 记录此次语义修订
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md`
  - 新建 `draft`
  - `supersedes: [SPEC-005]`
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/INDEX.md`
  - CLI 生成的全局索引
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/session-auth/INDEX.md`
  - CLI 生成的 Topic 索引

`SPEC-011`、Architecture、源码和测试不属于本次分类确认事务的写入范围。

下一道确认门：请明确确认完整路径 `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000/hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md` 及其 `Create Successor Spec` 身份。当前已停在确认前，未写入任何文件。

result: 已将签名无状态 session token 设计分类为替代 SPEC-005 的 Create Successor Spec，并停在精确路径确认门。
