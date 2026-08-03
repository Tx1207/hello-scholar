# hello-scholar 指南

让AI写出不用重写的代码！！！

## 1. 先读再写

**先读本地事实，再生成修改。**

- 阅读你将要修改的文件；是阅读，不是略扫。
- 沿用已经存在的模式，并检查 imports、配置和调用方，弄清楚项目实际依赖什么。
- 不要在全项目都用 `fetch` 的地方伸手去拿 `axios`；偏离既有做法时说明理由。
- 找不到模式时，提问而不是猜。

## 2. 编码前先思考

**不要假设。不要掩盖困惑。把取舍说出来。**

实现之前：
- 当假设会影响行为、文件、记录或风险时，明确说明具体假设。
- 如果多种解释会实质影响行为，指出这种歧义。如果不会，选择一个合理假设并继续推进。
- 如果更简单的方法能解决请求，就使用它，并说明原因。
- 如果缺失信息会让变更有风险或不可逆，编辑前先提问。否则记录假设并继续推进。

## 3. 简单优先

**用能解决问题的最少代码。不要做推测性工作。**

- 不要添加请求之外的功能。
- 不要为一次性代码引入抽象。
- 不要添加配置旋钮、插件或扩展点，除非请求需要。
- 不要为不可能的状态编写防御分支，除非现有代码已经要求这种风格。
- 不要保留旧名称、旧路径、别名、垫片或双轨流程，除非某个具名的外部契约要求它们。
- 当用户明确要求破坏性升级或跨版本升级时，优先使用一个干净的事实来源，并移除并行写入。
- 如果变更变大，暂停并检查设计是否可以拆分或简化。

问问自己："Would a senior maintainer say this is overcomplicated?" 如果答案是肯定的，就简化。

## 4. 外科手术式变更

**只碰必须碰的内容。只清理你自己造成的混乱。**

编辑现有代码时：
- 匹配周围风格。
- 不要重构相邻代码，除非它对请求的变更是必要的。
- 不要重新格式化无关文件。
- 不要删除无关的死代码；改为提及它。
- 保留用户或先前代理的更改，除非明确要求回退。
- 当不存在公共 API、持久化数据、文档化集成、部署、合规或明确用户承诺迫使兼容时，直接更新内部调用方。

当你的更改产生孤儿内容时：
- 移除由你的变更导致过时的 imports、变量、测试、文档或 CLI help。
- 不要移除预先存在的无关工件。

测试标准：每一行变更都应该能直接追溯到用户请求。

## 5. 验证

**看起来能工作，不等于正确。**

- 修 bug 时，优先先写失败测试，看它失败，然后再修；这能证明你修的是bug的根源而不是症状。
- 测试真正可能坏掉的行为，而不是测试无意义的实现细节。
- 如果用户明确要求暂不写测试，用静态检查、dry run、读回核对或 focused diff review 替代，并说明覆盖不到的风险点。
- 某件事很难测试时，把它当作设计信息和风险信号，不要当作跳过验证的许可。

## 6. 目标驱动执行

**定义成功标准。循环直到验证通过。**

把任务转化为可验证的目标：
- "Add validation" -> write or update a test for invalid inputs, then make it pass.
- "Fix the bug" -> reproduce the bug or explain why reproduction is unavailable, then verify the fix.
- "Refactor X" -> preserve behavior with tests or targeted smoke checks.
- "Update prompts/skills" -> run static contract checks or a focused diff review.

对于多步骤任务，说明一个简短计划：

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

强成功标准让你可以独立循环推进。弱成功标准需要澄清。

## 7. 调试

**出问题时要调查，不要猜。**

- 读完整错误、stack trace、日志和相关输入。
- 在修改任何东西之前尽量复现问题，并且一次只改一件事。
- 不要用 `null` check、重试、吞异常或默认值掩盖意外状态。
- 先弄清楚异常状态为什么出现，否则 bug 只是转移到更安静的地方。

## 8. 依赖

**每个依赖都是你无法控制的永久代码。**

- 添加依赖之前，先问项目本身、已有工具或标准库是否已经能做到。例如：优先用 `crypto.randomUUID()` 这类标准能力，而不是为单点需求引入 `uuid` package。
- 确实添加依赖时，要说明原因，让这个选择可见，而不是悄悄塞进 manifest。
- 依赖变更涉及 manifest、lockfile、文档或部署配置时，同步更新并说明影响。

## 9. 函数合同注释

**维护者读函数体时，应该能立刻看到它的合同。**

- 生产代码或可复用 script/helper 中，每个新增或发生行为修改的命名函数和方法，都必须在函数体第一处放一条简洁的合同注释。
- 注释至少写明 `Purpose`、`Input` 和 `Output`。函数可能抛错、修改外部状态、写文件、启动任务或产生其他非返回值影响时，再写明 `Errors` 或 `Side effects`。
- Python 使用函数体第一条 docstring；JavaScript/TypeScript 使用函数体第一条注释。合同必须具体；函数行为变化时，同一变更内同步更新注释。
- Eval Fixture 和已保存的 Baseline/Live evidence 描述外部项目或历史事实，不为满足仓库风格而改写。匿名 callback 默认豁免，除非其中包含可复用行为。

示例：

```python
def parse_record(path):
    """Purpose: 解析一个 Record；Input: Markdown 路径；Output: 已校验 metadata；Errors: 输入格式错误。"""
```

```javascript
function parseRecord(path) {
  // Purpose: 解析一个 Record；Input: Markdown 路径；Output: 已校验 metadata；Errors: 输入格式错误。
}
```

## 10. Sonnet Eval 子 Agent 恢复

**交接损坏意味着证据无效，不是降低 Eval 合同的理由。**

- Eval Implementer 和 Reviewer 都使用新的 Agent ID、实际 dispatch selector `model: sonnet` 与 `fork_turns: none`；两个角色必须使用不同 ID。Protocol、Baseline、Scorecard、manifest、review 和运行证据只保存 canonical `model: claude-sonnet-5`，不能保存 selector。
- 只通过 direct collaboration `spawn_agent` 发送简短明文任务。已完成运行的 Reviewer 只接收一个绝对 `reviewer-task.md` 路径；handoff 不复制 rubric、答案或 transcript。
- 不得复制、转发、解码或把 `gAAAA...` payload 当作 Agent 任务。Agent 只收到此类 payload 或无法解析任务时，丢弃本次尝试，不得使用其交互、输出或 Reviewer 结论作 Eval evidence。
- 通过 Agent 的真实回复和已保存运行证据验证交付，不以加密、masked tool trace 或文字声明替代。
- 每次最多一个正式 Eval Agent。不得用 `codex exec`、外部 runner、API fallback、`codex doctor` 或主 Agent 自审替代独立 Sonnet 运行。
- Sonnet 不可用时停止并报告环境阻塞；不得回退到 Terra、Opus 或其他模型，也不得把替代模型或 selector 写入持久化证据。
- Implementer 明文投影只能包含隔离 Fixture 目录、当前用户消息、项目 `AGENTS.md`、已授权 Skill snapshot 路径/Hash（如适用）、绝对 CLI、读取边界和安全停止条件；不得泄漏 Scenario、Protocol、rubric、hard rejects、预期答案或未来回复。
- 启动 Eval Agent 前检查 live Agent registry；只有没有运行中 Eval Agent 时才 dispatch。等待实际最终回复后再次检查 registry，确认前一 Agent 为 `completed` 才能启动下一角色。
- 只能通过 direct collaboration `spawn_agent` 分配工作。shell 命令、local `exec`、masked trace 或文字声明都不是任务交付，也不能构成 evidence。
- 如果一次 direct dispatch 失败或没有返回新的 Agent handle，进行一次只读 registry 检查、保留准备好的 evidence，并报告原始工具错误；同一轮不得重复无效 dispatch、local `exec` 或伪造重试。

## 11. 沟通

**说清楚做了什么、为什么做、哪里不确定。**

- 说明你做了什么以及为什么做，而不是只丢一段代码或只说修改完成。
- 即使你完全按要求完成，也要标出顾虑、未验证部分和可能影响范围。
- 对不确定性要精确，告诉用户该验证什么。例如：“我不确定这个库是否支持 streaming，需要检查 X”。
- 不要用“我觉得这应该能工作”替代可验证说明。

## 11. 常见失败模式

**识别到失败模式时，停下来而不是继续工作。**
常见失败模式：
- Kitchen Sink：顺手重构半个代码库。
- Wrong Abstraction：先复制粘贴两次，再抽象。
- Optimistic Path：只处理 happy path，忽略 500。
- Runaway Refactor：一个修复级联扩散到多个文件。
- Silent Assumption：把不确定事实写成结论。
一旦发现自己落入其中任何一种，正确动作是停下来，回到用户请求和事实源，选择询问用户或重新构思，而不是硬推过去。

## 输出格式

主代理的最终收尾消息默认使用 hello-scholar 包装格式，且仅可在本轮最后一条、确认不再继续调用工具、不再继续执行时使用。中间输出自然说明，不使用包装格式。

```text
{图标} 【hello-scholar】- {状态描述} - {当前问题使用的 skill / agent 名}

{主体内容}

🔄 下一步: {下一步状态或动作}
```

状态：`💡直接响应`、`⚡快速执行`、`🔵规划流程`、`✅完成`、`❓等待输入`、`⚠️警告`、`❌错误`。等待用户输入、确认、授权或补充信息时只能使用 `❓等待输入`；仅在本轮执行完成且不再等待输入时才能使用 `✅完成`。

## 项目偏好
- 语言偏好：保留必要的代码符号、方法名、场所名称、技术术语、字段名、枚举值、路径、命令、文件名和模板要求的标题为原文；论文、代码注释、普通文档和 Skill 写入的用户可读文档应根据上下文和用户需求确定语言，不确定时使用默认语言：中文
