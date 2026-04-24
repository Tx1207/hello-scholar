# Plugin 专属 Command 特性参考

这份参考专门说明 Claude Code plugins 中 command 的特性与常见模式。

## 目录

- Plugin Command Discovery
- `CLAUDE_PLUGIN_ROOT` 环境变量
- Plugin Command Patterns
- 与其他 Plugin Components 的集成
- Validation Patterns

## Plugin Command Discovery

### Auto-Discovery

Claude Code 会自动发现插件中的 commands，典型结构如下：

```
plugin-name/
├── commands/
│   ├── foo.md
│   └── bar.md
└── plugin.json
```

关键点：
- commands 在插件加载时被发现
- 不需要手工注册
- 会出现在 `/help` 中，并带 `(plugin:plugin-name)` 标记
- 子目录可形成 namespace

### Namespaced Plugin Commands

按子目录组织 commands：

```
plugin-name/
└── commands/
    ├── review/
    └── deploy/
```

这样在 `/help` 中会显示对应 namespace，适合命令较多的插件。

### 命名约定

plugin command 名称应：
1. 清楚表达动作
2. 尽量避免和常见命令冲突
3. 多词命名时用连字符
4. 必要时考虑加 plugin 前缀

## `CLAUDE_PLUGIN_ROOT` 环境变量

### 作用

`${CLAUDE_PLUGIN_ROOT}` 是插件 command 中可用的特殊环境变量，会解析成插件目录的绝对路径。

它的重要性在于：
- 让插件内部路径具备可移植性
- 可以引用脚本、模板、配置文件
- 适配不同安装位置
- 对多文件插件尤其关键

### 基本用法

```markdown
Run analysis: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js`

Read template: @${CLAUDE_PLUGIN_ROOT}/templates/report.md
```

### 常见模式

1. **执行插件脚本**
2. **加载配置文件**
3. **访问模板或资源**
4. **串联多步骤插件工作流**

### 最佳实践

1. 插件内部路径都优先用 `${CLAUDE_PLUGIN_ROOT}`
2. 使用前先校验文件存在
3. 在文档中说明插件目录结构
4. 与 command arguments 组合使用

## Plugin Command Patterns

### Pattern 1：基于配置的 Command

适合每次都要读取插件级配置的 command，例如部署类 commands。

### Pattern 2：基于模板的生成

适合通过固定模板生成报告、文档、配置文件等标准化输出。

### Pattern 3：多脚本工作流

command 自身作为编排层，调用多个插件脚本完成 build、validate、test 等动作。

### Pattern 4：环境感知 Command

按 `dev/staging/prod` 或不同 runtime 环境加载不同配置与行为。

### Pattern 5：插件数据管理

当 command 需要长期缓存分析结果、时间戳或中间状态时，可写入插件 cache 目录。

## 与其他 Plugin Components 的集成

### 调用 Plugin Agents

command 可以通过 Task tool 触发插件里的 agents。例如：
- 深度代码分析
- 复杂 review
- 多步骤规划

前提是 agent 已存在于插件 `agents/` 目录中。

### 调用 Plugin Skills

command 可以显式提到 skill 名称，引导 Claude 加载该 skill 的专业知识，例如：
- `api-docs-standards`
- `code-standards`

### 与 Plugin Hooks 协同

某些 commands 会触发 hooks，例如提交前校验、写入前检查。设计 command 时应把这些 hook 交互写进文档。

### 多组件协同 Command

复杂 command 可以同时使用：
1. plugin scripts
2. plugin agents
3. plugin skills
4. plugin templates

适合完整 code review、deployment workflow、documentation generation 等场景。

## Validation Patterns

### 输入校验

在真正处理前先校验：
- 参数是否存在
- 参数格式是否正确
- 文件是否存在
- 环境值是否合法

### 文件存在性检查

如果 command 依赖输入文件或插件资源，先确认路径存在，再继续处理；否则告诉用户：
- 期望位置
- 期望格式
- 如何创建

### 必需参数检查

对于需要多个参数的 command，应明确提示 usage，而不是静默失败。

### Plugin Resource Validation

运行前检查：
- 配置文件是否存在
- `scripts/` 是否存在
- 可执行文件是否具备执行权限

### 输出校验

command 执行后还应验证：
- 退出码
- 产物目录是否存在
- 产物数量是否合理
- 构建 / 处理结果是否完整

### Graceful Error Handling

当脚本失败时，command 应：
1. 解释可能原因
2. 给出 troubleshooting 步骤
3. 提供替代做法

## 最佳实践总结

Plugin commands 应该：

1. 对所有插件内部路径使用 `${CLAUDE_PLUGIN_ROOT}`
2. 尽早校验输入
3. 说明插件结构和依赖资源
4. 与 agents / skills / hooks 做合理集成
5. 提供有帮助的错误消息
6. 处理缺文件、坏参数、脚本失败等边界情况
7. 保持单一职责，复杂逻辑下放给 scripts 或 agents
8. 在不同安装环境中反复测试

如需更一般性的 command 开发说明，请看主 `SKILL.md`；更多样例见 `examples/` 目录。
