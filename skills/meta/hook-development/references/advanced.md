# 高级 Hook 用法

这份文档收集更复杂的 hook 设计模式，适用于多阶段自动化、跨事件协同和外部系统集成。

## Multi-Stage Validation

把 command hook 和 prompt hook 叠加：
- command hook 先快速放行明显安全的情况
- prompt hook 再分析复杂场景

## Conditional Hook Execution

根据环境或配置决定是否执行：
- 只在 CI 中启用
- 只对非管理员用户启用
- 只在特定项目模式下启用

## Hook Chaining via State

通过临时文件在不同事件间共享状态。

注意：
- 只适合顺序事件间共享
- 不适合并行 hook 之间相互依赖

## Dynamic Hook Configuration

从项目配置读取：
- `strict_mode`
- `allowed_commands`
- `forbidden_paths`

适合做 per-project 或 per-team 的差异化策略。

## Context-Aware Prompt Hooks

prompt hook 可以结合 transcript 和 session context 做判断，例如在 `Stop` 时读取 `$TRANSCRIPT_PATH` 检查：
- 测试是否执行
- build 是否成功
- 用户问题是否都回答完
- 是否还存在未完成工作

## Performance Optimization

### Caching

对重复验证结果做短期缓存，减少重复计算。

### Parallel Execution

由于 hook 默认并行执行，所以设计上要做到：
- 互相独立
- 无共享顺序假设
- 尽量缩短单个 hook 延迟

## Cross-Event Workflows

不同事件可配合：
- `SessionStart` 初始化状态
- `PostToolUse` 记录执行轨迹
- `Stop` 汇总并做最终判定

## Integration with External Systems

hook 可接入：
- Slack 通知
- 数据库日志
- metrics / StatsD

前提是：
- 不泄露敏感信息
- 失败时能优雅降级
- 不让 hook 成为主流程阻塞点

## Security Patterns

常见高级安全模式：
- rate limiting
- audit logging
- secret detection

## Testing Advanced Hooks

建议至少覆盖：
- 单元级脚本测试
- 集成级事件链测试
- 异常输入测试
- timeout 和错误输出测试

## 最佳实践

1. hook 之间保持独立
2. 每个 hook 都设置 timeout
3. 提供清晰错误信息
4. 在 README 记录复杂行为
5. 监控性能
6. 为需要绕过的场景提供 escape hatch

## Common Pitfalls

- 假设 hook 有固定执行顺序
- 写长时间运行 hook
- 不处理异常输入
- 让外部依赖失败直接拖垮整条工作流
