# Agent-First Import

## 何时使用这条工作流

以下情况适合 agent-first import：

- 仓库里已经有大量项目文档
- 用户明确说知识库缺少背景知识
- 需要把多个来源综合成稳定的项目概览
- 项目需要真正的 overview，而不是空 folder skeleton

## 推荐读取顺序

先只读取信息量最高的来源：

1. 有内容的 `README.md`
2. `plan/` 或 `docs/` 中的设计说明
3. `outputs/analysis/` 下的报告和总结
4. `run/conf/` 中的任务协议和实验假设
5. `src/analysis_module/` 或其他 orchestration code
6. `TODO.md` 或 scratch notes 仅作补充上下文

## Agent 应提取什么

让 agent 产出以下部分：

1. project background 与 research goal
2. core research questions
3. 当前主要 experiment lines
4. 关键结果与结论
5. codebase-to-knowledge-base mapping
6. 推荐创建或更新的 durable notes
7. 适合放进 `00-Hub.md` 的核心内容

## Agent 返回后怎么做

不要把 agent 响应整段贴进 vault。

应当：

- 把综合结果拆成 durable notes
- 保持 one idea per note
- 高层 framing 放入 `Knowledge/`
- experiment logic 放入 `Experiments/`
- findings 放入 `Results/`
- literature-facing 材料放入 `Papers/`

## 反模式

不要把 file path 当成内容语义。

错误示例：

- 自动把每个 `plan/*.md` 一对一映射成新 note
- 仅因为某目录存在，就生成空 note
- 在搞清楚哪些来源最重要之前，就先创建一堆新笔记
