# 学术写作知识库

该知识库存放从论文中挖掘出的、可复用的 academic writing knowledge。

## Canonical maintained memory

当前 canonical paper-miner memory 位于：

- `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`

这是**唯一持续维护中的 paper-miner writing memory**。

它存储：

- 挖掘出的 writing patterns
- 结构信号
- 可复用措辞
- venue-specific signals
- 这些信号如何帮助后续写作
- source index

## 维护规则

`paper-miner` 总是把挖掘出的写作知识写入 `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`。

这个 memory 是：

- **global**
- **cross-project**
- **not project-specific**

即使在某个项目内调用 `paper-miner`，它也只会把结果写到这份全局 memory；项目上下文只用于帮助理解相关性。

## Legacy 文件

当前目录中的 bundled files 只作为 seed material 或 historical references。

像下面这些旧文件：

- `structure.md`
- `writing-techniques.md`
- `submission-guides.md`
- `review-response.md`

仍可保留作历史参考，但新的 paper-miner 更新都应把 `paper-miner-writing-memory.md` 视为 canonical maintained memory。

## 使用场景

当你需要：

- 起草论文
- 改进 section structure
- 借用可复用 phrasing patterns
- 准备 rebuttal
- 研究 venue-facing 写作信号

时，可以使用这个知识库。

## 贡献方式

当 `paper-miner` 分析新论文时：

1. 提取可执行的写作知识
2. 将其 merge 进 `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`
3. 保留来源归属
4. 避免重复模式
5. 保持 memory 紧凑且可复用
