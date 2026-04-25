---
name: code-review-excellence
description: 当用户要求 review diff 或 pull request、撰写 review comment、审计代码质量、建立 review 标准，或改进团队 code review 方式时使用。
version: 0.1.0
---

# Code Review Excellence

把 code review 从“卡门槛”转成知识共享过程，依靠建设性反馈、系统分析和协作改进来提升质量。

## When to Use This Skill

- Review pull request 和代码变更
- 为团队建立 code review 标准
- 通过 review 指导 junior developer
- 做 architecture review
- 创建 review checklist 与 guideline
- 改进团队协作
- 缩短 review cycle time
- 维持代码质量基线

## Core Principles

### 1. The Review Mindset

**Code Review 的目标：**
- 发现 bug 和 edge case
- 保证可维护性
- 在团队内共享知识
- 执行编码标准
- 改进设计与架构
- 建立健康工程文化

**不是目标：**
- 炫耀知识
- 纠结格式细枝末节（交给 linter / formatter）
- 无谓阻塞进度
- 按个人偏好强行重写

### 2. Effective Feedback

**好的反馈应当：**
- 具体且可执行
- 以教育为导向，而非评判
- 针对代码，不针对人
- 有平衡感，认可好的部分
- 有优先级区分

```markdown
❌ Bad: "This is wrong."
✅ Good: "This could cause a race condition when multiple users
         access simultaneously. Consider using a mutex here."

❌ Bad: "Why didn't you use X pattern?"
✅ Good: "Have you considered the Repository pattern? It would
         make this easier to test. Here's an example: [link]"

❌ Bad: "Rename this variable."
✅ Good: "[nit] Consider `userCount` instead of `uc` for
         clarity. Not blocking if you prefer to keep it."
```

### 3. Review Scope

**该 review 的内容：**
- 逻辑正确性与 edge case
- 安全风险
- 性能影响
- 测试覆盖和质量
- 错误处理
- 文档和注释
- API 设计与命名
- 架构适配性

**不需要手工 review 的内容：**
- 格式化
- import 排序
- lint 违规
- 简单拼写错误

## Review Process

### Phase 1: Context Gathering（2-3 分钟）

1. 读 PR 描述和关联 issue
2. 看 PR 大小（超过 400 行建议拆分）
3. 看 CI / test 状态
4. 理解业务需求
5. 了解相关架构背景

如果存在 plan package 或 `contract.json`，先读取其中的目标、非目标、reviewer 关注边界和验收标准。Review 结论必须覆盖这些边界，不要只从 diff 风格或测试状态推断完成度。

### Phase 2: High-Level Review（5-10 分钟）

1. **Architecture & Design**
   - 解法是否匹配问题？
   - 是否有更简单方案？
   - 是否符合现有模式？
   - 后续能否扩展？

2. **File Organization**
   - 新文件位置是否合理？
   - 组织是否清晰？
   - 是否重复造轮子？

3. **Testing Strategy**
   - 有测试吗？
   - 覆盖到 edge case 吗？
   - 测试是否可读？

### Phase 3: Line-by-Line Review（10-20 分钟）

按文件逐项检查：
- **Logic & Correctness**：边界、空值、并发、off-by-one
- **Security**：输入校验、SQL injection、XSS、敏感数据暴露
- **Performance**：N+1、无谓循环、内存泄漏、阻塞操作
- **Maintainability**：命名、单一职责、注释、magic number

### Phase 4: Summary & Decision（2-3 分钟）

1. 总结关键问题
2. 指出做得好的地方
3. 明确结论：
   - ✅ Approve
   - 💬 Comment
   - 🔄 Request Changes
4. 问题复杂时提出 pairing

Findings must come first and be ordered by severity. Each blocking finding should include a concrete file/line reference, the behavioral risk, and the smallest acceptable fix. Avoid presenting style-only comments as blockers unless they create maintainability or correctness risk.

## Review Techniques

### Technique 1: The Checklist Method

```markdown
## Security Checklist
- [ ] User input validated and sanitized
- [ ] SQL queries use parameterization
- [ ] Authentication/authorization checked
- [ ] Secrets not hardcoded
- [ ] Error messages don't leak info

## Performance Checklist
- [ ] No N+1 queries
- [ ] Database queries indexed
- [ ] Large lists paginated
- [ ] Expensive operations cached
- [ ] No blocking I/O in hot paths

## Testing Checklist
- [ ] Happy path tested
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] Test names are descriptive
- [ ] Tests are deterministic
```

### Technique 2: The Question Approach

与其直接判定，不如用问题引导作者思考：

```markdown
❌ "This will fail if the list is empty."
✅ "What happens if `items` is an empty array?"

❌ "You need error handling here."
✅ "How should this behave if the API call fails?"
```

### Technique 3: Suggest, Don't Command

用协作语言，不用命令口吻。

### Technique 4: Differentiate Severity

建议在评论中标清优先级：
- 🔴 `[blocking]`
- 🟡 `[important]`
- 🟢 `[nit]`
- 💡 `[suggestion]`
- 📚 `[learning]`
- 🎉 `[praise]`

## Language-Specific Patterns

### Python Code Review

重点关注：
- mutable default argument
- `except:` 过宽
- mutable class attribute
- `super().__init__()` 是否遗漏

### TypeScript / JavaScript Code Review

重点关注：
- `any` 滥用
- async error handling
- prop mutation
- 类型定义缺失

## Advanced Review Patterns

### Pattern 1: Architectural Review

对较大变更：
1. 优先 review design doc
2. 拆成多阶段 PR
3. 主动比较替代方案与 trade-off

### Pattern 2: Test Quality Review

优先 review 行为而不是实现细节：
- 测试描述行为而非内部状态
- 名称清晰
- 覆盖 edge case
- 测试互相独立
- 可任意顺序执行

### Pattern 3: Security Review

关注：
- 认证与授权
- 输入校验
- 数据保护
- 常见漏洞（`eval`、secret、CSRF、rate limit）

## Giving Difficult Feedback

### 推荐结构：Context + Specific Issue + Helpful Solution

比传统 praise-sandwich 更自然，也更有效。

### Handling Disagreements

当作者不同意时：
1. 先理解对方思路
2. 承认对方合理点
3. 用数据或 benchmark 说话
4. 必要时升级到 architect / senior dev
5. 不关键的问题要学会放手

## 最佳实践

1. **及时 review**：最好 24 小时内
2. **控制 PR 大小**：200-400 行最容易 review
3. **分时间块 review**：单次不超过 60 分钟
4. **依赖工具**：GitHub / GitLab / review 工具
5. **自动化能自动化的都自动化**
6. **建立关系**：赞赏、同理心、清晰表达都重要
7. **复杂问题愿意配对解决**
8. **多学习别人的 review comment**

## Common Pitfalls

- 完美主义
- 范围蔓延
- 双标
- 延迟 review
- 提完意见就消失
- 形式化 approve
- bike shedding

## Templates

### PR Review Comment Template

```markdown
## Summary
[Brief overview of what was reviewed]

## Strengths
- [What was done well]

## Required Changes
🔴 [Blocking issue 1]

## Suggestions
💡 [Improvement 1]

## Questions
❓ [Clarification needed on X]

## Verdict
✅ Approve after addressing required changes
```

## Resources

- **`references/code-review-best-practices.md`**：完整 review 指南
- **`references/common-bugs-checklist.md`**：各语言常见 bug 清单
- **`references/security-review-guide.md`**：安全 review 清单
- **`assets/pr-review-template.md`**：标准 review comment 模板
- **`assets/review-checklist.md`**：快速 checklist
- **`scripts/pr-analyzer.py`**：分析 PR 复杂度并建议 reviewer
