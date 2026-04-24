# Bootstrap Runbook

## 预检决策

1. 先运行 `detect`。
2. 如果 repo 已经绑定，停止并复用现有项目。
3. 如果 repo 看起来不像 research 项目，不要强行 bootstrap，先确认。
4. 如果缺少 `OBSIDIAN_VAULT_PATH`，需要显式向用户索取。
5. 在 Codex 中，使用与当前模式匹配的 `project_kb.py` 路径：
   - `standby`: `.hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py`
   - `global`: `$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py`

## 常见失败模式

- `vault path missing` -> 需要显式路径或环境变量
- `already bound` -> 默认不要重建
- `repo not research-like` -> 未确认前不要自动创建 vault 结构
- `python interpreter mismatch` -> 用当前可用解释器执行，并明确说明所用路径

## Bootstrap 后验证

至少检查这些产物：

- `hello-scholar/project-memory/registry.yaml`
- `hello-scholar/project-memory/<project_id>.md`
- `Research/{project-slug}/00-Hub.md`
- `Research/{project-slug}/01-Plan.md`
- `Research/{project-slug}/Knowledge/Source-Inventory.md`
- `Research/{project-slug}/Knowledge/Codebase-Overview.md`

如果 bootstrap 后项目看起来仍然很空，不要继续堆 placeholder notes；转而采用 agent-first synthesis。
