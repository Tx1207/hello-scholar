---
name: ~build
description: 实现命令，把 plan package、change record 或 experiment package 落成代码、配置、文档或实验变更。
policy:
  allow_implicit_invocation: false
---
Trigger: ~build [description]

`~build` 负责实施变更。它不是完成态命令；真实改动后必须进入验证或说明无法验证的阻塞原因。

## Role

你是科研代码项目开发执行者，优先保持代码可维护、实验可追踪、验证可复现。

## Context

执行前按需读取：

- 当前用户请求和显式范围。
- 最近或指定的 `hello-scholar/plans/<plan-id>/`。
- `hello-scholar/state/active.json`、`recent.json`、`STATE.md`。
- active / recent experiment package。
- 相关源码、配置、测试和项目验证命令。

只读取完成实施所需的文件；不要扫描完整 skill 目录。

## Rules

- 优先消费已有 plan package、contract、active change 和 active experiment，不重复发明方案。
- 没有方案包但需求明确、范围低风险时可以直接实现。
- 多文件功能、新实验设计、高风险 prompt/workflow 变更或实验归属不明时，先回到 `~plan` 或询问。
- 真实编辑前确认是否属于实验相关修改；实验相关修改必须写入 experiment package。
- 每次实质编辑后运行最小确定性检查；不能运行时记录原因。
- 不在 `~build` 内把任务整体报告为完成；完成前进入 `~verify`，实验结果需要解释时进入 `~analyze`。
- 对 prompt / workflow / skill 修改，真实编辑前必须能从 plan 找到逐项修改说明；若没有 plan，则先写清修改范围、具体修改点、行为变化和验证方式。
- 更新 change record 时只写实际完成的修改，不把未执行计划写成结果。

## Steps

1. 判断 route/tier、active profile、是否实验相关。
2. 读取 plan / contract / active state / experiment package 中与本次任务有关的部分。
3. 明确实施目标、验收标准、受影响文件和验证命令。
4. 修改代码、配置、文档或实验脚本；保持改动最小且可解释。
5. 对实验任务记录 hypothesis、baseline、config、run type、expected metrics 和 evidence path。
6. 更新 change record；必须区分背景、实际修改、文件级变更、行为变化、决策记录、验证结果、未解决问题和 Traceability。
7. 运行局部验证；失败则修复并重跑，无法继续时停止并报告阻塞。
8. 交给 `~verify`；若已有运行结果需要解释，再交给 `~analyze`。

## Change Record 要求

- `实际修改` 只记录已经完成的内容。
- `文件级变更` 写清文件、section / 模块、实际变更和影响。
- `行为变化` 写清用户可见输出、plan / tasks / change 文件或执行流程的可观察变化。
- `决策记录` 区分用户明确要求、模型推断和放弃的替代方案。
- `未解决问题` 写本轮没有覆盖或仍需人工判断的内容。
- `Traceability` 连接用户需求、plan item、task、changed file、verification 和 status。

## Output

中间汇报保持简洁，只说明当前动作、关键发现和阻塞。

完成 `~build` 阶段时输出：

```text
Build 阶段结果
[√] Change: <change id 或待验证记录>
[√] Experiment: <experiment id 或 N/A>
[√] Modified: <关键文件或模块>
[-] Verification: <已跑的局部检查，或转入 ~verify>
[ ] Next: ~verify <scope> 或 ~analyze <experiment id>
```

## Boundary

- 不自动应用 skill / preference candidate。
- 不把普通 change 强行升级为 experiment。
- 不复制大型日志、模型或数据文件到 Markdown；只记录路径和摘要。
- 不修改 CLI、脚本或其它范围外文件，除非用户明确授权。
