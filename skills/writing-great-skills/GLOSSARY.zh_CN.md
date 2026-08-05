# 术语表——编写优秀 Skills

优秀 Skill 的领域模型。Skill 的作用是从随机系统中提炼确定性；根本美德是**Predictability**，以下每个术语都是服务于它的杠杆。这是 [`writing-great-skills`](SKILL.zh_CN.md) 所披露的参考资料。

术语按轴分组：**Invocation**（如何触达 Skill）、**Information Hierarchy**（如何安排内容）、**Steering**（如何塑造 Agent 的运行时行为）和 **Pruning**（如何保持精简）。每个**失败模式（failure mode）**都与修复它的杠杆放在一起，并标明 _失败模式_。

任一定义中的加粗术语也在本术语表中定义；按标题查找即可。

## Predictability

Skill 让 Agent 在每次运行时以相同**方式**行动的程度——过程相同，而不是输出相同（brainstorming Skill 应当可预测地发散；它的 token 不同，行为却不变）。这是其他所有术语服务的根本美德——成本和可维护性是它的症状，而非竞争目标。

_避免使用_：consistency、reliability、robustness、output-determinism

## Invocation

Skill 如何被触达，以及选择对应的两种负载。

### Model-Invoked

保留**description** 字段的 Skill，使 Agent 能看见并自主触发它——人类仍然可以手动输入名称，因此模型调用始终**包含**用户可达性。不存在只能由模型调用的状态：description 只会增加 Agent 的发现能力，不会移除人类的。它以每轮永久**context load**为代价换取这种可发现性。其他 Skill 也能调用它，因为让它可被 Agent 发现的 description 也使它可被调用。只在 Agent 必须自行调用它时选择模型调用；若它从不在手动调用之外触发，移除 description，避免 context load。

_避免使用_：ability、tool、capability

### User-Invoked

description 被移除的 Skill——对 Agent 不可见，只有人类手动输入名称才能调用（用户**独占**，而 **model-invoked** 是用户**和** Agent 都可调用）。它以零 **context load** 换取 Agent 的不可发现性。因为没有 description，除人类外任何对象都无法调用它：其他 Skill 也不能触发它。

_避免使用_：procedure、workflow、command

### Description

Skill 的机器可读触发器，以及模型调用 Skill 被迫始终加载的唯一**context pointer**。它的存在本身就是调用轴：保留它，Skill 就是 model-invoked（其他 Skill 也可调用）；删除它，Skill 就是 user-invoked，只能由人类调用。它是 model-invoked Skill 的 **context load** 来源。

_避免使用_：frontmatter、summary

### Context Pointer

存在于 Agent 上下文中、指向某段上下文外材料并编码访问条件的参考。description 是顶层 context pointer（上下文窗口 → Skill）；指向已披露文件的指针是向下一层延伸的同一对象。决定 Agent 何时访问、以及访问可靠性的不是目标文件，而是指针的措辞。弱措辞指向必读内容属于方差缺陷：先修正措辞，只有仍然失败时才将材料内联。

_避免使用_：link、reference、import

### Context Load

model-invoked Skill 对 Agent 上下文窗口施加的成本——其始终加载的 description，同时消耗 token 和注意力。user-invoked Skill 通过没有 description 避免它；它也限制了继续拆成更多 model-invoked Skill。

_避免使用_：token cost、context bloat

### Cognitive Load

user-invoked Skill 对人类施加的成本——人必须在脑中记住哪些 Skill 存在、何时使用（人类就是索引）。model-invocation 通过 Agent 可发现性消除了它；它也限制了继续拆成更多 user-invoked Skill。这不是必须最小化的成本：它是人类自主性的代价，也是一些 Skill 应保持 user-invoked 的原因。人类判断重要处承担它；不重要处移除它。

_避免使用_：human index、burden、overhead

### Router Skill

一个 user-invoked Skill，职责是指向其他 user-invoked Skill——列出每个 Skill 以及何时使用——让人类只需记住一个 Skill，而不是许多个。它只能提示，不能触发它们：user-invoked Skill 没有 description，因此只有人类能调用。它在 user-invoked Skill 变多时解决 **cognitive load**。

_避免使用_：dispatcher、menu、registry、index、router procedure

### Granularity

划分 Skill 的精细程度。更细的划分会消耗两种负载之一：更多 model-invoked Skill 消耗 **context load**（更多 description 挤占窗口并争夺注意力）；更多 user-invoked Skill 消耗 **cognitive load**（人类需要记住和调用更多）。两种切分指导这种划分。按 **invocation** 切分：当存在实际出现在提示中的独特 **leading word** 可触发它时，拆出 model-invoked Skill。按**序列**切分：当某一步的 **post-completion steps** 需要隐藏时拆分步骤序列，因为将其隔离到自己的上下文能清除后续内容。注意反向操作：合并序列会让每一步暴露其后续步骤，从而引发 premature completion。

_避免使用_：chunking、modularity

## Information Hierarchy

Skill 内容如何安排，以及每项内容位于阶梯的多深。

### Information Hierarchy

按 Agent 多快需要内容进行排序的一条阶梯，由两次切分形成：内容在文件内还是在指针之后，以及它是 step 还是 reference。层级如下：

- **Steps**——文件内，最高层
- **Reference**——文件内，次级
- **Reference**——已披露，位于 **context pointer** 之后

没有 **steps** 的 Skill 只使用后两层——通常是合理的扁平平级集合（例如一份审阅的每条规则同处一层），这完全合理，不是异味。层级与调用方式无关：无论内容全是 steps、全是 reference 还是二者兼有，Skill 都可以是 model-invoked 或 user-invoked。当 Skill 有 steps 时，本应披露的文件内 reference 会埋没步骤，使对它们的关注变成抛硬币——这不仅是可读性问题，还是方差杠杆。保持阶梯顶部清晰；尽可能把内容向下移动。

_避免使用_：structure、organization、layout

### Steps

Agent 按顺序执行的行动——当 Skill 包含 steps 时，它们是内容的最高层，也是其应留在 `SKILL.md` 的部分。并非每个 Skill 都有 steps：Skill 可以全是 steps（`tdd`）、全是 **reference**（审阅），或同时具备二者，独立于调用方式。每个 step 以或清晰或模糊的 **completion criterion** 结束。

_避免使用_：workflow、instructions、choreography

### Reference

Agent 按需查阅的材料——定义、事实、参数、示例、条件性指令。Skill 有 **steps** 时它处于次级；Skill 没有 steps 时它构成全部内容；或者它完全位于 Skill 系统之外——见 **External Reference**。通过 **context pointers** 访问，是 **progressive disclosure** 的主要候选。

_避免使用_：supporting material、docs、background

### External Reference

位于 Skill 系统之外的 **reference**——普通文件、没有 description、没有 steps、不可调用——任何 Skill 都可指向它。它是无需自行触发的共享参考的归宿，也是两个 user-invoked Skill 唯一可共享的归宿，因为二者都没有 description，无法相互调用。

_避免使用_：doc、resource、knowledge base

### Progressive Disclosure

将 **reference** 沿阶梯向下移动——从 `SKILL.md` 移到 **context pointer** 后——使顶部保持清晰。这主要不是 token 优化；它保护的是 **information hierarchy**。它由**分支（branching）**授权：只有部分分支需要的内容放在指针后，所有路径都需要的内容内联；若一个指针对必读内容触发不可靠，先加强其措辞，只有失败后才把内容拉回内联。

_避免使用_：lazy loading、chunking

### Co-location

将 Agent 同时需要的材料放在同一处——一个概念的定义、规则和注意事项置于同一标题下，而不是散落在文件各处——使读到一处时同时看到相邻材料。它是 **Information Hierarchy** 的文件内配套：层级决定一项内容下沉多深，共置决定下沉后哪些内容放在一起。没有适用于一组 **reference** 的固定正文格式；测试标准是 Skill 应像为 Agent 编写的文档那样可读，在材料应聚集处将其聚集就能做到。它不同于 **Duplication**：后者在两处重复同一含义，散落则是把同一含义切碎在多处。

_避免使用_：grouping、clustering、cohesion

### Sprawl

_失败模式。_ 一个单纯过长的 Skill——`SKILL.md` 行数过多——无论这些行是否陈旧或重复。即使每一行都有效且独特，Skill 仍可能蔓延。它消耗可读性（Agent 行动前需穿越更多内容，注意力在过量信息中变薄）、可维护性（每增加一行就多一行要检查 **relevance**）和 token。修复方式是 **information hierarchy**：把 **reference** 放到 **context pointers** 后，并按**分支（branch）**或序列拆分，让每条路径仅携带它需要的内容。它不同于 **sediment**（陈旧积累导致的长度）和 **duplication**（重复含义导致的长度）——sprawl 是不论成因的长度本身。

_避免使用_：bloat、length、size、verbosity

## Steering

将 Agent 的运行时行为塑造得更具 **Predictability** 的杠杆。

### Branch

Skill 可被调用的一种不同方式——Skill 所处理的一种情形——因此不同运行会沿着不同路径通过它。包含许多步骤的 Skill 可包含许多分支；线性 Skill 没有分支。

_避免使用_：path、case、fork

### Leading Word

模型预训练中已有的紧凑概念——也称为 _Leitwort_——Agent 在运行 Skill 时围绕它思考。它以最少 token 编码行为原则，借用已有先验（例如 *lesson*、*proximal zone of development*、*fog of war*、*tracer bullets*）。它应作为 token 而非句子重复，从而在 Skill 中积累分布式定义并锚定整片行为区域。若你清楚定义，自创词也可以；但自创词没有可借用的先验——你需要用定义 token 补回预训练词本可免费提供的内容。优先寻找已有词。

leading word 以两种方式服务 **predictability**。在正文中，它锚定**执行（execution）**：每次该概念出现时，Agent 都采用相同的行为；在扁平 reference 中，它让注意力聚焦在需要查找的一类事物上，从而每次都调用正确检查。在 **description** 中，它锚定**调用（invocation）**——且不只在 Skill 内：当相同的词存在于提示、文档和代码库中，Agent 会将这种共享语言与 Skill 关联，更可靠地触发它。用你实际想触发 Skill 时会使用的主导词来编写 description。

_避免使用_：keyword、term、motif

### Completion Criterion

表明一个工作单元已完成的条件——Agent 用来判断的目标。两项性质使它成为杠杆，而非普通质量。其**清晰度**（Agent 能否区分完成与未完成？）抵抗 **premature completion**——模糊边界（“已理解”）允许 Agent 声称完成并滑向下一步；该轴需要 **steps** 才能发挥作用，因为 premature completion 是步骤之间的失败。其**要求度**（要求完成多少）设定 **legwork**——“每个已修改模型都已说明”比“给出改动列表”要求更充分的工作；这个轴**不**受步骤约束：它也能约束扁平 reference，这使得没有 steps 的 Skill 仍可有穷尽门槛（“应用每条规则”）。最强的标准同时可检查且穷尽。

_避免使用_：done condition、exit condition、stopping rule

### Legwork

Agent 在单一步骤中于幕后完成的工作——阅读文件、探索代码库、进行改动、查找所需事实，而不是把工作交给用户。它位于步骤结构之下：从不单独写成一个步骤，潜伏在措辞中，由 Agent 而非 Skill 控制。它是单步内与 **post-completion steps** 跨步骤拉力相对的一面。强的 **leading word**（*comprehensive*、*thorough*）或要求穷尽工作的 **completion criterion** 会提升它——包括将要求度应用于扁平 reference，这正是没有步骤的参考型 Skill 仍会覆盖所有层级的原因。当这种要求缺失，或 **premature completion** 过早终止步骤时，它就会变薄。

_避免使用_：scope、effort、diligence、coverage

### Post-Completion Steps

当前步骤之后的 **steps**。可见的后续步骤会将 Agent 向前拉入 **premature completion**——看到得越多，拉力越强；防御方式是通过拆分序列隐藏它们。

_避免使用_：horizon、fog of war、lookahead

### Premature Completion

_失败模式。_ 当前步骤尚未真正完成就结束，因为 Agent 的注意力从工作滑向了“完成”。它是步骤之间的失败：必须存在 **steps** 才会发生——没有 steps 的 Skill 过早停止并非 premature completion，而是在未满足要求下的薄弱 **legwork**。这是两种力量的拉锯：可见的 **post-completion steps**（向前拉力）与 **completion criterion** 的清晰度（阻力——清晰、可检查的标准能守住；模糊标准会让步）。模糊是必要条件：无论多少后续步骤可见，清晰边界都能抵抗拉力，因此从不草率推进的步骤无需防御。两种杠杆按顺序使用：**先明确标准**——局部且成本低。只有标准无法再明确且确实观察到草率推进时，才**隐藏后续步骤**——而隐藏只有跨越真实上下文边界才有效（用户调用的交接或子 Agent 派发；内联模型调用会让后续步骤留在上下文中，无法清除任何内容）。它是薄弱 legwork 的一个成因，但不同于它：即使步骤完整运行，legwork 仍可能薄弱。

_避免使用_：premature closure、the rush、rushing、shortcutting

### Negation

_失败模式。_ 通过禁止来引导——告诉 Agent **不要**做什么——会把禁止行为拉入上下文，使它更容易被采用而非更难。*不要想大象*，上下文里只剩大象；*绝不写冗长注释*，刚刚读到的模式就是冗长。否定是弱修饰，无法压过被强烈激活的概念，所以禁令会被部分读成执行该行为的指令。它的**主导词（leading word）**是那只*大象*：每条禁止放进框架的行为。修复：提示**正向目标**——描述期望行为（“写一行注释”），让禁止行为根本不被提及。禁止只有作为无法正向表达行为的硬性护栏才值得保留；即便如此，也要配上正向目标，使注意力落在应做的事上。

_避免使用_：ironic rebound、don't-prompting、the pink elephant

## Pruning

保持 Skill 精简；每种补救办法都与其修复的失败模式相配。

### Single Source of Truth

每个语义恰好位于一个权威位置的理想状态，因此更改 Skill 行为只需编辑一个位置。**Duplication** 违反它。

_避免使用_：home、canonical location

### Duplication

_失败模式。_ 同一语义有多个 **single source of truth**。它增加维护成本（改一处时必须同步其他处）、增加 token 成本，并抬高显著性——重复一个语义会将其在层级中的权重抬高到超出真实等级。它是 **leading word** 的意外反面：leading word 有意重复 token，从不重复完整语义，以此提升注意力。

_避免使用_：repetition、redundancy

### Relevance

一行文字是否仍与 Skill 的工作有关——判断保留什么的镜头。一行失去相关性，要么是它从未真正服务任务（纯粹阐述，或本应被披露的**分支（branch）**），要么是它变得陈旧：所描述的行为或世界变化后逐渐失准。短 Skill 更容易保持相关，因为每一行的检查成本更低。它不同于 **no-op**：relevance 询问一行是否与任务有关，no-op 询问它是否改变行为。

_避免使用_：load-bearing、staleness、freshness

### Sediment

_失败模式。_ 因添加看似安全、删除看似有风险而沉积、从未清除的旧内容层；陈旧和无关的行不断积累，使你必须向下钻过它们才能找到仍然有效的内容。没有删减纪律的 Skill 的默认归宿；它是 **relevance** 的缓慢侵蚀，不同于 **duplication** 的重复含义。

_避免使用_：accretion、bloat、cruft、rot

### No-Op

_失败模式。_ 一条不会改变任何行为的指令，因为模型默认已经会这样做；你花费负载告诉 Agent 本来就会做的事。测试是：这行文字相对默认行为是否改变了行为？一行可以完全**相关（relevant）**，却仍然是 no-op。让 **leading word** 免费生效的同一先验也让 no-op 毫无价值。

leading word 是一种**技术**；No-Op 是对一行文字的**判决**——二者交叉。弱到无法胜过默认行为的 leading word 是 no-op（模型已经大致会充分工作时说 *be thorough*）；修复方式是使用能通过判决的更强词（*relentless*），而不是换一种技术。因此 No-Op 测试——它相对默认行为是否改变了行为？——也是衡量 leading word 是否值得重复的办法。这是相对模型而非相对读者的判断：两个人若对一句是否为 no-op 有分歧，其实是对默认行为有分歧，应通过运行 Skill 解决，而不是辩论。

_避免使用_：redundant instruction、restating the obvious、belaboring
