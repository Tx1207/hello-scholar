# Knowledge CRUD

维护 research-project knowledge base 时遵循这些规则。

## 核心默认值

- **每个 durable object 只保留一个 canonical note**
- **优先更新，不优先复制**
- **raw material 不是 durable knowledge**
- **默认 archive；只有显式要求才 purge**
- **先窄查询，再综合**

## 默认研究推进路径

当一轮科研工作具有实质性时，优先沿这条路径推进 durable knowledge：

```text
Papers -> Experiments -> Results -> Writing
```

这并不意味着每轮都必须触碰四个目录，而是意味着：只要下一次 durable handoff 已经明确，就应明确写出来。

## Create

新知识出现时，先回答两个问题：

1. 它属于哪一类？
   - `knowledge`
   - `paper`
   - `experiment`
   - `result`
   - `writing`
   - `daily`
2. 它是 **durable note** 还是 **raw material**？

默认政策：**先总结，再路由**。

只有当内容已经：

- 自包含
- 稳定
- 边界清晰
- 后续可能被引用

时，才直接 promote。

否则：

- merge 到同一对象的现有 canonical note
- 或者先放到 `Daily/`

永远不要：

- 仅凭路径把新文件一对一映射成新 durable note
- 对同一个 experiment / result / paper 重复创建 canonical note
- 把发现到的每个 Markdown 文件都强行变成正式 vault 对象

## Read

优先使用最小充分读取集。

### Query presets

- broad project question -> `00-Hub.md` + `Knowledge/Project-Overview.md` + `Knowledge/Research-Questions.md`
- next step / active work -> `01-Plan.md` + 今天的 `Daily/` + project memory
- specific experiment -> `Experiments/` 中对应 note
- specific result -> `Results/` 中对应 note
- literature question -> `Papers/` 中对应 note

### Query 顺序

1. canonical note
2. 相邻 durable notes
3. daily 或 scratch context
4. repo source docs 或 outputs
5. agent synthesis

如果 canonical note 已存在，不要一上来就扫描整个 vault 或 repo。

## Update

当新材料与已有 durable object 重叠时：

- 更新 canonical note
- 默认不要创建 sibling note

按目录更新风格：

- `Knowledge/` -> 重写稳定结论，避免时间戳噪音
- `Experiments/` -> 保持实验身份，追加 updates、findings、next steps
- `Results/` -> 更新 headline、evidence、interpretation
- `Writing/` -> 继续演化草稿；必要时按输出对象拆分
- `Daily/` -> 可自由追加，之后再 promote 耐久部分

合并与拆分规则：

- 多个小 note 明显描述同一 durable object 时，合并
- 一个 note 演化成多个生命周期不同的 durable object 时，拆分

## Delete

认真理解用户的“删除”意图：

- “remove / delete / stop using / no longer needed” -> archive
- “keep history but stop using” -> archive
- “permanently delete / purge” -> purge

### Archive

默认动作：

- 把目标 note 移到 `Archive/`
- 修复 `00-Hub.md`、`01-Plan.md` 以及显式 index notes 中的直接链接
- 不要让主工作面留下坏链接

### Purge

只有在明确永久删除意图时才执行：

- 删除目标 note
- 清理 `00-Hub.md`、`01-Plan.md` 和显式 index notes 中的直接链接
- 确保被删 note 不是仍在使用的唯一 canonical knowledge carrier

### Rename 或 move

rename / move 应视为：

- 同一个 durable object 的更新
- 加上 link repair

除非对象含义真的变了，否则不要把 rename 当成 delete-plus-create。
