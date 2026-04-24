# 工作流

## 1. Detect

运行：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" detect --cwd "$PWD"
```

用它判断 repo：

- 是否已经绑定
- 是否应该 bootstrap
- 或者是否应该保持不动

## 2. Bootstrap

只有当仓库明显属于 research-project，且尚未绑定时，才进行 bootstrap。

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" bootstrap --cwd "$PWD" --vault-path "$OBSIDIAN_VAULT_PATH"
```

Bootstrap 只应创建 `SCHEMA.md` 中定义的紧凑结构，包括内部实验报告使用的 `Results/Reports/`。

如果要显式生成中文笔记：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" bootstrap --cwd "$PWD" --vault-path "$OBSIDIAN_VAULT_PATH" --note-language zh-CN
```

如果当前模式是 `global`，就把上面命令中的 helper path 替换成：

```bash
$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py
```

生成 / 同步笔记的语言优先级：

1. `hello-scholar/project-memory/registry.yaml` 中的项目级 `note_language`
2. 环境变量 `OBSIDIAN_NOTE_LANGUAGE`
3. 默认 `en`

即使切换了语言配置，section update 仍需兼容中英文 heading，保证旧笔记仍可安全同步。

## 3. Daily 或 repo-driven sync

使用：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" sync --cwd "$PWD" --scope auto
```

sync 只用于确定性的状态维护：

- 刷新 `00-Hub.md`
- 刷新 `01-Plan.md`
- 刷新 project memory
- 写入 daily sync 信息
- 保持 source inventory 和 codebase overview 新鲜

不要依赖 sync 从原始文件自动“理解”项目含义。

读侧辅助或单 note 生命周期操作可用：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" query-context --cwd "$PWD" --kind broad
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" query-context --cwd "$PWD" --kind result --query "syllable-channel"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" find-canonical-note --cwd "$PWD" --kind experiment --query "freezing S7 speaking"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode archive --note "Results/Old-Result.md"
```

## 4. Agent-first import 或 synthesis

当 vault 缺少背景知识或上下文时，不要先扩展脚本。

应优先：

1. 让 agent 读取最有信息量的项目资料
2. 综合出 project-level knowledge
3. 将 durable notes 写回 `Knowledge/`、`Experiments/`、`Results/`、`Results/Reports/` 或 `Papers/`

## 5. 沿主研究路径推进

实质性科研回合优先沿这条路径推进：

```text
Papers -> Experiments -> Results -> Writing
```

典型推进方式：

- 理解新论文 -> 更新 `Papers/`，并决定是否要在 experiment note 中吸收 hypothesis、baseline 或 evaluation rule
- 规划 / 执行实验 -> 更新 `Experiments/`，并决定什么证据足以支持新的 result note
- 发现稳定结论 -> 更新 `Results/`，并决定是否要在 `Results/Reports/` 写 round retrospective
- 草稿或 review 工作 -> 更新 `Writing/`，并保持到 supporting results 和 papers 的链接

不要把这些文件夹当成孤立 silo。默认 durable workflow 是在一轮工作支持的情况下，把知识沿路径向前推进。

## 6. 增量更新规则

多数回合只写**最小 durable delta**。

例如：

- 小工程改动 -> `Daily/` + project memory
- 新实验设计 -> `Experiments/`
- 新结果解释 -> `Results/`
- 新的内部实验复盘 -> `Results/Reports/`
- 新项目 framing -> `Knowledge/`
- 新 paper note -> `Papers/`

## 7. 摄入新的 Markdown 文件

新的 `.md` 文件出现时，不要只按路径路由。

应按以下顺序处理：

1. 判断其属于 `knowledge`、`paper`、`experiment`、`result`、`writing` 还是 `daily`
2. 判断它是 **durable note** 还是 **raw material**
3. 执行以下之一：
   - **promote** 到匹配的顶层目录
   - **merge** 到已有 canonical note
   - 不稳定时先 **stage to Daily**

例如：

- 新 `plan/new_idea.md` -> 通常先总结，再更新 `01-Plan.md` 或 `Knowledge/Research-Questions.md`
- 完整实验总结 -> 通常提升到 `Results/Reports/`，若结论已稳定，再同步更新 `Results/`
- 临时会议备忘录 -> 通常先放到 `Daily/`

`project_kb.py` 可以维护这一过程的状态，但不应替代 promote vs merge 的判断。

## 8. 更新 / archive / purge durable notes

对于 durable notes：

- 对象已存在时更新 canonical note
- 只有对象确实不同才创建新 note
- 用户说“移除”时默认 archive
- 只有明确永久删除意图时才 purge

archive 或 purge 后，要修复 `00-Hub.md`、`01-Plan.md` 和显式索引中的直接链接。

## 9. 生命周期操作

默认移除行为是 archive：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode archive
```

只有当用户明确要求永久删除时才 purge。
