# hello-scholar 需求与验收矩阵

本文档把 `hello-scholar` 的公开需求、触发方式、预期文件修改和验收标准集中到一处，用于判断当前项目是否满足预期，并作为后续回归检查清单。

## 范围

- **产品范围**：面向 Codex CLI 的科研代码项目 runtime，重点服务 ML 实验开发、实验记录、结果分析、论文相关工作流和 skill/preference evolution。
- **事实来源**：`README.md`、`AGENTS.md`、`catalog/*.json`、`skills/**/SKILL.md`、`agents/**/AGENTS.md`、`scripts/**`、`test/**`。
- **不包含**：真实训练任务的指标好坏、外部 Codex CLI 行为变化、第三方服务可用性。

## 需求状态标记

| 状态 | 含义 |
|---|---|
| Done | 当前实现已有明确代码、文档或测试支撑。 |
| Partial | 主链路存在，但文档、自动化或边界检查仍不完整。 |
| Gap | README/AGENTS 有承诺或强需求，但实现或公开说明缺失。 |
| Deferred | 已识别需求，但当前阶段明确暂缓。 |

## 需求矩阵

| ID | 需求 | 触发方式 | 主要文件影响 | 验收标准 | 当前状态 | 证据 | 差距 / 下一步 |
|---|---|---|---|---|---|---|---|
| REQ-001 | 默认使用 `ml-development` profile 服务科研代码与实验开发。 | `hello-scholar profile use ml-development`；未显式选择时加载 base profile。 | `.hello-scholar/modules.json` 或全局 modules；安装态 prompt。 | `ml-development` 是 base profile；安装后 prompt 显示 active profile 和激活模块。 | Done | `catalog/profiles.json`；`test/profile-loader.test.mjs` | 无。 |
| REQ-002 | 支持 lifecycle/support profiles 组合，按 profile 激活 skills 和 agents。 | `hello-scholar profile list`；`hello-scholar profile use <profile-id> [...]`。 | selection state；安装态 skills/agents；`AGENTS.md` managed block。 | profile 中引用的 skill/agent 全部可解析；profile 切换后安装态同步。 | Done | `catalog/profiles.json`；`catalog/skills.json`；`catalog/agents.json`；`test/hello-scholar.test.mjs` | `profile list` 在 TTY 下会进入交互选择，README 需说明。 |
| REQ-003 | 支持 standby 和 global 两种安装模式，且同一项目不可共存。 | `hello-scholar install codex --standby`；`hello-scholar install codex --global`。 | 项目 `.hello-scholar/`；项目 `AGENTS.md`；`~/.codex/AGENTS.md`；Codex plugin cache。 | standby/global 互斥；不同项目 standby 可共存；cleanup 可移除 managed block。 | Done | `scripts/install/cli-codex.mjs`；`test/hello-scholar.test.mjs` | 术语 `standby/project/scope` 需在文档中统一解释。 |
| REQ-004 | CLI 保持最小入口，只暴露安装、清理、profile、preferences、status。 | `hello-scholar help`。 | 无或对应状态文件。 | help 输出与 README CLI 列表一致；未知命令报错。 | Done | `cli.mjs`；`README.md`；`test/hello-scholar.test.mjs` | 无。 |
| REQ-005 | Agent 内部六个命令作为任务路由，不作为 npm 子命令。 | Codex 会话输入 `~idea`、`~plan`、`~build`、`~verify`、`~analyze`、`~evolve`。 | 根据命令可能写 `hello-scholar/plans`、`changes`、`experiments`、`state`、`evolution`、`preferences/candidates`。 | 六个 command skill 均存在；每个命令声明触发、边界和输出。 | Done | `skills/commands/*/SKILL.md` | 缺少一个公开命令到文件影响的总览，本文档补齐。 |
| REQ-006 | 实质项目修改必须创建或更新 change record。 | 进入实现、配置、文档、workflow 变更前运行 `scripts/change-tracker.mjs track-intent`；变更后 `track-change`；收尾 `track-closeout`。 | `hello-scholar/changes/INDEX.md`；`hello-scholar/changes/<record>.md`；`hello-scholar/state/*`。 | change record 包含用户请求、意图、影响文件、实际改动、验证、结果和下一步。 | Done | `scripts/change-tracker*.mjs`；`templates/change-record.md`；`test/change-tracker.test.mjs` | 需要在日常执行中持续遵守。 |
| REQ-007 | 实验相关修改必须集中进入 experiment package。 | 创建实验或实验相关变更时使用 experiment store/evidence store；`~build`、`~verify`、`~analyze` 按 active experiment 更新。 | `hello-scholar/experiments/EXP-*/experiment.yaml`、`changes.md`、`runs.md`、`evidence.md`、`analysis.md`、`artifacts.json`。 | 不把实验事实写成并行 research summary；证据、运行和分析都在 package 内。 | Done | `scripts/experiment-store.mjs`；`scripts/evidence-store.mjs`；`test/experiment-store.test.mjs`；`test/research-store.test.mjs` | README 可补 schema 细节。 |
| REQ-008 | delivery gate 阻止实验 evidence 写到顶层或使用过期证据。 | `~verify` 或交付前检查；脚本层调用 delivery gate。 | 读取 experiment package；可能更新 evidence 和 state。 | 非实验 top-level evidence target 被拒绝；过期 evidence 被拒绝；有效 experiment evidence 可通过。 | Done | `scripts/delivery-gate.mjs`；`test/delivery-gate.test.mjs` | 需在命令文档中明确 gate 何时必须运行。 |
| REQ-009 | `~plan` 生成结构化方案包。 | Codex 会话输入 `~plan <description>`；脚本层 `scripts/plan-package.mjs create`。 | `hello-scholar/plans/<plan-id>/requirements.md`、`plan.md`、`tasks.md`、`contract.json`。 | 方案包包含需求、计划、任务、contract；contract 可被后续 verify 消费。 | Done | `skills/commands/plan/SKILL.md`；`scripts/plan-package.mjs`；`test/plan-package.test.mjs` | README 只说明命令含义，未说明落盘结构；本文档补齐。 |
| REQ-010 | `~verify` 不只看退出码，要对照 contract、diff、change、experiment 和 evidence。 | Codex 会话输入 `~verify [scope]`。 | change record；experiment `runs.md/evidence.md/artifacts.json`；state。 | 输出验证项，记录命令、配置、seed、环境摘要、metrics、artifact 路径或失败原因。 | Partial | `skills/commands/verify/SKILL.md`；`scripts/delivery-gate.mjs`；相关测试 | 自动化主要覆盖 gate/store；人工执行规范依赖 agent 遵守。 |
| REQ-011 | `~analyze` 对实验结果做 hypothesis、baseline、failure case 和 next experiment 分析。 | Codex 会话输入 `~analyze`，通常在有实验 runs/evidence 后。 | experiment `analysis.md`；必要时更新 `experiment.yaml` 状态。 | 结论不夸大；说明支持/部分支持/否定；列出下一轮实验。 | Partial | `skills/commands/analyze/SKILL.md`；`skills/research/results-analysis/SKILL.md` | 缺少端到端样例实验包作为回归夹具。 |
| REQ-012 | Skill evolution 使用 candidate-first，不自动修改真实 skills。 | Codex 会话输入 `~evolve`；或运行 evolution scripts。 | `hello-scholar/evolution/candidates/**` 或全局 overlay candidates；用户批准后才 apply/merge。 | candidate 引用 evidence/change；apply 需要明确 approval；可应用到 overlay。 | Done | `scripts/evolution/*.mjs`；`test/skill-evolution-*.test.mjs` | README 可增加 apply/merge 安全边界说明。 |
| REQ-013 | Preference evolution 使用 candidate-first，不自动写入真实偏好。 | 用户说“记住这个偏好”或 `~evolve` 识别稳定偏好。 | `hello-scholar/preferences/candidates/**`；确认后才更新 `user-preferences.yaml`。 | candidate 包含 proposal/evidence/patch/decision；project/global 作用域清楚。 | Done | `scripts/preferences/preferences-store.mjs`；`test/preference-store.test.mjs` | 缺少用户级说明：哪些偏好必须单独确认。 |
| REQ-014 | 状态文件表达当前任务状态，不替代 change/experiment 明细。 | `~plan`、`~build`、连续实验开发、`~verify`、`~analyze`、`~evolve`。 | `hello-scholar/state/STATE.md`、`active.json`、`recent.json`、`state/runtime.json`。 | state 包含当前目标、route/tier、active change/experiment、上下文、下一步、阻塞项。 | Done | `scripts/workflow-state-store.mjs`；`scripts/runtime-state.mjs`；`test/workflow-state.test.mjs`；`test/runtime-state.test.mjs` | README 未展开 state 字段，后续可补。 |
| REQ-015 | `~idea` 是零副作用探索命令。 | Codex 会话输入 `~idea <description>`。 | 不创建 plan package，不改代码，不创建 project asset。 | mutating command 在 `~idea` route 下被 preflight 阻止。 | Done | `skills/commands/idea/SKILL.md`；`test/runtime-guard.test.mjs` | 无。 |
| REQ-016 | 受保护/敏感文件写入前需要确认。 | 涉及 prompt、workflow、AGENTS、SKILL 等高影响变更。 | 目标敏感文件；change record。 | preflight 对敏感文件写入要求确认；默认先方案后修改。 | Done | `test/runtime-guard.test.mjs`；`AGENTS.md` | 当前用户明确要求写入本文档，允许实施。 |
| REQ-017 | profile catalog 不得引用不存在的 skill/agent。 | `npm run build:catalog`；测试。 | `catalog/skills.json`、`catalog/agents.json`、`catalog/profiles.json`。 | 所有 profile refs 均可解析；所有 catalog path 存在。 | Done | 本次检查；`test/profile-loader.test.mjs` | 无。 |
| REQ-018 | 发布包内容与 README 承诺一致。 | `npm pack --dry-run` 或发布前检查。 | `package.json` files；README 多语言文件；`.codex-plugin/plugin.json`。 | files 列表中的文档存在；plugin 描述与 profile-driven 设计一致。 | Deferred | `package.json`；`.codex-plugin/plugin.json` | 用户已确认多语言 README 暂缓；plugin 描述后续可修。 |
| REQ-019 | 公开说明“功能如何触发、会改哪些文件”。 | 阅读本文档；README 链接本文档。 | `docs/requirements.md`；可选更新 `README.md`。 | 每个核心需求有触发方式和主要文件影响。 | Done | 本文档 | 可选：在 README 添加链接。 |
| REQ-020 | 测试套件可作为回归依据。 | `npm test`。 | 无；测试临时目录。 | 当前 58 项测试通过；覆盖 catalog、install、profile、change、experiment、gate、preferences、evolution、runtime state。 | Done | `test/*.test.mjs` | 尚无 `npm pack --dry-run` 测试和 docs link 检查。 |

## 功能触发与文件修改总览

| 操作 | 用户入口 | 是否修改文件 | 典型修改位置 | 备注 |
|---|---|---:|---|---|
| 查看帮助 | `hello-scholar help` | 否 | 无 | 只打印 CLI 用法。 |
| 查看/选择 profile | `hello-scholar profile list` | 可能 | selection state；已安装时同步安装态 | TTY 下是交互选择，非 TTY 下打印列表。 |
| 使用 profile | `hello-scholar profile use <ids>` | 是 | `.hello-scholar/modules.json` 或全局 modules；已安装时同步 prompt/runtime | `<ids>` 可包含 lifecycle 和 support profiles。 |
| 查看状态 | `hello-scholar status [--standby\|--global]` | 否 | 无 | 读取 install state、active change、active experiment、overlay、preferences。 |
| 查看偏好 | `hello-scholar preferences show` | 可能 | `hello-scholar/preferences/user-preferences.yaml` | 若项目偏好不存在，会初始化默认文件。 |
| 安装 standby | `hello-scholar install codex --standby` | 是 | 项目 `.hello-scholar/`；项目 `AGENTS.md` managed block | 只影响当前项目。 |
| 安装 global | `hello-scholar install codex --global` | 是 | `~/.codex/AGENTS.md`；`~/.codex/config.toml`；plugin cache；全局 state | 影响所有 Codex 项目。 |
| 清理安装 | `hello-scholar cleanup codex --standby\|--global` | 是 | 移除 managed block、安装态目录和状态文件 | 只删除 managed 区域。 |
| 研究构思 | `~idea` | 否 | 无 | 零副作用；需要落地时转 `~plan` 或 `~build`。 |
| 结构化规划 | `~plan` | 是 | `hello-scholar/plans/<plan-id>/`；通常也创建 change intent | 生成 requirements/plan/tasks/contract。 |
| 实现/修改 | `~build` 或用户明确要求改 | 是 | 目标代码/文档/配置；`hello-scholar/changes/**`；实验任务写 `experiments/**` | 本次新增文档属于非实验 change。 |
| 验证交付 | `~verify` | 可能 | change verification；experiment runs/evidence/artifacts；state | 需要记录命令、结果和证据路径。 |
| 实验分析 | `~analyze` | 是 | experiment `analysis.md`；可能更新 status | 只在有实验结果/指标/日志时触发。 |
| 经验沉淀 | `~evolve` | 是 | `hello-scholar/evolution/candidates/**` 或 `preferences/candidates/**` | candidate-first，不自动应用。 |

## 当前已知差距清单

| 优先级 | 差距 | 影响 | 建议处理 |
|---|---|---|---|
| P1 | README 未链接本文档。 | 用户不容易发现需求矩阵。 | 在 README 的“开发”或“核心特性”处添加链接。 |
| P1 | `~verify`/`~analyze` 的执行规范主要依赖 agent prompt，自动化端到端样例不足。 | 回归时难证明 agent 是否完整遵守记录规范。 | 增加一个 fixture experiment package 和端到端验证用例。 |
| P2 | `profile list` 的 TTY 交互行为 README 没写清。 | 用户以为只是打印列表。 | README CLI 章节补充说明。 |
| P2 | plugin 描述仍是 bundle 术语。 | marketplace/插件展示与 profile-driven 设计不一致。 | 更新 `.codex-plugin/plugin.json` 描述。 |
| P2 | release dry-run 未进入标准测试。 | 发布包文件缺失或过大不易提前发现。 | 增加 `npm pack --dry-run` 发布检查。 |
| P3 | 多语言 README 文件暂缺。 | npm files 声明与仓库内容不一致，但用户已确认暂缓。 | 后续补 `README.zh-CN.md` / `README.ja-JP.md` 或调整 `package.json`。 |

## 回归检查建议

发布或大改前建议至少运行：

```bash
npm run build:catalog
npm test
npm pack --dry-run
```

涉及安装逻辑时额外检查：

```bash
hello-scholar profile use ml-development
hello-scholar install codex --standby
hello-scholar status --standby
hello-scholar cleanup codex --standby
```

涉及实验记录逻辑时额外检查：

- 创建 experiment package 后确认 `experiment.yaml`、`changes.md`、`runs.md`、`evidence.md`、`analysis.md`、`artifacts.json` 都在同一个 `EXP-*` 目录内。
- 确认 evidence 不写入顶层并行目录。
- 确认 `hello-scholar/changes/INDEX.md` 只做索引，不承载实验主体事实。
