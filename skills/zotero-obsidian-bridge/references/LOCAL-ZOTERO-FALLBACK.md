# 本地 Zotero 回退方案

当 Zotero MCP 传输层不可用，但用户仍希望按 collection 做一轮处理时，使用这份 runbook。

## 前置条件

- 本地可用 `zotero-mcp` 源码 checkout 或已安装的 Python 包。
- 本地环境可以读取 metadata/fulltext，且不会修改 Zotero 库。

## 默认回退顺序

1. 先确认失败的是 MCP 传输层，而不是 collection 查询本身。
2. 切换到本地 Python 路径来获取 metadata 和 fulltext。
3. 继续创建或更新规范 paper note。
4. 在结束批处理前运行 `verify_paper_notes.py`。

## 必须明确报告

始终说明：
- MCP 传输层失败了；
- 工作流已经通过本地回退继续执行；
- 如果仍有不可用部分，也要明确写出。
