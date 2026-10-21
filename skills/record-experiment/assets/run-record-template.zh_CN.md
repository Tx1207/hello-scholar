---
schema: 2
kind: record
run_id: <run-id>
title: <用户可读标题>
status: planned
entry: <入口脚本或命令>
derived_from: null
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <条件与当前已知事实>
---

# <用户可读标题>

## 1. 当前发现与解释

<先讲真实结果及其支持的判断。计划或运行中时，说明结果尚未产生或只有部分结果。说明决定性证据、比较限制，以及已真实作出的决定或下一个未决选择。>

## 2. 问题与比较

<说明问题；已有归属 Spec 时引用它。解释相对基线改变了什么、哪些控制条件使结果可以解释，以及什么结果算支持、负面或不足以判断。>

- 派生自:
- 与该 Run 的差异:
- 复用的产物:

## 3. 执行信息

- 精确命令:
- 工作目录:
- 配置与 CLI 覆盖参数:
- 随机种子:
- 数据版本 / 划分:
- 输入产物:
- Model / checkpoint:
- 代码版本（Git 提交与工作区状态，或快照路径）:
- 机器 / GPU / 环境:
- 预期信号:
- 失败信号:
- 停止规则:

## 4. 产物位置

- stdout:
- stderr:
- 结果:
- Checkpoint（产物根目录下的实际路径）:
- 退出码 / signal:
- Dashboard / tracking URL:

## 5. 重要执行事件

<记录影响解释或恢复的变化：真实启动、配置偏差、故障、中断和完成。没有重要变化的重复轮询不需要事件。>

| 时间 | 事件 | 观察 | 处理 |
|---|---|---|---|
