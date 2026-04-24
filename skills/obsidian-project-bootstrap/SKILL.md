---
name: obsidian-project-bootstrap
description: 当用户要求启动一个新的 research project、把现有代码加 Markdown 仓库导入 Obsidian，或将当前仓库绑定到一个紧凑型 research knowledge base 以便未来同步时使用该 skill。
---

# Obsidian Project Bootstrap

为当前仓库 bootstrap 一个项目知识库。

## 在工作流中的角色

这是一个 **supporting skill**。

使用 `obsidian-project-memory` 作为主要工作流权威。该 skill 只应在仓库还需要首次绑定或重建时使用。

## 何时使用

- 用户说“start a new research project”
- 用户已有一个包含代码和 Markdown 的仓库，并希望自动生成 Obsidian knowledge base
- `obsidian-project-memory` 检测到 research-project candidate，但尚无已有绑定

## 必需输入

从以下来源之一解析 vault path：
1. 用户显式输入
2. `OBSIDIAN_VAULT_PATH`

## Codex-native 脚本路径规则

使用与当前模式匹配的 helper path：
- `standby`: `python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py" ...`

## 流程

1. 识别 repository root。
2. 先运行 preflight detect：
   ```bash
   python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" detect --cwd "$PWD"
   ```
3. 只有在 repo 尚未绑定且应被导入时，才执行 bootstrap：
   ```bash
   python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" bootstrap --cwd "$PWD" --vault-path "$OBSIDIAN_VAULT_PATH"
   ```
   如果当前模式是 `global`，则把以上示例中的 helper path 替换为：
   ```bash
   $HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py
   ```
4. 验证 bootstrap 至少创建了：
   - `hello-scholar/project-memory/registry.yaml`
   - `hello-scholar/project-memory/<project_id>.md`
   - `Research/{project-slug}/00-Hub.md`
   - `Research/{project-slug}/01-Plan.md`
   - `Research/{project-slug}/Knowledge/Source-Inventory.md`
   - `Research/{project-slug}/Knowledge/Codebase-Overview.md`
5. 如果导入后的项目仍缺少真实背景或实验上下文，切换到 agent-first 流程：
   - 读取最有信息量的 repo docs 和代码入口
   - 将 durable notes 综合写入 `Knowledge/`、`Papers/`、`Experiments/`、`Results/` 或 `Writing/`
   - 避免占位式 notes
6. 总结已创建知识库，以及下一批推荐补齐的 canonical notes。

## 备注

- bootstrap 过程导入的是 **结构和摘要**，而不是原始数据集、缓存、checkpoints 或完整代码树。
- 忽略 `.git`、`.venv`、`node_modules`、caches、checkpoints、binaries 等重型产物。
- 默认 vault 结构保持紧凑：`00-Hub.md`、`01-Plan.md`、`Knowledge/`、`Papers/`、`Experiments/`、`Results/`、`Writing/`、`Daily/`、`Archive/`。
- 如果当前 shell 中没有 `python3`，则使用系统中能够运行 `project_kb.py` 的 Python 解释器，并明确说明这一点。

## References

- `references/BOOTSTRAP-RUNBOOK.md` - preflight 决策、失败模式和 bootstrap 后验证
