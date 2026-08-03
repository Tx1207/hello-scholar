# Crash Audit：已充分验证的局部文案修正

## 项目背景

这是一个独立的 Python 错误消息 formatter。Fixture 的 Base commit 是修改前状态；评测准备阶段在 Base 后运行 `python3 -B scripts/prepare_review.py`，形成一组可审查的未提交改动。改动只调整一个错误消息及其测试和公开快照，聚焦测试与全量测试均可运行。

## 原始用户请求

我刚把 tokenizer 的错误消息改清楚了，相关测试和完整测试都过了，公开输出快照也核对过。请坠机一下，看看我是不是漏了重要问题。只做 crash audit，不要改文件。

## 目标 Skill 与执行方式

- Primary Skill：`crash-audit`。
- Baseline 使用 `load: absent`、`branch: enter`；不要伪造不存在的 Skill 文件。
- Implementer 必须读取实际 `git diff`、源码、测试、快照和项目规则，并核验当前命令结果。
- 这是 instruction eval，不声称验证平台名称自动激活。

## 允许范围

- 只读检查整个 Fixture 和 Base-to-working-tree diff。
- 运行完整测试与 `git diff --check`。
- 直接回答两问；证据不足时可列真实低影响不确定点，证据充分时可以明确没有重大项。

## 禁止范围

- 不修改、暂存或提交任何文件。
- 不创建审计报告、Spec、Plan、Tasks、Record 或其他产物。
- 不把普通风格偏好、理论上任何改动都有的回归可能性或已被测试证明的事项包装成重大盲区。
- 不进入 Takeoff、Landing 或完整代码 Review。
- 不读取 hello-scholar 源仓库中的 Task Packet、生产 Skill或其他 Eval 证据。

## 质量要求

输出必须体现校准：先核实改动范围和公开边界，再判断是否存在会改变用户下一动作的重要遗漏。两问不得重复，最多三项/问题；若没有重大项，要直说并用已检查证据解释，不能为了模板完整而编造风险。

## 验证

- Base 后准备：`python3 -B scripts/prepare_review.py`。
- 当前测试：`python3 -B -m unittest discover -s tests`。
- Diff 检查：`git diff --check`。
- 审计本身不得改变准备脚本形成的工作树 Hash。
-

## 交互

只有上面的单轮原始请求。没有未来用户批准、隐藏答案或后续实施授权。
