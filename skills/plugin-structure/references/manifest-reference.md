# Plugin Manifest 参考

`plugin.json` 配置的完整参考说明。

## 文件位置

**必须路径**：`.claude-plugin/plugin.json`

> **范围说明**：这里描述的是 Claude Code 插件 manifest 结构，不是 Codex 原生 manifest。

manifest 必须位于插件根目录下的 `.claude-plugin/` 中；放错位置时，Claude Code 不会识别这个插件。

## 完整字段参考

### 核心字段

#### name（必填）

**类型**：String  
**格式**：kebab-case  
**示例**：`"test-automation-suite"`

这是插件的唯一标识，用于：
- Claude Code 中的插件识别
- 与其他插件的冲突检测
- 命令命名空间（可选）

**要求：**
- 在所有已安装插件中必须唯一
- 只能使用小写字母、数字和连字符
- 不能包含空格或特殊字符
- 必须字母开头
- 必须以字母或数字结尾

**校验规则：**
```javascript
/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/
```

#### version

**类型**：String  
**格式**：Semantic versioning（MAJOR.MINOR.PATCH）  
**默认值**：未指定时为 `"0.1.0"`

语义化版本含义：
- **MAJOR**：不兼容变更
- **MINOR**：向后兼容的新功能
- **PATCH**：向后兼容的 bug 修复

也支持 `alpha`、`beta`、`rc` 这类预发布版本。

#### description

**类型**：String  
**建议长度**：50-200 字符

用于简要说明插件用途和能力。

**建议：**
- 重点写“做什么”，不是“怎么做”
- 尽量使用主动语态
- 提到关键能力或收益
- 控制在 marketplace 易读长度内

### 元数据字段

#### author

**类型**：Object 或 String

对象格式：
```json
{
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "url": "https://janedeveloper.com"
  }
}
```

用于署名、支持联系方式和 marketplace 展示。

#### homepage

**类型**：URL 字符串

应指向：
- 插件文档站
- 项目主页
- 详细使用指南
- 安装说明

#### repository

**类型**：URL 字符串或对象

可以写简单 URL，也可以写带 `type`、`url`、`directory` 的对象形式，用于源码仓库定位和社区协作。

#### license

**类型**：String  
**格式**：SPDX identifier

常见值包括：
- `"MIT"`
- `"Apache-2.0"`
- `"GPL-3.0"`
- `"BSD-3-Clause"`
- `"ISC"`
- `"UNLICENSED"`

#### keywords

**类型**：字符串数组

用于插件发现和分类。

**建议：**
- 使用 5-10 个关键词
- 包含功能类别、技术栈和工作流关键词
- 不要只重复插件名

### 组件路径字段

#### commands

**类型**：String 或字符串数组  
**默认值**：`["./commands"]`

表示 command 定义所在的额外目录或文件路径。

```json
{
  "commands": [
    "./commands",
    "./admin-commands"
  ]
}
```

适合按类别组织 commands、拆分稳定与实验命令等场景。

#### agents

**类型**：String 或字符串数组  
**默认值**：`["./agents"]`

格式与 `commands` 相同，用于声明额外 agent 路径。

#### hooks

**类型**：JSON 文件路径字符串，或内联对象  
**默认值**：`"./hooks/hooks.json"`

简单插件可内联配置，复杂插件建议放单独文件。

#### mcpServers

**类型**：JSON 文件路径字符串，或内联对象  
**默认值**：`"./.mcp.json"`

单个简单 server 可内联，多个 MCP servers 建议使用外部 `.mcp.json`。

## 路径解析规则

所有组件路径都应满足：

1. 必须是相对路径
2. 必须以 `./` 开头
3. 不允许使用 `../`
4. 即使在 Windows 也统一使用正斜杠 `/`

**示例：**
- ✅ `"./commands"`
- ✅ `"./src/commands"`
- ❌ `"/Users/name/plugin/commands"`
- ❌ `"commands"`
- ❌ `"../shared/commands"`
- ❌ `".\\commands"`

## 加载顺序

Claude Code 加载组件时：

1. 先扫描默认目录
2. 再扫描 manifest 中声明的自定义路径
3. 最后合并所有发现到的组件

**注意：**
- 不会覆盖已有组件
- 所有已发现组件都会注册
- 同名冲突会报错

## 校验

### Manifest 校验内容

加载插件时，Claude Code 会检查：
- JSON 语法是否正确
- 字段类型是否正确
- `name` 是否存在且格式合法
- `version` 是否符合语义化版本
- 路径是否为带 `./` 的相对路径
- URL 是否有效
- 引用路径是否存在
- hook / MCP 配置是否合法

### 常见错误

**name 格式错误：**
```json
{
  "name": "My Plugin"
}
```

应改为：
```json
{
  "name": "my-plugin"
}
```

**使用绝对路径：**
```json
{
  "commands": "/Users/name/commands"
}
```

应改为：
```json
{
  "commands": "./commands"
}
```

**缺少 `./` 前缀：**
```json
{
  "hooks": "hooks/hooks.json"
}
```

应改为：
```json
{
  "hooks": "./hooks/hooks.json"
}
```

## 示例层级

### 最小插件

```json
{
  "name": "hello-world"
}
```

### 推荐插件

```json
{
  "name": "code-review-assistant",
  "version": "1.0.0",
  "description": "自动化代码审查，并提供风格检查和修改建议",
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com"
  },
  "homepage": "https://docs.example.com/code-review",
  "repository": "https://github.com/janedev/code-review-assistant",
  "license": "MIT",
  "keywords": ["code-review", "automation", "quality", "ci-cd"]
}
```

### 完整插件

```json
{
  "name": "enterprise-devops",
  "version": "2.3.1",
  "description": "面向企业 CI/CD pipelines 的综合 DevOps 自动化插件",
  "author": {
    "name": "DevOps Team",
    "email": "devops@company.com",
    "url": "https://company.com/devops"
  },
  "homepage": "https://docs.company.com/plugins/devops",
  "repository": {
    "type": "git",
    "url": "https://github.com/company/devops-plugin.git"
  },
  "license": "Apache-2.0",
  "keywords": ["devops", "ci-cd", "automation", "kubernetes", "docker", "deployment"],
  "commands": ["./commands", "./admin-commands"],
  "agents": "./specialized-agents",
  "hooks": "./config/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

## 最佳实践

### 元数据

1. 始终写 `version`
2. `description` 要清楚说明用途
3. 提供联系方式，便于支持
4. 链接到文档，减少重复答疑
5. 选择符合项目目标的 license

### Paths

1. 能用默认路径就别额外配置
2. 按逻辑组织组件
3. 使用非标准布局时要写清楚原因
4. 在不同系统上测试路径解析

### Maintenance

1. 变更后同步升级版本号
2. 新功能上线后更新 keywords
3. 保持 description 与真实能力一致
4. 维护 changelog
5. 仓库和文档链接要保持可用

### Distribution

1. 发布前补齐 metadata
2. 在干净环境中验证安装
3. 先做 manifest 校验
4. 提供 README 说明安装与用法
5. 在插件根目录附上 LICENSE 文件
