# MCP 服务器配置指南

Claude Scholar 依赖 MCP（Model Context Protocol）服务器提供扩展功能。MCP 服务器**不包含**在本仓库中 — 用户需自行安装和配置。

## 必需的 MCP 服务器

### 1. Zotero MCP（研究工作流）

**使用者**: `literature-reviewer` 代理、`research-ideation` skill 及研究工作流技能（通过自然语言触发）

**包**: [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) — Web API 模式，支持远程访问，无需 Zotero 桌面应用。

#### 功能

| 类别 | 工具 |
|------|------|
| **导入** | `zotero_add_items_by_doi`、`zotero_add_items_by_arxiv`、`zotero_add_item_by_url` |
| **读取** | `zotero_get_collections`、`zotero_get_collection_items`、`zotero_search_items`、`zotero_semantic_search` |
| **更新** | `zotero_update_item`、`zotero_update_note`、`zotero_create_collection`、`zotero_move_items_to_collection` |
| **删除** | `zotero_delete_items`（移至回收站）、`zotero_delete_collection` |
| **PDF** | `zotero_find_and_attach_pdfs`（通过 Unpaywall）、`zotero_add_linked_url_attachment` |

#### 前置条件

1. 安装 [Zotero](https://www.zotero.org/)（可选，用于本地模式）
2. 从 [zotero.org/settings/keys](https://www.zotero.org/settings/keys) 获取 Zotero API 密钥和库 ID

#### 安装

```bash
# 通过 uv 安装（推荐）
uv tool install git+https://github.com/Galaxy-Dawn/zotero-mcp.git
```

#### 配置

选择你的平台：

##### Codex CLI

添加到 `~/.codex/config.toml`：

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true

[mcp_servers.zotero.env]
ZOTERO_API_KEY = "your-api-key"
ZOTERO_LIBRARY_ID = "your-library-id"
ZOTERO_LIBRARY_TYPE = "user"
UNPAYWALL_EMAIL = "your-email@example.com"
UNSAFE_OPERATIONS = "all"
NO_PROXY = "localhost,127.0.0.1"
```

##### Claude Code

添加到 `~/.claude/settings.json`：

```json
{
  "mcpServers": {
    "zotero": {
      "command": "zotero-mcp",
      "args": ["serve"],
      "env": {
        "ZOTERO_API_KEY": "your-api-key",
        "ZOTERO_LIBRARY_ID": "your-library-id",
        "ZOTERO_LIBRARY_TYPE": "user",
        "UNPAYWALL_EMAIL": "your-email@example.com",
        "UNSAFE_OPERATIONS": "all"
      }
    }
  }
}
```

##### OpenCode

添加到 `~/.opencode/opencode.jsonc`：

```jsonc
{
  "mcp": {
    "zotero": {
      "type": "local",
      "command": ["zotero-mcp", "serve"],
      "enabled": true
    }
  }
}
```

在 `~/.zshrc` 中设置环境变量：

```bash
# Zotero MCP
export ZOTERO_API_KEY="your-api-key"
export ZOTERO_LIBRARY_ID="your-library-id"
export ZOTERO_LIBRARY_TYPE="user"
export UNPAYWALL_EMAIL="your-email@example.com"
export UNSAFE_OPERATIONS="all"
```

#### 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `ZOTERO_API_KEY` | 是 | 你的 Zotero API 密钥 |
| `ZOTERO_LIBRARY_ID` | 是 | 你的库 ID（数字） |
| `ZOTERO_LIBRARY_TYPE` | 是 | `user` 或 `group` |
| `UNPAYWALL_EMAIL` | 否 | 用于 Unpaywall PDF 搜索的邮箱 |
| `UNSAFE_OPERATIONS` | 否 | `items`（启用 delete_items）、`all`（启用 delete_collection） |
| `NO_PROXY` | 否 | 绕过 localhost 代理 |

#### 可用工具

| 工具 | 用途 |
|------|------|
| `zotero_get_collections` | 列出所有集合 |
| `zotero_get_collection_items` | 获取集合中的条目 |
| `zotero_search_items` | 按关键词搜索库 |
| `zotero_search_by_tag` | 按标签搜索 |
| `zotero_get_item_metadata` | 获取条目元数据和摘要 |
| `zotero_get_item_fulltext` | 读取 PDF 全文 |
| `zotero_get_annotations` | 获取 PDF 标注 |
| `zotero_get_notes` | 获取笔记 |
| `zotero_semantic_search` | 语义搜索（使用嵌入） |
| `zotero_advanced_search` | 高级搜索 |
| `zotero_add_items_by_doi` | 通过 DOI 导入论文 |
| `zotero_add_items_by_arxiv` | 通过 arXiv ID 导入预印本 |
| `zotero_add_item_by_url` | 保存网页为条目 |
| `zotero_update_item` | 更新条目字段 |
| `zotero_update_note` | 更新笔记内容 |
| `zotero_create_collection` | 创建集合 |
| `zotero_move_items_to_collection` | 在集合间移动条目 |
| `zotero_update_collection` | 重命名集合 |
| `zotero_delete_collection` | 删除集合 |
| `zotero_delete_items` | 将条目移至回收站 |
| `zotero_find_and_attach_pdfs` | 查找并附加开放获取 PDF |
| `zotero_add_linked_url_attachment` | 添加链接 URL 附件 |

### 2. 浏览器自动化 MCP（可选）

用于：Chrome 浏览器控制、网页交互。

#### 配置

```json
{
  "mcpServers": {
    "streamable-mcp-server": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

## 验证

配置完成后，重启 CLI 并验证 MCP 服务器已连接：

```
# 在 CLI 中尝试调用 Zotero 工具：
> 列出我的 Zotero 集合
```

如果工具返回你的集合列表，说明配置成功。

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| 工具返回错误 | 检查 API 密钥和库 ID 是否正确 |
| PDF 附加失败 | 确保已设置 `UNPAYWALL_EMAIL` |
| 删除操作被阻止 | 设置 `UNSAFE_OPERATIONS=items` 或 `all` |
| HTTP 错误 | 检查 `NO_PROXY` 是否包含 localhost |
| API 速率限制 (429) | 每批次 ≤10 篇论文，批次间添加延迟 |
