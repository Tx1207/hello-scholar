---
name: write-a-skill
description: 创建具有正确结构、渐进披露和捆绑资源的新 agent skills。当用户想创建、编写或构建新 skill 时使用。
---

# 编写 Skills

## 流程

1. **收集需求** - 询问用户：
   - skill 覆盖什么任务/领域？
   - 它应处理哪些具体用例？
   - 它需要可执行 scripts，还是只需要 instructions？
   - 是否有要包含的参考材料？

2. **起草 skill** - 创建：
   - 带简明 instructions 的 SKILL.md
   - 如果内容超过 500 行，创建额外 reference files
   - 如果需要确定性操作，创建 utility scripts

3. **与用户审查** - 展示草稿并询问：
   - 这是否覆盖你的用例？
   - 有什么缺失或不清楚的地方？
   - 是否有任何章节应该更详细/更简略？

## Skill 结构

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md 模板

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description 要求

description 是代理决定加载哪个 skill 时**唯一能看到的东西**。它会和所有其他已安装 skills 一起出现在 system prompt 中。你的代理会读取这些 descriptions，并根据用户请求选择相关 skill。

**目标**：给代理刚好足够的信息，让它知道：

1. 此 skill 提供什么能力
2. 何时/为什么触发它（具体关键词、上下文、文件类型）

**格式**：

- 最多 1024 chars
- 使用第三人称
- 第一句：它做什么
- 第二句："Use when [specific triggers]"

**好例子**：

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**坏例子**：

```
Helps with documents.
```

坏例子无法让你的代理把它与其他 document skills 区分开。

## 何时添加 Scripts

在以下情况下添加 utility scripts：

- 操作是确定性的（validation、formatting）
- 同样的代码会被反复生成
- 错误需要显式处理

Scripts 比生成代码节省 token，并提高可靠性。

## 何时拆分文件

在以下情况下拆分成单独文件：

- SKILL.md 超过 100 行
- 内容有不同领域（finance vs sales schemas）
- Advanced features 很少需要

## 审查清单

起草后，验证：

- [ ] Description 包含触发条件（"Use when..."）
- [ ] SKILL.md 少于 100 行
- [ ] 没有时效性信息
- [ ] 术语一致
- [ ] 包含具体 examples
- [ ] references 只深入一层
