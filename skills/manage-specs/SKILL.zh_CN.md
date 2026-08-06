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
   hello-scholar docs sync
   hello-scholar docs check
   ```
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

- 保持 ID、Topic 和 Bundle 路径。
- 语义变化时递增 `revision`，设为 `status: draft`，更新 `updated`，并追加一条 `Revision History`。
- 只修正格式时保持 Revision。
- 只修改该 `spec.md`；现有 Plan 和 Tasks 可以变为 stale。

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

运行：

```sh
hello-scholar docs check
hello-scholar docs sync
hello-scholar docs check
```

只有 CLI 重建生成的 Index。确认最终 diff 仅包含所选 Spec 事务和生成的 Index。

新建 Spec 和语义更新保持 `draft`，直到用户批准完整 Spec。然后停在下一位被请求的 owner。

**完成条件：** 两次检查通过，生成 Index 为 current，且每条变更路径都属于已确认事务。
