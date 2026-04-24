# 优秀 Skill 示例

本文档总结高质量 skill 的共性，供创建或改进 skill 时参考。

## 示例 1：hook-development（A+）

优点：
- description 里有足够多且具体的 trigger phrases
- third-person 触发描述规范
- progressive disclosure 做得好
- `SKILL.md` 精简，细节放入 `references/`
- 写作风格统一，基本全是 imperative form

## 示例 2：agent-identifier（A）

优点：
- 对 agent 创建场景覆盖充分
- examples 完整
- references 聚焦明确
- 目录结构干净

## 示例 3：mcp-integration（A-）

优点：
- 触发短语围绕 MCP 场景非常具体
- 明确列出 server types
- references 主题拆分清晰

## 优秀 Description 的特点

- 3-5 个以上具体 trigger phrases
- 统一使用第三人称
- 长度适中
- 包含明确 use cases

可参考模板：

```yaml
description: This skill should be used when the user asks to "action 1",
"action 2", "action 3", or "action 4". [简要说明 skill 做什么]
```

## 优秀 Progressive Disclosure 的特点

- `SKILL.md` 控制在 1500-2000 词左右
- 细节拆到 `references/`
- 完整工作样例放到 `examples/`
- 工具脚本放到 `scripts/`

## 优秀 Writing Style 的特点

- 用 imperative verbs：Create / Validate / Check / Run
- 避免 `you / your / you're`
- 风格统一
- 指令直接、可执行

## 优秀 Structural Integrity 的特点

```text
skill-name/
├── SKILL.md
├── references/
├── examples/
└── scripts/
```

检查重点：
- YAML frontmatter 完整
- 所有引用文件存在
- examples 可运行
- scripts 可执行

## 核心总结

高质量 skill 通常具备：
1. 可发现的 description
2. 精简而清楚的 `SKILL.md`
3. 合理拆分的 references / examples / scripts
4. 一致的 imperative form
5. 完整、可验证的目录结构
