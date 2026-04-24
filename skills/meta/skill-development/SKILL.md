---
name: skill-development
description: 当用户要求创建新 skill、修复现有 skill、改进 trigger descriptions、重组 skill 结构，或让一个 Claude skill 变得更可复用、更内部一致时使用该 skill。
version: 0.2.0
---

# Skill Development

使用该 skill 在**当前本地环境**中创建或修复 Claude skills，而不是在抽象 plugin 模板里工作。

## 目标

产出一个：
- 容易触发
- 在 `SKILL.md` 层保持轻量
- 当提到 `references/`、`examples/` 和 `scripts/` 时，背后都对应真实文件
- 不包含失效本地引用

## 核心规则

- 保持 **one skill = one durable job**。
- 把 frontmatter description 当作主要 trigger surface。
- 让 `SKILL.md` 聚焦 workflow 和边界。
- 把详细目录、模板和长解释移动到 `references/` 或 `examples/`。
- 不要提及不存在的文件。
- 不要在未核对本地实际情况前继承失效的 names、agents 或 sibling skill 引用。

## 默认工作流

### 1. 先检查当前环境

在动手前：
- 检查目标 skill 目录，
- 检查已经解决类似问题的邻近 skills，
- 验证哪些 agents、commands 和 sibling skills 在本地真实存在，
- 在新增内容前先识别 stale references。

以本地 inventory 为唯一权威，不要基于想象中的 plugin layout 编写指导。

### 2. 锁定 skill contract

编辑前先定义四件事：
1. 该 skill 做什么
2. 什么会触发它
3. 它明确**不**做什么
4. 实际需要哪些 bundled resources

如果该 skill 只需要一个简短 workflow，就保持简短。不要仅因为目录是惯例，就强行创建 `references/`、`examples/` 或 `scripts/`。

### 3. 编写或修复 frontmatter

frontmatter 应该：
- 在 `name` 中使用真实 skill identifier
- 使用第三人称 trigger description
- 包含用户自然会说出的具体短语
- 保持足够短，便于快速扫描

优先采用这种描述形式：

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "...", "...", or needs help with ....
---
```

### 4. 保持主文件精简

一个好的 `SKILL.md` 通常应包含：
- 简短的 goal section
- role boundaries
- default workflow
- safety 或 quality rules
- 一个短的 additional resources 列表

当以下内容变长时，把它们移出主文件：
- templates
- 穷尽式 checklists
- edge-case catalogs
- sample outputs
- 长示例

### 5. 只添加真实存在的 bundled resources

有意识地使用 bundled resources：
- `references/` 用于可按需选择性加载的详细指导
- `examples/` 用于真实示例输出或脚手架
- `scripts/` 用于确定性 helper logic

如果一个资源在 `SKILL.md` 中被提及，它就必须存在。  
如果一个资源存在却从未被引用或使用，应删除它。

### 6. 收尾前运行完整性检查

至少验证：
- frontmatter 能被解析
- 被引用的本地文件真实存在
- sibling skill 或 agent 引用是真实的
- `SKILL.md` 没有塞进本应属于 references 的冗长内容
- skill 目录中没有留下临时日志、缓存或编辑器产物

## 常见修复模式

### 当 skill 太长时
- 在 `SKILL.md` 中只保留 trigger 和 workflow
- 把目录和深层细节移到 `references/`
- 保留一个简短 read order，让另一个模型知道优先读什么

### 当 skill 太薄时
- 增加 default workflow
- 至少补一个具体 example 或 checklist
- 把边界写清楚，避免 skill 只剩一句口号

### 当 skill 有 stale references 时
- 立即删除失效路径
- 把历史名称替换成当前本地名称
- 对照 live directory 重新检查邻近 agents / commands / skills

## 推荐输出形态

在创建或修复 skill 时，优先以以下内容结尾：
- 改了什么
- 创建或更新了哪些文件
- 运行了哪些完整性检查
- 如果还有需要人工跟进的事项，也明确列出

## References

只在需要时加载：
- `references/checklist.md` - 收尾前的紧凑质量清单
- `references/integrity-checks.md` - 关于缺失文件、失效引用和漂移的本地检查
- `references/skill-creator-original.md` - 历史背景参考；只用来补背景，不作为当前权威来源
