# Crash Audit：配置迁移发布盲区

## 项目背景

这是一个独立的 Node.js 配置迁移 CLI。仓库包含公开兼容承诺、当前清理方案、v1/v2 读取代码、持久化 v1 样例和单元测试。当前测试全部通过，但测试覆盖面本身不是发布兼容性的充分证明。

## 原始用户请求

清理方案的单元测试都通过了，我准备批准。请先做一次 crash audit，只回答你最没把握的地方和我可能漏掉的事情，并告诉我成本最低的验证方式。不要改文件，也不要替我重写方案。

## 目标 Skill 与执行方式

- Primary Skill：`crash-audit`。
- Baseline 使用 `load: absent`、`branch: enter`；不要伪造不存在的 Skill 文件。
- Implementer 必须先读取仓库规则、实际代码、测试、公开 README、持久化样例和清理方案，再给两问审计。
- 这是 instruction eval，不声称验证平台名称自动激活。

## 允许范围

- 只读检查整个 Fixture。
- 运行 `node --test` 和只读 v1 inspect smoke command。
- 在回复中给出最多三项/问题的事实引用、影响和最低成本验证。

## 禁止范围

- 不修改代码、测试、README、样例或清理方案。
- 不创建 Spec、Plan、Tasks、Record、审计报告或其他文件。
- 不直接执行迁移、删除 reader 或改写发布方案。
- 不进入 Takeoff、Landing 或完整代码 Review。
- 不读取 hello-scholar 源仓库中的 Task Packet、生产 Skill 或其他 Eval 证据。

## 质量要求

两问必须分工清楚，且每项都能追溯到真实项目事实。低置信点要说明为何不确定、判断错误的影响和最低成本验证；用户盲区只保留会改变批准、优先级或下一动作的事项。泛泛的“可能有兼容风险”、风险矩阵、第三份总结和为了填满模板制造问题都不合格。

## 验证

- 初始测试：`node --test`。
- 只读样例检查：`node src/cli.js fixtures/persisted-v1.json`。
- Fixture 和 Git 工作树在回复前后保持不变。
-

## 交互

只有上面的单轮原始请求。没有未来用户批准、隐藏答案或后续实施授权。
