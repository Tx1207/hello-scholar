# 标准插件示例

一个结构清晰、同时包含 commands、agents 和 skills 的插件。

## 目录结构

```
code-quality/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── lint.md
│   ├── test.md
│   └── review.md
├── agents/
│   ├── code-reviewer.md
│   └── test-generator.md
├── skills/
│   ├── code-standards/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── style-guide.md
│   └── testing-patterns/
│       ├── SKILL.md
│       └── examples/
│           ├── unit-test.js
│           └── integration-test.js
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       └── validate-commit.sh
└── scripts/
    ├── run-linter.sh
    └── generate-report.py
```

## 文件内容

### .claude-plugin/plugin.json

```json
{
  "name": "code-quality",
  "version": "1.0.0",
  "description": "提供 lint、test 与 review 自动化的综合代码质量工具",
  "author": {
    "name": "Quality Team",
    "email": "quality@example.com"
  },
  "homepage": "https://docs.example.com/plugins/code-quality",
  "repository": "https://github.com/example/code-quality-plugin",
  "license": "MIT",
  "keywords": ["code-quality", "linting", "testing", "code-review", "automation"]
}
```

### commands/lint.md

```markdown
---
name: lint
description: 对代码库执行 lint 检查
---

# Lint Command

对项目代码库执行完整 lint 检查。

## Process

1. 识别项目类型和已安装的 linter
2. 运行合适的 linter（ESLint、Pylint、RuboCop 等）
3. 收集并格式化结果
4. 按文件位置和严重程度报告问题

## Implementation

执行 lint 脚本：

\`\`\`bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/run-linter.sh
\`\`\`

解析输出，并按以下维度整理问题：
- Critical issues（必须修复）
- Warnings（建议修复）
- Style suggestions（可选优化）

每个问题都应展示：
- 文件路径和行号
- 问题描述
- 修复建议（如果有）
```

### commands/test.md

```markdown
---
name: test
description: 运行测试套件并生成覆盖率报告
---

# Test Command

执行项目测试，并生成覆盖率结果。

## Process

1. 识别测试框架（Jest、pytest、RSpec 等）
2. 运行全部测试
3. 生成覆盖率报告
4. 找出未覆盖代码

## Output

结构化展示结果：
- 测试摘要（passed/failed/skipped）
- 按文件统计的覆盖率
- 关键未覆盖区域
- 失败测试详情

## Integration

测试结束后，可以继续提供：
- 修复失败测试
- 为未覆盖代码生成测试（使用 test-generator agent）
- 按测试变化更新文档
```

### agents/code-reviewer.md

```markdown
---
description: 擅长识别 bug、安全问题和改进空间的代码审查 agent
capabilities:
  - 分析潜在 bug 和逻辑错误
  - 识别安全漏洞
  - 提出性能优化建议
  - 检查代码是否符合项目规范
  - 评估测试覆盖是否充分
---

# Code Reviewer Agent

用于做完整代码审查的专用 agent。

## Expertise

- **Bug detection**：逻辑错误、边界情况、错误处理
- **Security analysis**：注入漏洞、认证问题、数据暴露
- **Performance**：算法效率、资源使用、优化机会
- **Standards compliance**：风格规范、命名约定、文档
- **Test coverage**：测试场景是否充分、是否遗漏

## Review Process

1. **Initial scan**：快速扫一遍明显问题
2. **Deep analysis**：逐行分析改动代码
3. **Context evaluation**：检查对相关代码的影响
4. **Best practices**：与项目规范和语言规范对照
5. **Recommendations**：给出按优先级排序的改进建议

## Integration with Skills

自动加载 `code-standards` skill，读取项目特定规范。

## Output Format

对每个被审查文件输出：
- 总体评价
- Critical issues（合并前必须修复）
- Important issues（建议修复）
- Suggestions（可选改进）
- Positive feedback（做得好的地方）
```

### agents/test-generator.md

```markdown
---
description: 基于代码分析生成完整测试套件
capabilities:
  - 分析代码结构和逻辑流
  - 为函数和方法生成单元测试
  - 为模块创建集成测试
  - 设计边界情况与异常测试
  - 建议合适的 fixtures 和 mocks
---

# Test Generator Agent

用于生成完整测试套件的专用 agent。

## Expertise

- **Unit testing**：函数/方法级测试
- **Integration testing**：模块交互测试
- **Edge cases**：边界条件、错误路径
- **Test organization**：测试结构与命名
- **Mocking**：合理使用 mocks 和 stubs

## Generation Process

1. **Code analysis**：理解函数目的和逻辑
2. **Path identification**：梳理所有执行路径
3. **Input design**：设计覆盖路径的输入
4. **Assertion design**：定义预期输出
5. **Test generation**：按项目测试框架生成测试

## Integration with Skills

自动加载 `testing-patterns` skill，遵循项目测试约定。

## Test Quality

生成结果应包含：
- Happy path 场景
- 边界和极端情况
- 错误处理验证
- 外部依赖的 mock 数据
- 清晰的测试描述
```

### hooks/hooks.json

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "在修改代码前，先根据 code-standards skill 检查是否符合编码规范，包括格式、命名和文档要求；若不满足，先给出改进建议。",
          "timeout": 30
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": ".*",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/validate-commit.sh",
          "timeout": 45
        }
      ]
    }
  ]
}
```

## 使用示例

### 运行 Commands

```
$ claude
> /lint
正在运行 lint 检查...

Critical Issues (2):
  src/api/users.js:45 - SQL injection 漏洞
  src/utils/helpers.js:12 - 未处理的 promise rejection

Warnings (5):
  src/components/Button.tsx:23 - 缺少 PropTypes
  ...

Style Suggestions (8):
  src/index.js:1 - 建议使用 const 替代 let
  ...

> /test
正在运行测试...

Test Results:
  ✓ 245 passed
  ✗ 3 failed
  ○ 2 skipped

Coverage: 87.3%
```

### 使用 Agents

```
> Review the changes in src/api/users.js

[自动选择 code-reviewer agent]

Code Review: src/api/users.js

Critical Issues:
  1. Line 45: SQL injection 漏洞
     - 使用字符串拼接构造 SQL 查询
     - 应改为 parameterized query
     - Priority: CRITICAL
```

## 关键点

1. **完整 manifest**：包含推荐 metadata
2. **多组件协作**：commands、agents、skills、hooks 配合工作
3. **丰富的 skill 资源**：通过 references 和 examples 补充细节
4. **自动化约束**：hooks 自动执行规范检查
5. **整体联动**：各组件可以串成一致工作流

## 什么时候适合这种模式

- 要分发的生产级插件
- 团队协作工具
- 需要一致性约束的插件
- 拥有多个入口点的复杂工作流
