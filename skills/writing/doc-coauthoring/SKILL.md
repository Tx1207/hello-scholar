---
name: doc-coauthoring
description: 当用户要求协作文档、起草 proposal、编写 technical spec、创建 decision doc 或 RFC，或希望通过迭代合作来组织一份较大文档时使用。
version: 0.1.0
---

# Doc Co-Authoring Workflow

本 skill 提供一套结构化协作文档工作流。作为主动引导者，带用户经历三个阶段：Context Gathering、Refinement & Structure、Reader Testing。

## Runtime contract

在提出 connector、artifact 或 reader-test subagent 方案前，先阅读 `references/RUNTIME-MATRIX.md`，判断当前环境真正可用的能力。

如果没有 artifact 这一类工作面，默认回退到用户指定路径中的普通 Markdown 文件，或一个明确命名的工作文件。不要假定 artifact 一定可用。

## When to Offer This Workflow

**触发条件：**
- 用户提到写文档，如 “write a doc”“draft a proposal”“create a spec”“write up”
- 用户提到特定文档类型，如 “PRD”“design doc”“decision doc”“RFC”
- 用户显然在启动一项较大的写作任务

**初始引导：**
向用户提供这套结构化协作流程，并简要说明三个阶段：

1. **Context Gathering**：用户提供上下文，Claude 通过追问补全信息
2. **Refinement & Structure**：逐节头脑风暴、筛选和改写
3. **Reader Testing**：用一个没有上下文的全新 Claude 测试文档，提前暴露盲点

说明这种方式的目标是让文档对“真正的读者”也同样有效，包括把文档贴进 Claude 的读者。再询问用户要不要采用这套流程，还是自由写作。

如果用户拒绝，就用 freeform 方式工作；如果接受，就进入 Stage 1。

## Baseline Writing Standards

Before drafting, identify the audience, purpose, and what the reader should be able to do after reading. Prefer conclusion-first structure, one core idea per paragraph, clear heading hierarchy, and concrete claims over vague phrasing.

Use active voice where possible. Keep sentences short enough to parse, explain technical terms on first use, label code fences with languages, and preserve necessary caveats, constraints, and risks instead of over-compressing them away.

Delivery checklist:
- Structure is easy to navigate for the intended reader
- Key claims use concrete evidence, examples, numbers, or named constraints
- Formatting is consistent, including headings, tables, lists, and code blocks
- Technical depth matches the target audience

## Stage 1: Context Gathering

**目标：** 缩小“用户知道什么”和“Claude 知道什么”之间的差距，为后续高质量引导建立上下文。

### Initial Questions

先询问文档的 meta-context：

1. 这是什么类型的文档？（例如 technical spec、decision doc、proposal）
2. 主要读者是谁？
3. 希望读者读完后产生什么影响？
4. 是否需要遵循某个模板或固定格式？
5. 还有哪些约束或背景需要知道？

告诉用户可以简答，也可以直接把信息整段倒出来。

**如果用户提供模板或提到文档类型：**
- 询问是否有模板文档可供参考
- 如果给了共享文档链接，使用合适的集成读取
- 如果给了本地文件，就直接读取

**如果用户说要修改已有共享文档：**
- 用合适的集成读取当前内容
- 检查是否存在没有 alt-text 的图片
- 若存在缺少 alt-text 的图片，应说明：别人用 Claude 理解文档时，看不到这些图。询问是否需要生成 alt-text；如果需要，请用户把图片贴进聊天中以便生成描述

### Info Dumping

初始问题回答后，鼓励用户把上下文一次性倾倒出来。重点信息包括：
- 项目 / 问题背景
- 相关团队讨论或共享文档
- 为什么不采用其他方案
- 组织背景（团队协作、历史事故、政治因素）
- 时间压力和约束
- 技术架构和依赖
- stakeholder 关切

告诉用户不必提前整理结构，先把材料倒出来即可。支持多种提供方式：
- 自由信息倾倒
- 指向团队频道或讨论串
- 提供共享文档链接

**如果有可用集成**（如 Slack、Teams、Google Drive、SharePoint 或其他 MCP server），可以说明这些内容可直接拉取。

**如果没有集成，且位于 Claude.ai / Claude app：** 建议用户在 Claude 设置里启用 connector，以便直接拉取聊天记录和文档存储内容。

告诉用户，在完成首轮信息倾倒后会继续追问澄清问题。

**在收集上下文时：**

- 如果用户提到团队频道或共享文档：
  - 如果集成可用：告知将读取这些内容，然后执行读取
  - 如果集成不可用：明确说明无法直接访问，并建议启用 connector 或直接粘贴关键内容

- 如果用户提到未知的实体 / 项目：
  - 询问是否要通过已连接工具进一步搜索了解
  - 在得到确认前不要擅自搜索

- 随着上下文逐步输入，持续跟踪：已经明确了什么、仍然模糊什么

**如何追问：**

当用户表示首轮信息已经给完，或上下文已经比较充分时，基于现有空白提出 5-10 个编号澄清问题。

告诉用户可以用非常简短的方式回答，例如：
- `1: yes`
- `2: see #channel`
- `3: no because backwards compat`

也可以继续给文档链接、频道路径，或者继续信息倾倒，以最高效率为准。

**退出条件：**
当已经能直接讨论 edge case 和 trade-off，而不再需要补基础背景时，说明上下文已足够。

**阶段切换：**
询问用户此阶段是否还有要补充的背景，还是可以进入文档起草。

如果用户还想继续补充，就继续；准备好后进入 Stage 2。

## Stage 2: Refinement & Structure

**目标：** 通过头脑风暴、筛选和迭代精修，按章节逐步写出文档。

**对用户的说明：**
文档会按 section 逐块构建。每个 section 的流程：
1. 先追问这一节应包含什么
2. 头脑风暴 5-20 个可写点
3. 由用户决定保留 / 删除 / 合并
4. 起草这一节
5. 通过精确编辑继续打磨

优先从未知数最多的部分开始。对 decision doc，通常是核心 proposal；对 spec，通常是 technical approach。summary 一类内容适合最后写。

### Section ordering

如果文档结构已经明确：
- 询问用户想从哪个 section 开始
- 建议优先从未知数最多的那一节着手

如果用户还不知道需要哪些 section：
- 根据文档类型和模板，先建议 3-5 个合适 section
- 询问这个结构是否可行，是否需要调整

**一旦结构达成一致：**

先创建带占位符的初始文档结构。

**如果 artifact 可用：**
- 使用 `create_file` 创建 artifact，作为双方共同工作的骨架
- 告知用户将创建带所有 section 标题与占位文本的初稿
- 提供 artifact 链接，并说明接下来逐节填充

**如果 artifact 不可用：**
- 在工作目录中创建 Markdown 文件，例如 `decision-doc.md`、`technical-spec.md`
- 告知用户将创建带占位符的初始结构
- 确认文件名后，开始逐节填充

### For each section

#### Step 1: Clarifying Questions

宣布开始处理 `[SECTION NAME]`，围绕这一节应包含的内容提出 5-10 个具体问题。

告诉用户可以简答，也可以只指出哪些点最重要。

#### Step 2: Brainstorming

针对 `[SECTION NAME]` 头脑风暴 5-20 个可纳入内容，复杂度越高，选项数越多。重点寻找：
- 用户已经说过但可能会被遗漏的上下文
- 目前尚未提及的角度或考虑点

给出编号列表，并在末尾说明：如果需要，还可以继续扩展更多选项。

#### Step 3: Curation

让用户指出哪些点应该保留、删除或合并，并尽量给出简短原因，方便后续章节学习他们的偏好。

示例：
- `Keep 1,4,7,9`
- `Remove 3 (duplicates 1)`
- `Remove 6 (audience already knows this)`
- `Combine 11 and 12`

**如果用户给的是自由反馈**，而不是编号选择，也要主动提取他们的偏好并继续推进。

#### Step 4: Gap Check

根据已选内容，追问这一节是否还有重要遗漏。

#### Step 5: Drafting

使用 `str_replace` 把这一节的占位符替换为正式草稿。

告知用户：将根据刚才选定的内容起草 `[SECTION NAME]`。

**如果使用 artifact：**
- 起草后给出 artifact 链接
- 请用户通读这一节，并指出想修改的部分
- 提醒他们：越具体的反馈，越有助于后续章节保持风格一致

**如果使用普通文件：**
- 确认这一节已写入 `[filename]`
- 请用户阅读后指出修改点

**在第一次起草时要额外提醒：**
尽量不要直接改文档，而是描述想怎么改，这样更容易学习他们的风格，例如：
- “删掉 X bullet，Y 已经覆盖了”
- “第三段更精炼一点”

#### Step 6: Iterative Refinement

用户给反馈后：
- 用 `str_replace` 直接编辑，不要整篇重打
- 如果是 artifact，每次改完都给链接
- 如果是普通文件，只需确认已更新
- 如果用户自己改了文档并让你重读，要主动记住他们的修改风格，并在后续章节沿用

**持续迭代**，直到用户满意。

### Quality Checking

如果连续 3 轮都没有实质修改，询问是否还有内容可以删掉而不损失信息。

当某一节完成后，确认 `[SECTION NAME]` 已完成，再问是否进入下一节。

对所有 section 重复这一流程。

### Near Completion

当文档完成度超过 80% 时，主动重读整篇文档，并检查：
- section 之间的流动和一致性
- 冗余或冲突
- 是否有明显的 “slop” 或空洞套话
- 是否每一句都在承担信息作用

读完整篇后给出反馈。

**当所有章节都已完成：**
说明整篇文档已写完，并将再做一次整体审阅，检查 coherence、flow 和 completeness。

给出最终建议后，询问用户是进入 Reader Testing，还是还要继续精修。

## Stage 3: Reader Testing

**目标：** 用一个没有上下文污染的全新 Claude 验证文档对真实读者是否有效。

**对用户的说明：**
Reader Testing 的目的是发现作者视角看不出来的盲点，也就是“作者觉得理所当然，但读者并不懂”的地方。

### Testing Approach

**如果可用 sub-agent**（例如 Claude Code 场景）：

直接执行测试，无需用户手工参与。

#### Step 1: Predict Reader Questions

宣布将先预测真实读者在发现这份文档时会问什么。

给出 5-10 个真实问题。

#### Step 2: Test with Sub-Agent

说明将用一个“没有本对话上下文”的全新 Claude 实例来测试这些问题。

对每个问题，都调用 sub-agent，仅传入文档内容和该问题。

总结 Reader Claude 在每个问题上答对了什么、答错了什么。

#### Step 3: Run Additional Checks

继续调用 sub-agent 检查：
- 歧义
- 错误前提
- 自相矛盾

汇总发现的问题。

#### Step 4: Report and Fix

如果发现问题：
- 明确指出 Reader Claude 卡住的点
- 列出具体问题
- 说明接下来将回到对应 section 进行修补

---

**如果没有 sub-agent**（如 claude.ai web 界面）：

让用户手动完成测试。

#### Step 1: Predict Reader Questions

询问：别人如果在 Claude.ai 中尝试理解这份文档，会问什么问题？

据此生成 5-10 个读者问题。

#### Step 2: Setup Testing

给出操作说明：
1. 打开新的 Claude 会话：`https://claude.ai`
2. 粘贴或分享文档内容（如果是支持 connector 的共享文档，可直接给链接）
3. 用上面生成的问题询问 Reader Claude

每个问题都要求 Reader Claude 返回：
- 答案
- 哪些地方含糊或不清楚
- 文档默认假设读者已经知道哪些背景

检查 Reader Claude 是否答对，或者是否出现误解。

#### Step 3: Additional Checks

还要额外问 Reader Claude：
- “What in this doc might be ambiguous or unclear to readers?”
- “What knowledge or context does this doc assume readers already have?”
- “Are there any internal contradictions or inconsistencies?”

#### Step 4: Iterate Based on Results

询问 Reader Claude 卡住了什么，或答错了什么，然后回到对应章节修补。

---

### Exit Condition

当 Reader Claude 能持续正确回答问题，且不再暴露新的 gap 或歧义时，说明文档已经准备好交给真实读者。

## Final Review

当 Reader Testing 通过后：

1. 建议用户自己再完整通读一遍，因为文档最终由他们负责
2. 提醒再次核对事实、链接和技术细节
3. 让他们确认文档是否真的达成了最初希望产生的影响

询问是否还要再做一次 review，还是已经完成。

**如果用户还要最终 review，就继续。否则：**
宣布文档完成，并给出几点收尾建议：
- 可以把本次对话链接放进 appendix，方便读者了解文档演化过程
- 用 appendix 承载细节，避免主体文档臃肿
- 当真实读者给出反馈后，及时继续更新文档

## Tips for Effective Guidance

**语气：**
- 直接、程序化
- 只有在会影响用户行为时才简短解释原因
- 不需要推销流程，只需执行

**偏离处理：**
- 如果用户想跳过某个阶段：直接确认是否改为 freeform 写法
- 如果用户显得烦躁：承认流程比预期更长，并给出加速方式
- 始终保留用户对流程的控制权

**上下文管理：**
- 过程中只要发现缺上下文，就主动补问
- 不要让信息缺口堆积

**Artifact 管理：**
- 用 `create_file` 起草完整 section
- 所有编辑使用 `str_replace`
- 每次改完都给 artifact 链接
- brainstorming 列表不要用 artifact，直接在对话里完成

**质量优先于速度：**
- 不要急着跳步骤
- 每次迭代都应带来真正改进
- 目标是写出“对读者真的有效”的文档

## Reference Files

只按需加载：
- `references/RUNTIME-MATRIX.md` - 如何根据 Claude Code、Claude.ai、connector 丰富 / 匮乏环境调整流程
- `references/DOC-TYPES.md` - 常见文档类型的默认章节骨架
- `references/READER-TEST.md` - reader testing 的提示词、交接包与通过 / 失败信号
