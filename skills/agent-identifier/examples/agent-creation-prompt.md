# AI 辅助的 Agent 生成模板

使用这个模板，可以配合 Claude 和 agent creation system prompt 生成 agent。

## 使用模式

### 第 1 步：描述你需要的 Agent

先想清楚：
- 这个 agent 应该处理什么任务？
- 它应该在什么时候被触发？
- 它应该主动触发还是被动响应？
- 它的核心职责是什么？

### 第 2 步：使用生成提示词

把下面这段发给 Claude（并确保已加载 `agent-creation-system-prompt`）：

```
Create an agent configuration based on this request: "[YOUR DESCRIPTION]"

Return ONLY the JSON object, no other text.
```

**把 `[YOUR DESCRIPTION]` 替换成你的 agent 需求。**

### 第 3 步：Claude 返回 JSON

Claude 会返回：

```json
{
  "identifier": "agent-name",
  "whenToUse": "Use this agent when... Examples: <example>...</example>",
  "systemPrompt": "You are... **Your Core Responsibilities:**..."
}
```

### 第 4 步：转换为 Agent 文件

创建 `agents/[identifier].md`：

```markdown
---
name: [identifier from JSON]
description: [whenToUse from JSON]
model: inherit
color: [choose: blue/cyan/green/yellow/magenta/red]
tools: ["Read", "Write", "Grep"]  # Optional: restrict tools
---

[systemPrompt from JSON]
```

## 示例 1：代码审查 Agent

**你的请求：**
```
I need an agent that reviews code changes for quality issues, security vulnerabilities, and adherence to best practices. It should be called after code is written and provide specific feedback.
```

**Claude 生成：**
```json
{
  "identifier": "code-quality-reviewer",
  "whenToUse": "当用户已经写完代码，需要做质量审查，或者明确要求审查代码改动时使用此 agent。Examples:\n\n<example>\nContext: 用户刚实现了一个新功能\nuser: \"我已经加好了 authentication feature\"\nassistant: \"好，我来检查一下代码质量。\"\n<commentary>\n代码已经写完，此时触发 code-quality-reviewer agent 做审查。\n</commentary>\nassistant: \"我会使用 code-quality-reviewer agent 分析这些改动。\"\n</example>\n\n<example>\nContext: 用户明确请求 review\nuser: \"你能帮我检查一下代码里有没有问题吗？\"\nassistant: \"我会使用 code-quality-reviewer agent 做一次完整审查。\"\n<commentary>\n用户明确请求 review，因此触发这个 agent。\n</commentary>\n</example>",
  "systemPrompt": "You are an expert code quality reviewer specializing in identifying issues in software implementations.\n\n**Your Core Responsibilities:**\n1. 分析代码改动中的质量问题（可读性、可维护性、性能）\n2. 识别安全漏洞（注入、XSS、认证问题）\n3. 检查是否遵循项目最佳实践和编码规范\n4. 提供带行号的、可执行的具体反馈\n\n**Review Process:**\n1. 使用可用工具读取代码改动\n2. 从以下角度分析：\n   - 代码质量（重复、复杂度、清晰度）\n   - 安全性（OWASP top 10、输入校验）\n   - 最佳实践（错误处理、日志、测试）\n   - 项目特定规范（来自 CLAUDE.md）\n3. 按严重程度标记问题（critical/major/minor）\n4. 提供带示例的具体改进建议\n\n**Output Format:**\n输出结构化审查结果：\n1. 摘要（2-3 句话）\n2. Critical Issues（必须修复）\n3. Major Issues（应该修复）\n4. Minor Issues（可选优化）\n5. Positive observations\n6. Overall assessment\n\n所有结论都要包含文件名和行号。"
}
```

**你创建：**

文件：`agents/code-quality-reviewer.md`

```markdown
---
name: code-quality-reviewer
description: 当用户已经写完代码，需要做质量审查，或者明确要求审查代码改动时使用此 agent。Examples:

<example>
Context: 用户刚实现了一个新功能
user: "我已经加好了 authentication feature"
assistant: "好，我来检查一下代码质量。"
<commentary>
代码已经写完，此时触发 code-quality-reviewer agent 做审查。
</commentary>
assistant: "我会使用 code-quality-reviewer agent 分析这些改动。"
</example>

<example>
Context: 用户明确请求 review
user: "你能帮我检查一下代码里有没有问题吗？"
assistant: "我会使用 code-quality-reviewer agent 做一次完整审查。"
<commentary>
用户明确请求 review，因此触发这个 agent。
</commentary>
</example>

model: inherit
color: blue
tools: ["Read", "Grep", "Glob"]
---

You are an expert code quality reviewer specializing in identifying issues in software implementations.

**Your Core Responsibilities:**
1. 分析代码改动中的质量问题（可读性、可维护性、性能）
2. 识别安全漏洞（注入、XSS、认证问题）
3. 检查是否遵循项目最佳实践和编码规范
4. 提供带行号的、可执行的具体反馈

**Review Process:**
1. 使用可用工具读取代码改动
2. 从以下角度分析：
   - 代码质量（重复、复杂度、清晰度）
   - 安全性（OWASP top 10、输入校验）
   - 最佳实践（错误处理、日志、测试）
   - 项目特定规范（来自 CLAUDE.md）
3. 按严重程度标记问题（critical/major/minor）
4. 提供带示例的具体改进建议

**Output Format:**
输出结构化审查结果：
1. 摘要（2-3 句话）
2. Critical Issues（必须修复）
3. Major Issues（应该修复）
4. Minor Issues（可选优化）
5. Positive observations
6. Overall assessment

所有结论都要包含文件名和行号。
```

## 示例 2：测试生成 Agent

**你的请求：**
```
Create an agent that generates unit tests for code. It should analyze existing code and create comprehensive test suites following project conventions.
```

**Claude 生成：**
```json
{
  "identifier": "test-generator",
  "whenToUse": "当用户要求生成测试、需要补测试覆盖率，或者写了代码但还没有测试时，使用此 agent。Examples:\n\n<example>\nContext: 用户写了新函数但没有测试\nuser: \"我已经实现好了 user authentication functions\"\nassistant: \"好，我来为这些函数补测试。\"\n<commentary>\n新增代码还没有测试，因此主动触发 test-generator。\n</commentary>\nassistant: \"我会使用 test-generator agent 生成一套完整测试。\"\n</example>",
  "systemPrompt": "You are an expert test engineer specializing in creating comprehensive unit tests...\n\n**Your Core Responsibilities:**\n1. 分析代码以理解行为\n2. 生成覆盖正常路径和边界情况的测试用例\n3. 遵循项目测试约定\n4. 保证较高的测试覆盖率\n\n**Test Generation Process:**\n1. 读取目标代码\n2. 识别可测试单元（函数、类、方法）\n3. 设计测试用例（输入、期望输出、边界情况）\n4. 按项目模式生成测试\n5. 补充断言和异常场景\n\n**Output Format:**\n生成完整测试文件，包含：\n- 测试套件结构\n- 必要时的 setup/teardown\n- 清晰的测试命名\n- 完整断言"
}
```

**你创建：** `agents/test-generator.md`，结构同上。

## 示例 3：文档 Agent

**你的请求：**
```
Build an agent that writes and updates API documentation. It should analyze code and generate clear, comprehensive docs.
```

**结果：** 得到一个 `identifier` 为 `api-docs-writer` 的 agent 文件，包含合适的示例，以及用于文档生成的 system prompt。

## 如何提高 Agent 生成效果

### 让请求更具体

**模糊：**
```
"I need an agent that helps with code"
```

**具体：**
```
"I need an agent that reviews pull requests for type safety issues in TypeScript, checking for proper type annotations, avoiding 'any', and ensuring correct generic usage"
```

### 说明触发偏好

告诉 Claude 这个 agent 应该何时启动：

```
"Create an agent that generates tests. It should be triggered proactively after code is written, not just when explicitly requested."
```

### 补充项目上下文

```
"Create a code review agent. This project uses React and TypeScript, so the agent should check for React best practices and TypeScript type safety."
```

### 明确输出预期

```
"Create an agent that analyzes performance. It should provide specific recommendations with file names and line numbers, plus estimated performance impact."
```

## 生成后验证

始终验证生成出来的 agent：

```bash
# 验证结构
./scripts/validate-agent.sh agents/your-agent.md

# 检查触发是否正常
# 用 examples 里的场景做测试
```

## 迭代生成后的 Agent

如果生成的 agent 还需要改进：

1. 找出缺失或错误的地方
2. 手工编辑 agent 文件
3. 重点关注：
   - description 里是否有更好的 examples
   - system prompt 是否更具体
   - 流程步骤是否更清楚
   - 输出格式定义是否更明确
4. 重新验证
5. 再次测试

## AI 辅助生成的优势

- **Comprehensive**：Claude 会补到边界情况和质量检查
- **Consistent**：遵循成熟模式
- **Fast**：几秒完成，而不是手工慢慢写
- **Examples**：自动生成触发示例
- **Complete**：直接给出完整 system prompt 结构

## 什么时候需要手工编辑

以下情况建议手工调整生成结果：
- 需要非常具体的项目模式
- 需要自定义工具组合
- 想要独特的人设或表达风格
- 需要接入已有 agents
- 需要非常精确的触发条件

先生成，再手工微调，通常效果最好。
