# 组件组织模式

关于如何高效组织插件组件的进阶模式说明。

## 组件生命周期

### Discovery Phase

当 Claude Code 启动时：

1. **扫描已启用插件**：读取每个插件的 `.claude-plugin/plugin.json`
2. **发现组件**：检查默认路径和自定义路径
3. **解析定义**：读取 YAML frontmatter 和配置
4. **注册组件**：把组件注册到 Claude Code
5. **初始化**：启动 MCP servers、注册 hooks

**时机说明**：组件注册发生在 Claude Code 初始化阶段，不是持续后台扫描。

### Activation Phase

当组件真正被使用时：

- **Commands**：用户输入 slash command -> Claude Code 查找 -> 执行
- **Agents**：任务到达 -> Claude Code 评估能力 -> 选择 agent
- **Skills**：任务上下文命中描述 -> Claude Code 加载 skill
- **Hooks**：事件发生 -> Claude Code 调用匹配 hooks
- **MCP Servers**：工具调用命中 server 能力 -> 转发给对应 server

## Command 组织模式

### Flat Structure

所有 command 都放在一个目录：

```
commands/
├── build.md
├── test.md
├── deploy.md
├── review.md
└── docs.md
```

**适用场景：**
- 总共只有 5-15 个 commands
- 命令抽象层级相近
- 没有明显分类

**优点：**
- 简单，容易导航
- 不需要额外配置
- 发现速度快

### Categorized Structure

按不同 command 类型拆目录：

```
commands/
├── build.md
└── test.md

admin-commands/
├── configure.md
└── manage.md

workflow-commands/
├── review.md
└── deploy.md
```

**Manifest 配置：**
```json
{
  "commands": [
    "./commands",
    "./admin-commands",
    "./workflow-commands"
  ]
}
```

**适用场景：**
- 15 个以上 commands
- 有清晰功能分类
- 不同命令具备不同权限层级

### Hierarchical Structure

复杂插件可做分层组织：

```
commands/
├── ci/
│   ├── build.md
│   ├── test.md
│   └── lint.md
├── deployment/
│   ├── staging.md
│   └── production.md
└── management/
    ├── config.md
    └── status.md
```

**注意**：Claude Code 不会自动递归发现嵌套 command，需要显式写自定义路径：

```json
{
  "commands": [
    "./commands/ci",
    "./commands/deployment",
    "./commands/management"
  ]
}
```

## Agent 组织模式

### 按角色划分

```
agents/
├── code-reviewer.md
├── test-generator.md
├── documentation-writer.md
└── refactorer.md
```

适合职责清晰、互不重叠的 agents。

### 按能力划分

```
agents/
├── python-expert.md
├── typescript-expert.md
├── api-specialist.md
└── database-specialist.md
```

适合按技术栈或领域专长自动选 agent 的场景。

### 按工作流阶段划分

```
agents/
├── planning-agent.md
├── implementation-agent.md
├── testing-agent.md
└── deployment-agent.md
```

适合顺序式工作流和 pipeline 自动化。

## Skill 组织模式

### 按主题划分

```
skills/
├── api-design/
├── error-handling/
├── testing-strategies/
└── performance-optimization/
```

适合知识型、参考型 skill。

### 按工具划分

```
skills/
├── docker/
├── kubernetes/
└── terraform/
```

适合工具特定知识、复杂配置和最佳实践。

### 按工作流划分

```
skills/
├── code-review-workflow/
├── deployment-workflow/
└── testing-workflow/
```

适合多步骤流程、公司内部流程和自动化套路。

### 带丰富资源的 Skill

```
skills/
└── api-testing/
    ├── SKILL.md
    ├── references/
    ├── examples/
    ├── scripts/
    └── assets/
```

**各类资源的职责：**
- **SKILL.md**：总览与触发条件
- **references/**：按需加载的详细说明
- **examples/**：可复制的样例
- **scripts/**：可执行脚本
- **assets/**：模板与配置

## Hook 组织模式

### Monolithic Configuration

所有 hooks 都放在一个 `hooks.json` 中，适合 hook 数量不多、逻辑简单的插件。

### Event-Based Organization

按事件拆成多个文件，再通过构建脚本合并。适合 hook 数量很多、由不同团队维护的情况。

### Purpose-Based Organization

按功能组织脚本，例如：

```
hooks/
└── scripts/
    ├── security/
    ├── quality/
    └── workflow/
```

适合 hook 脚本很多、职责边界清晰的插件。

## Script 组织模式

### Flat Scripts

所有脚本放在同一目录，适合只有少量脚本的小插件。

### Categorized Scripts

按用途分成 `build/`、`test/`、`deploy/`、`utils/` 等目录，适合 10 个以上脚本。

### Language-Based Organization

按语言拆成 `bash/`、`python/`、`javascript/` 目录，适合运行时依赖不同的插件。

## 跨组件模式

### Shared Resources

让 commands、agents、hooks 共享 `lib/` 里的公共脚本或工具函数：

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/lib/test-utils.sh"
run_tests
```

这样可以减少重复、保持行为一致、降低维护成本。

### Layered Architecture

```
plugin/
├── commands/
├── agents/
├── skills/
└── lib/
```

适合大插件、多开发者协作和明确分层的场景。

### Plugin Within Plugin

把功能拆成 core 和多个 extensions，再在 manifest 中显式声明路径。适合模块化、可选功能和插件家族式结构。

## 最佳实践

### 命名

1. 文件名应和组件职责一致
2. 名称尽量描述清楚用途
3. 少用缩写，优先完整单词

### 组织

1. 先从简单结构开始
2. 相关内容尽量放在一起
3. 不要混放无关功能

### 可扩展性

1. 提前选择能扩展的结构
2. 在失控前尽早重构目录
3. 在 README 里解释结构原因

### 可维护性

1. 全插件保持一致模式
2. 控制目录嵌套深度
3. 尽量遵循社区通用约定

### 性能

1. 避免过深嵌套，减少 discovery 成本
2. 能用默认路径就少写自定义路径
3. 配置文件尽量保持小而清晰
