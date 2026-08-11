---
name: manage-specs
description: 将设计请求归入一个稳定 Spec 身份。创建、修订或替代 Spec 前使用；其他设计 Skill 需要 canonical Spec owner 时也使用。
---

# Manage Specs

本 Skill 只负责一个设计请求的 Spec 身份 **classification**。只能返回以下之一：

- `Update Existing Spec`
- `Create Independent Spec`
- `Create Successor Spec`
- `Need Human Classification`

结果必须列出候选 Spec、依据和下一道确认门。本 Skill 负责 Spec 身份与 Revision 维护；方案设计、Spec acceptance、Plan、Tasks 和实施由各自 owner 负责。

## 1. 建立文档事实

1. 确认项目根目录并运行：
   ```sh
   hello-scholar docs check
   ```
   如果检查报告生成的 Index 过期，再运行 `hello-scholar docs sync` 后读取候选项。
2. 遇到结构错误时停止并报告 diagnostics。
3. 读取全局 Spec Index、存在时的目标 Topic Index，以及问题、目标或 owner 边界可能匹配的候选 `spec.md`。只读取区分候选所需的项目事实。

**完成条件：** 请求已有基于当前项目事实的有限候选集。

## 2. 确定一个身份

| 分类 | 依据 | 写入前的结果 |
| --- | --- | --- |
| `Update Existing Spec` | 一个 Spec 已拥有相同的问题、能力和生命周期。 | 指出该 Spec 及共享边界。 |
| `Create Independent Spec` | 该能力具有独立价值，并能独立批准、实施、验证和回滚。 | 写明独立生命周期事实并提出一条 canonical 路径。 |
| `Create Successor Spec` | 新设计替换活跃实现模型，或移除既有设计要求的存储、协议或生命周期边界。 | 指出被替代 Spec、历史边界和 successor canonical 路径。 |
| `Need Human Classification` | 读取本地事实后仍有多个同样合理的 owner。 | 展示竞争边界和一个身份决定。 |

同一问题的候选方案保留在同一 Spec 的 `候选方案与权衡`，不成为不同身份。

返回 `Create Independent Spec` 或 `Create Successor Spec` 前，读取 [`assets/spec-identity.zh_CN.md`](assets/spec-identity.zh_CN.md)；使用英文回复时读取 [`assets/spec-identity.md`](assets/spec-identity.md)。完成其中的 **Stable Identity Test**，再在确认请求中重复完整拟定路径。

**完成条件：** 回复含一个分类、具体依据、创建身份时的一条完整路径，以及一道确认门或明确停止点。

## 3. 应用已确认分类

只有回复明确绑定第 2 步提出的分类和精确身份后才继续。

### Update Existing Spec

- 完整读取当前 `spec.md`。将当前完整文件作为 **Baseline**，将用户批准的决定或当前上游合同作为 **Authority**，将本次请求作为 **Delta**；Delta 未提及的内容继续有效。
- 写入前，将每项 Baseline 决定和 Delta 变化归为 `Keep`、`Modify`、`Remove`、`Add` 或 `Move`。默认使用 `Keep`；只有明确决定、直接冲突、替代关系或对已删除内容的依赖才能作为 `Remove` 依据。
- 将处置账本归并成一份完整的 Current Spec。保持 ID、Topic、Bundle 路径和 `created`；同步更新受影响的接口、不变量、风险和验收，并移除已废弃决定的残余引用。
- 语义变化时递增 `revision`，设为 `status: draft`，更新 `updated`，并追加一条只概括变化、不复制旧正文的 `Revision History`。
- 只修正格式时保持 Revision。
- 只修改该 `spec.md`；现有 Plan 和 Tasks 可以变为 stale。
- 最后执行整份语义守恒审核：每项 Baseline 恰有一种处置，每项 Delta 都已整合，未受影响内容仍存在，废弃内容已移除，且每项删除或大范围改写都有 Authority。

### Create Independent Spec

- 读取 `assets/` 的对应模板：中文项目使用 `spec-template.zh_CN.md`，否则使用 `spec-template.md`。
- 在已确认路径创建 `status: draft`、`revision: 1`、`supersedes: []`、`superseded_by: null` 的 Spec。

### Create Successor Spec

- 按上述方式创建已确认 draft，并在 `supersedes` 写入旧 ID。
- 同一事务更新旧 `spec.md`：让 `superseded_by` 指向新 ID，记录语义 Revision，并将活跃 owner 设为 `superseded`。
- 验证关系互惠、非自指且无环。这是唯一允许写入多份 Spec 的分支。

### Need Human Classification

返回未解决的身份决定，项目保持零写入。

**完成条件：** 每份变更的 `spec.md` 都匹配已确认分支和身份；Plan、Tasks、Architecture、源码和 Run 保持不变。

## 4. 验证与交接

写入 Spec 后运行一次：

```sh
hello-scholar docs sync
```

只有 CLI 重建生成的 Index。确认最终 diff 仅包含所选 Spec 事务和生成的 Index。

新建 Spec 和语义更新保持 `draft`，直到用户批准完整 Spec。然后停在下一位被请求的 owner。

**完成条件：** `docs sync` 成功，生成 Index 为 current，且每条变更路径都属于已确认事务。
