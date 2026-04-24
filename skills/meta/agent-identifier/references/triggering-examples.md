# Agent 触发示例：最佳实践

这是一份完整指南，说明如何在 agent description 里编写高质量的 `<example>` 块，让触发行为更稳定。

## 示例块格式

标准触发示例通常长这样：

```markdown
<example>
Context: [描述场景，即这段交互发生前发生了什么]
user: "[用户的原始消息或请求]"
assistant: "[Claude 在触发 agent 前应该怎么回应]"
<commentary>
[解释为什么在这个场景下应该触发这个 agent]
</commentary>
assistant: "[Claude 如何触发 agent，通常是 'I'll use the [agent-name] agent...']"
</example>
```

## 一个好示例的组成部分

### Context

**作用：** 交代背景，说明用户消息出现前发生了什么。

**好的 Context：**
```
Context: 用户刚实现了一个新的 authentication feature
Context: 用户已经创建了一个 PR，希望做审查
Context: 用户正在排查 test failure
Context: 写完多个函数后还没有补文档
```

**不好的 Context：**
```
Context: User needs help（太模糊）
Context: Normal usage（不具体）
```

### User Message

**作用：** 展示真正会触发 agent 的用户说法。

**好的用户消息：**
```
user: "我已经加好了 OAuth flow，你帮我看看？"
user: "Review PR #123"
user: "这个测试为什么会失败？"
user: "给这些函数补文档"
```

**尽量覆盖不同表述：**
同一个意图可以给出几种不同说法：
```
Example 1: user: "Review my code"
Example 2: user: "Can you check this implementation?"
Example 3: user: "Look over my changes"
```

### Assistant Response（触发前）

**作用：** 说明 Claude 在启动 agent 前先说什么。

**好的响应：**
```
assistant: "我来分析一下你的 OAuth 实现。"
assistant: "我来帮你看一下这个 PR。"
assistant: "我来排查这个 test failure。"
```

**主动触发示例：**
```
assistant: "好，我再帮你审一下代码质量。"
<commentary>
代码刚写完，因此主动触发 review agent。
</commentary>
```

### Commentary

**作用：** 解释触发原因，也就是“为什么这里应该触发这个 agent”。

**好的 commentary：**
```
<commentary>
用户明确要求代码审查，因此触发 code-reviewer agent。
</commentary>

<commentary>
代码实现刚完成，此时主动使用 review agent 检查质量。
</commentary>

<commentary>
PR 分析请求与 pr-analyzer agent 的专长一致。
</commentary>
```

**最好把决策逻辑写出来：**
```
<commentary>
用户刚写了 tests（之前使用了 Test tool）。此时应由 test-analyzer
agent 检查测试质量和覆盖率，再继续后续流程。
</commentary>
```

### Assistant Response（正式触发）

**作用：** 展示 Claude 是如何调用 agent 的。

**标准写法：**
```
assistant: "I'll use the [agent-name] agent to [what it will do]."
```

**示例：**
```
assistant: "I'll use the code-reviewer agent to analyze the changes."
assistant: "Let me use the test-generator agent to create comprehensive tests."
assistant: "I'll use the security-analyzer agent to check for vulnerabilities."
```

## 示例类型

### 类型 1：显式请求

用户直接说出了这个 agent 的用途：

```markdown
<example>
Context: 用户明确要求做安全分析
user: "帮我检查一下代码里的安全漏洞"
assistant: "我会使用 security-analyzer agent 做一次完整安全审查。"
<commentary>
直接的安全分析请求会触发 security-analyzer agent。
</commentary>
</example>
```

### 类型 2：主动触发

即使用户没明说，只要刚完成相关工作，也可以主动触发：

```markdown
<example>
Context: 用户刚实现了数据库查询逻辑
user: "我已经加好了 user search functionality"
assistant: "好，我来先做一下安全检查。"
<commentary>
数据库相关代码刚完成，此时主动触发 security-analyzer，重点检查 SQL injection 和其他数据库安全问题。
</commentary>
assistant: "我会使用 security-analyzer agent 检查这部分数据库代码。"
</example>
```

### 类型 3：隐式请求

用户没有直接说出 agent 名称，但已经暗示了需求：

```markdown
<example>
Context: 用户表示代码难以理解
user: "这段代码太绕了，很难看懂"
assistant: "我可以帮你把代码理顺。"
<commentary>
用户表达了复杂度和可读性问题，因此触发 code-simplifier agent，帮助重构并提升可读性。
</commentary>
assistant: "我会使用 code-simplifier agent 给出改进建议。"
</example>
```

### 类型 4：基于工具使用模式

也可以根据之前的工具使用轨迹触发：

```markdown
<example>
Context: 用户刚对多个测试文件做了编辑
user: "我把 tests 都更新好了"
assistant: "好，我再帮你检查一下测试质量。"
<commentary>
多个 test 文件刚被 Edit tool 修改，此时主动触发 test-quality-analyzer，确认测试是否符合最佳实践。
</commentary>
assistant: "我会使用 test-quality-analyzer agent 审查这些测试。"
</example>
```

## 多示例策略

### 覆盖不同说法

```markdown
<example>
user: "Review my code"
[...]
</example>

<example>
user: "Can you check my implementation?"
[...]
</example>

<example>
user: "Look over these changes"
[...]
</example>
```

### 同时覆盖主动和被动触发

```markdown
<example>
Context: 用户明确请求 review
user: "Review my code for issues"
[...]
</example>

<example>
Context: 用户刚写完代码
user: "我已经把这个 feature 实现好了"
assistant: "好，我现在来帮你审一下。"
<commentary>
代码已完成，因此主动审查。
</commentary>
[...]
</example>
```

### 覆盖边界情况

```markdown
<example>
Context: 常规使用
user: "Check my PR"
[...]
</example>

<example>
Context: 一个很大的 PR，需要更深入分析
user: "这个 PR 很大，你能做一次深度 review 吗？"
[...]
<commentary>
用户特别提到这是大 PR，因此应使用更彻底的分析模式。
</commentary>
</example>
```

## 常见错误

### ❌ 没有 Context

```markdown
<example>
user: "Review my code"
assistant: "I'll use the code-reviewer agent."
</example>
```

**为什么不好：** 看不出这次请求的前置背景。

### ✅ 带上 Context

```markdown
<example>
Context: 用户刚完成 authentication 实现
user: "Review my code"
assistant: "I'll use the code-reviewer agent to analyze the auth implementation."
<commentary>
auth 相关代码刚写完，需要从安全和最佳实践角度审查。
</commentary>
</example>
```

### ❌ 没有 Commentary

```markdown
<example>
Context: 用户请求审查
user: "Check my changes"
assistant: "I'll use the reviewer agent."
</example>
```

**为什么不好：** 没说明为什么这里应该触发这个 agent。

### ✅ 带上 Commentary

```markdown
<example>
Context: 用户改完代码后请求检查
user: "Check my changes"
assistant: "I'll use the code-reviewer agent to analyze the modifications."
<commentary>
代码审查请求触发 agent，对质量、安全和规范进行检查。
</commentary>
</example>
```

### ❌ 直接给出 Agent 输出

```markdown
<example>
user: "Review my code"
assistant: "I found the following issues: [lists issues]"
</example>
```

**为什么不好：** 这展示的是 agent 的输出，而不是触发过程。

### ✅ 展示触发动作

```markdown
<example>
user: "Review my code"
assistant: "I'll use the code-reviewer agent to perform the review."
<commentary>
这是明确的 review 请求，因此触发这个 agent。
</commentary>
</example>
```

## 需要写多少个示例？

### 最少：2 个

至少覆盖：
1. 显式请求
2. 一个变体或主动触发场景

### 推荐：3-4 个

建议覆盖：
1. 显式请求（直接要求）
2. 隐式请求（用户暗示需求）
3. 主动触发（相关工作完成后自动调用）
4. 边界或特殊场景

### 最多：6 个

超过 6 个通常会让 description 过长。聚焦最重要的触发场景即可。

## 模板库

### 代码审查 Agent

```markdown
<example>
Context: 用户刚实现了一个新功能
user: "我已经加好了 user registration feature"
assistant: "好，我来检查一下代码质量。"
<commentary>
代码刚写完，因此主动触发 code-reviewer agent。
</commentary>
assistant: "我会使用 code-reviewer agent 分析这次实现。"
</example>

<example>
Context: 用户明确要求 review
user: "你能帮我检查一下这些改动里有没有问题吗？"
assistant: "我会使用 code-reviewer agent 做一次完整审查。"
<commentary>
显式 review 请求会触发这个 agent。
</commentary>
</example>
```

### 测试生成 Agent

```markdown
<example>
Context: 用户实现了函数但没有测试
user: "我已经加好了 data processing functions"
assistant: "好，我来给这些函数补测试。"
<commentary>
新增代码没有测试，因此主动触发 test-generator agent。
</commentary>
assistant: "我会使用 test-generator agent 创建完整测试。"
</example>

<example>
Context: 用户明确要求生成测试
user: "给我的代码生成测试"
assistant: "我会使用 test-generator agent 生成完整测试套件。"
<commentary>
直接的测试生成请求会触发这个 agent。
</commentary>
</example>
```

### 文档 Agent

```markdown
<example>
Context: 用户新增了 API endpoint
user: "我已经实现好了 REST API endpoints"
assistant: "我来把这些 endpoint 文档补上。"
<commentary>
新增 API 代码，因此主动生成文档。
</commentary>
assistant: "我会使用 api-docs-writer agent 生成完整文档。"
</example>

<example>
Context: 用户要求补文档
user: "给这个 API 写文档"
assistant: "我会使用 api-docs-writer agent 生成清晰文档。"
<commentary>
文档请求会触发这个 agent。
</commentary>
</example>
```

### 验证类 Agent

```markdown
<example>
Context: 用户准备提交改动
user: "我准备提交这段代码了"
assistant: "我先帮你做一下校验。"
<commentary>
提交前，主动用 validation-agent 做检查。
</commentary>
assistant: "我会使用 code-validator agent 检查这里有没有问题。"
</example>

<example>
Context: 用户要求验证
user: "帮我验证一下这个实现"
assistant: "我会使用 code-validator agent 验证正确性。"
<commentary>
显式验证请求会触发这个 agent。
</commentary>
</example>
```

## 调试触发问题

### Agent 没有触发

**检查：**
1. examples 里是否包含用户消息里的相关关键词
2. context 是否匹配真实使用场景
3. commentary 是否清楚说明了触发逻辑
4. assistant 是否在示例里展示了 Agent tool 的使用

**修复方式：**
补充更多不同表述的 examples。

### Agent 触发过于频繁

**检查：**
1. examples 是否写得过宽或过泛
2. 触发条件是否和其他 agent 重叠
3. commentary 是否没有说明“何时不该触发”

**修复方式：**
让 examples 更具体，并补充负面边界说明。

### Agent 在错误场景下触发

**检查：**
1. examples 是否没有准确表达预期用途
2. commentary 是否误导了触发条件

**修复方式：**
重写 examples，只展示正确场景。

## 最佳实践总结

✅ **应该做：**
- 写 2-4 个具体且明确的 examples
- 同时展示显式触发和主动触发
- 每个 example 都给出清楚 context
- 在 commentary 中解释触发原因
- 覆盖不同用户表述
- 展示 Claude 如何调用 Agent tool

❌ **不要做：**
- 使用空泛、模糊的 examples
- 省略 context 或 commentary
- 只展示一种触发方式
- 跳过 agent invocation 这一步
- 几个例子写得几乎一样
- 忘记说明为什么触发

## 结论

高质量 examples 对 agent 的可靠触发非常关键。花时间把例子写具体、写多样，通常比事后修触发逻辑更有效。
