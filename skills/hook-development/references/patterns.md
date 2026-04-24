# 常见 Hook 模式

这份参考文档收集了 Claude Code hook 的常见实现模式，可作为典型场景的起点。

## Pattern 1: Security Validation

用 prompt-based hook 阻止危险文件写入。

## Pattern 2: Test Enforcement

在 `Stop` 阶段检查代码改动后是否已执行测试。

## Pattern 3: Context Loading

在 `SessionStart` 阶段加载项目上下文，例如识别项目类型并写入 `$CLAUDE_ENV_FILE`。

## Pattern 4: Notification Logging

记录通知事件，便于审计或外部集成。

## Pattern 5: MCP Tool Monitoring

对高风险 MCP tool（如 delete 类）做额外确认。

## Pattern 6: Build Verification

在结束前确认项目 build 通过。

## Pattern 7: Permission Confirmation

对 `rm`、`drop` 等破坏性 Bash 操作要求用户确认。

## Pattern 8: Code Quality Checks

在 `PostToolUse` 中对改动文件自动跑 linter / formatter / quality check。

## Pattern 9: Temporarily Active Hooks

通过 flag file 控制 hook 是否启用，适合临时检查、调试和高成本校验。

## Pattern 10: Configuration-Driven Hooks

从项目配置文件中读取 `strictMode`、路径白名单、大小限制等规则，动态调整 hook 行为。

## Pattern Combinations

可以把以下类型组合起来形成多层防护：
- `PreToolUse` 做输入或命令校验
- `Stop` 做完成度校验
- `SessionStart` 做上下文初始化

**原则：**
- 各 hook 尽量独立
- 不依赖执行顺序
- 简单、快速的检查优先交给 command hook
- 复杂判断优先交给 prompt hook
