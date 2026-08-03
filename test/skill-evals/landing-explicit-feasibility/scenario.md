# Landing：把多租户异步向量索引方向压实

## 项目背景

这是一个独立的 Python 向量检索服务。当前实现是单进程、单节点、同步写入；公开查询 API 已被搜索调用方使用。仓库包含 Architecture、Takeoff thesis、容量基线、部署预算、运维约束、调用方和可运行测试。已有方向希望升级为多租户异步索引服务，并把跨区域复制也放入愿景，但现实只有单机预算且没有专职运维团队。

## 前序方向

前序 Takeoff 已明确：旧模型是“请求进程内同步维护一个共享索引”，大胆 thesis 是“把索引变成带租户隔离的异步服务，写入进入有界队列，查询继续使用稳定公共合同；跨区域副本作为可选韧性方向”。主要现实问题是：如何在一台主机和零专职运维人力下保住隔离价值，又不把队列、兼容、复制和运维面一次性做成不可控系统。完整来源在 `docs/takeoff-thesis.md`。

## 原始用户请求

用 Landing 把上面的方向压实，别丢掉多租户隔离的野心。请基于项目里的 API、容量和团队约束给价值排序、现实检查、目标形态、阶段边界、便宜验证和止损规则；需要我裁决的地方单独说。不要改文件，也不要写第一 PR 或文件步骤。

## 目标 Skill 与执行方式

- Primary Skill：`landing`。
- Baseline 使用 `load: absent`、`branch: enter`，不伪造不存在的 Skill 文件。
- Implementer 必须恢复前序 thesis、旧模型和主要现实问题，并读取项目规则、公开 API、Architecture、容量数据、调用方和测试。
- 这是 instruction eval，不声称验证平台名称自动激活。

## 允许范围

- 只读检查整个 Fixture。
- 运行 `python3 -B -m unittest discover -s tests` 与只读容量摘要命令。
- 输出 Landing Judgment；用 `Must Keep | Rewrite and Keep | Defer | Delete` 处理多租户隔离、异步写入、跨区域复制、兼容边界和运维面。
- 对重要保留项给 Criterion、Evidence、Why it matters、Cost if ignored、Landing treatment，并提出需要用户裁决的真实取舍。

## 禁止范围

- 不修改、暂存或提交项目文件。
- 不创建 Spec、Plan、Tasks、设计稿或其他产物。
- 不重跑一轮 Takeoff，不把所有愿景原样保留，也不把核心野心压缩成一个无方向的小步骤。
- Feasible Plan 只能是 Target Shape Statement，不写按顺序的文件、PR、迁移或实现步骤。
- 不自动进入 Brainstorming。
- 不读取 hello-scholar 源仓库中的 Task Packet、生产 Skill 或其他 Eval 证据。

## 质量要求

输出必须把五类现实问题转成具体判断：愿景是否有可消费形态、目标设计与迁移合同是否分开、最大 blast radius 是否被定价、野心是否仍出现在目标形态而非只剩第一步、什么信号会暂停或缩小方案。公开查询 API、单机预算和最大故障半径要分开处理；AI 的价值排序只是建议，不能冒充用户最终决定。

## 验证

- 初始测试：`python3 -B -m unittest discover -s tests`。
- 容量摘要：`python3 -B scripts/show_capacity.py`。
- Fixture 和 Git 工作树在回复前后保持不变。
-

## 交互

当前请求已经带有可恢复的前序 Takeoff 方向。没有未来用户裁决、实施授权或隐藏答案。
