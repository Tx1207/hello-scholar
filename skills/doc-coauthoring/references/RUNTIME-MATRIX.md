# 运行环境矩阵

## Claude Code / 本地文件系统可用

- 优先使用本地 Markdown 文件。
- 直接编辑文件，不要只假设 artifact 存在。
- 只有 sub-agents 实际可用时，才用它们做 reader testing。

## Claude.ai 或带 artifacts 的应用

- 当 artifacts 能提升迭代速度时使用 artifacts。
- 在对话中明确文档路径或 artifact 标识。

## Connectors 可用

- 只有在用户同意后，才从已连接系统拉取上下文。
- 起草前先总结导入的上下文。

## Connectors 不可用

- 请用户粘贴或总结所需上下文。
- 不要暗示可以自动读取 Slack / Drive / SharePoint。
