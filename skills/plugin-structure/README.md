# Plugin Structure Skill

关于 Claude Code 插件架构、目录布局和最佳实践的完整说明。

## 概览

这个 skill 提供以下方面的详细知识：
- 插件目录结构与组织方式
- `plugin.json` manifest 配置
- 组件组织方式（commands、agents、skills、hooks）
- 自动发现机制
- 使用 `${CLAUDE_PLUGIN_ROOT}` 的可移植路径引用
- 文件命名约定

## Skill 结构

### SKILL.md（1,619 词）

核心 skill 内容覆盖：
- 目录结构总览
- 插件 manifest（`plugin.json`）字段
- 组件组织模式
- `${CLAUDE_PLUGIN_ROOT}` 的用法
- 文件命名约定
- 自动发现机制
- 最佳实践
- 常见模式
- 排错方法

### References

用于深入阅读的详细文档：

- **manifest-reference.md**：完整的 `plugin.json` 字段参考
  - 所有字段说明和示例
  - 路径解析规则
  - 校验指南
  - 最小 manifest 与完整 manifest 示例

- **component-patterns.md**：进阶组织模式
  - 组件生命周期（discovery、activation）
  - Command 组织模式
  - Agent 组织模式
  - Skill 组织模式
  - Hook 组织模式
  - Script 组织模式
  - 跨组件模式
  - 面向可扩展性的最佳实践

### Examples

三个完整插件示例：

- **minimal-plugin.md**：最简插件
  - 单个 command
  - 最小 manifest
  - 适用场景

- **standard-plugin.md**：结构完整的生产级插件
  - 多种组件（commands、agents、skills、hooks）
  - 带 metadata 的完整 manifest
  - 更丰富的 skill 结构
  - 组件之间的联动

- **advanced-plugin.md**：企业级插件
  - 多层级组织
  - MCP server 集成
  - 共享库
  - 配置管理
  - 安全自动化
  - 监控集成

## 这个 Skill 会在何时触发

当用户出现以下需求时，Claude Code 会启用这个 skill：
- 询问“create a plugin”或“scaffold a plugin”
- 需要“understand plugin structure”
- 想知道如何“organize plugin components”
- 需要“set up plugin.json”
- 询问如何使用 `${CLAUDE_PLUGIN_ROOT}`
- 想“add commands/agents/skills/hooks”
- 需要“configure auto-discovery” 方面的帮助
- 询问插件架构或相关最佳实践

## Progressive Disclosure

这个 skill 使用 progressive disclosure 来控制上下文规模：

1. **SKILL.md**（约 1600 词）：核心概念和工作流
2. **References**（约 6000 词）：详细字段说明和组织模式
3. **Examples**（约 8000 词）：完整可运行示例

Claude 只会在任务需要时再加载 references 和 examples。

## Related Skills

这个 skill 适合与以下 skill 搭配使用：
- **hook-development**：创建插件 hooks
- **mcp-integration**：集成 MCP servers（可用时）
- **marketplace-publishing**：发布插件（可用时）

## 维护建议

更新这个 skill 时：
1. 保持 `SKILL.md` 精简，只保留核心概念
2. 细节内容尽量移到 `references/`
3. 为常见模式补充新的 `examples/`
4. 更新 `SKILL.md` frontmatter 里的版本号
5. 确保文档整体保持祈使式 / 不定式风格
