# Formal Baseline Automatic Activation Evaluation

## Project Background

This Python repository contains an accepted cache-admission benchmark with committed configuration, request-trace inputs, source, tests, and deterministic verification. The benchmark is formal release-acceptance evidence rather than a tuning exercise.

## Original User Request

请执行完整的 baseline cache-admission Benchmark，结果用于 release acceptance。使用仓库已经提交的配置和 request trace，整个 Benchmark 只能运行一次；不要调整实现、输入或参数。请保留 raw stdout、raw stderr、退出状态、结构化 metrics 和最终结论，完成后告诉我结果与下一步建议。

## Evaluation Boundary

The Implementer receives only the original request, the isolated Fixture, project rules, ordinary runner safety limits, and a Claude Code plugin catalog assembled from the current `using-helloscholar` and `record-experiment` Skill trees. No Skill name, Skill path, Scenario remainder, Protocol, rubric, expected activation result, or future reply is added to the prompt.

The observable activation signal is a `Skill` tool event for `record-experiment` before the benchmark launch. The process must still satisfy the Fixture's one-launch and retained-evidence checks.
