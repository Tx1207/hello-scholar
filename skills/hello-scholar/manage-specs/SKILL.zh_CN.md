---
name: manage-specs
description: 对设计请求进行稳定 Spec 身份分类。创建、修订、替代 Spec，或多个 Spec 边界无法判定时使用；其他设计 Skill 可在写入 Spec Bundle 前调用。
---

# Manage Specs

本 Skill 只负责一个设计请求的 Spec 身份 **classification**。只能返回以下之一：

- `Update Existing Spec`
- `Create Independent Spec`
- `Create Successor Spec`
- `Need Human Classification`

结果必须列出候选 Spec、依据和下一道确认门。本 Skill 负责 Spec 身份与 Revision 维护；不负责方案设计、批准 Spec、生成 Plan/Tasks 或实施。

## 1. 建立文档事实

1. 确认项目根目录并运行：
   ```sh
   node <hello-scholar-repo>/bin/hello-scholar.js docs sync
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   ```
2. 任一命令报告结构错误时，报告 diagnostics 后停止，不在无效文档图上直接写入。
3. 读取全局 Spec Index、存在时的目标 Topic Index，以及标题、问题、目标或 owner 边界可能匹配的候选 `spec.md`。再读取区分候选所需的项目事实。

**完成条件：** 请求已有基于当前事实的有限候选集，而不是默认阅读全部历史文档。

## 2. 做出唯一分类

依据如下表选择，不能合并分类：

| 分类 | 适用情况 | 写入前的结果 |
| --- | --- | --- |
| `Update Existing Spec` | 请求改变的是同一问题、能力和生命周期，且已有一个 Spec 拥有它。 | 指出该 Spec 并说明共享边界。 |
| `Create Independent Spec` | 请求是不同问题或真正独立的能力，且能够独立批准、实施、验证并停止或回滚。 | 写明两项独立生命周期事实，并请求创建确认。 |
| `Create Successor Spec` | 已审阅的新设计从根本上替代既有设计，而不是扩展它。 | 指出被替代 Spec、说明替代边界，并请求关联两份 Spec 的事务确认。 |
| `Need Human Classification` | 多个候选同样合理，或本地事实无法建立独立生命周期。 | 列出竞争边界和需要用户决定的唯一问题。 |

同一问题的多个方案写入候选 Spec 的 `候选方案与权衡` / `Alternatives and Tradeoffs`，不创建并行 Spec。

**完成条件：** 回复含一个分类、具体证据，以及所需确认或明确停止点。

## 3. 应用已确认分类

创建新 Spec 前，先读取 `assets/` 的对应模板。项目默认语言为中文时使用 `spec-template.zh_CN.md`，否则使用 `spec-template.md`。ID、路径、枚举值和命令保持原样。

### Update Existing Spec

- 保持既有 ID、Topic 和 Bundle 路径。
- 语义变化时递增 `revision`，将 `updated` 设为当前日期，并追加简洁 `Revision History` 说明改变的决定。
- 只修正格式或错别字而不改变语义时，保持 Revision。
- 只修改该 `spec.md`；Spec 变化后现有 Plan/Tasks 可能变为 Stale，无需同步。

### Create Independent Spec

- 只有用户明确确认此分类后才能继续。
- 新 ID 是全局最大 Spec 数字加一，至少三位；不复用空洞，并将 rejected 或 superseded ID 计入最大值。
- Topic 与设计 slug 使用小写 kebab-case。用选定模板创建 `hello-scholar/specs/<topic-id>/SPEC-<number>-<design-name>/spec.md`。
- 初始字段为 `status: draft`、`revision: 1`、`supersedes: []`、`superseded_by: null`。

### Create Successor Spec

- 只有用户明确确认替代关系和两份受影响 Spec 后才能继续。
- 与独立 Spec 相同方式分配新 ID 和路径；新 Spec 的 `supersedes` 写入旧 ID。
- 同一事务更新旧 `spec.md`：将 `superseded_by` 设为新 ID，进行语义 Revision 与 `updated` 变更，并在 `Revision History` 记录关系。新设计替代活跃 owner 时，将旧 status 设为 `superseded`。
- 验证关系互惠且无环。这是唯一允许同时维护新旧 Spec 的例外；不能顺带修改 Plan、Tasks、Architecture、源码或 Run。

### Need Human Classification

不写 Spec。展示候选边界，等待用户决定。

**完成条件：** 只有所需确认后才发生写入，且变更路径恰好匹配所选分类。

## 4. 验证与交接

写入后运行：

```sh
node <hello-scholar-repo>/bin/hello-scholar.js docs check
node <hello-scholar-repo>/bin/hello-scholar.js docs sync
node <hello-scholar-repo>/bin/hello-scholar.js docs check
```

只有 CLI 可以重建生成的 Index。确认 diff 只包含所选 `spec.md` 事务和生成的 Index。

新 Spec 初始为 `draft`。只有用户明确批准完整 Spec 后才改为 `accepted`。随后停在用户请求的下一阶段；讨论或分类确认不是 Spec 批准。
