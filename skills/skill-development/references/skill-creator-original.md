---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

这个参考文件解释如何创建一个高质量 skill。

## 什么是 Skill

Skill 是模块化、可自包含的能力包，用于通过以下内容扩展 Claude：
- 专门工作流
- 工具集成方式
- 领域知识
- 打包资源（scripts / references / assets）

## Skill 的基本结构

每个 skill 至少包含：

```text
skill-name/
├── SKILL.md
└── 可选资源
    ├── scripts/
    ├── references/
    └── assets/
```

### SKILL.md

frontmatter 中至少需要：
- `name`
- `description`

`description` 决定 skill 何时触发，因此要具体，并使用第三人称。

### scripts/

适合放：
- 反复重写的确定性逻辑
- 需要可执行、可复用的脚本

### references/

适合放：
- 文档
- schema
- API 说明
- 详细工作流指南

目标是让 `SKILL.md` 精简，把细节放到按需加载的 references 里。

### assets/

适合放：
- 模板
- 图像
- 字体
- boilerplate

这些资源一般用于最终输出，而不是直接加载进上下文。

## Progressive Disclosure

Skill 建议按三层组织：

1. `name + description`
2. `SKILL.md` 主体
3. 按需加载的 resources

## Skill 创建流程

### Step 1：用具体例子理解 Skill

先搞清楚：
- skill 解决什么问题
- 用户会怎么说来触发它
- 哪些案例最常见

### Step 2：规划可复用内容

针对每个具体案例，思考：
- 哪些 scripts 值得沉淀？
- 哪些 references 应保留下来？
- 哪些 assets 能复用？

### Step 3：初始化 Skill

如果是新 skill，先运行初始化脚本：

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

### Step 4：编辑 Skill

先整理 reusable resources，再完成 `SKILL.md`。

写 `SKILL.md` 时重点回答：
1. skill 的目的是什么？
2. 什么时候该用？
3. Claude 实际该如何使用它？

### Step 5：打包 Skill

打包前先自动校验，再生成 zip：

```bash
scripts/package_skill.py <path/to/skill-folder>
```

### Step 6：持续迭代

真实使用后，根据：
- 卡点
- 效率问题
- 信息缺失

持续更新 `SKILL.md` 和资源目录。
