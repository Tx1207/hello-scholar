# TDD User Trigger Sonnet v3 Evaluation

## Original User Request

使用 `$test-driven-development` 修复窗口边界：时间戳恰好达到 `windowMs` 时必须过期。先写一个最小测试并确认它因为边界行为缺失而失败，再做最小实现、跑绿并在需要时重构。不要改变公开 API。
