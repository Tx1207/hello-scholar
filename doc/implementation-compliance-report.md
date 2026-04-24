# hello-scholar 实施符合性报告

生成日期：2026-04-24

本报告对照 `doc/experiment-development-runtime-prd.md` 与 `doc/experiment-development-runtime-implementation-design.md`，记录当前实现状态和后续缺口。

## 1. 已符合或基本符合

| 需求 | 状态 | 证据 |
|---|---|---|
| 默认主线为科研代码项目开发 | pass | `AGENTS.md` 将默认主线定义为 `ml-development`；`catalog/profiles.json` 将 `ml-development` 标为 base。 |
| 六个生命周期 profile | pass | `catalog/profiles.json` 包含 `research-ideation`、`ml-development`、`paper-writing`、`paper-self-review`、`submission-rebuttal`、`post-acceptance`。 |
| 实验分析合并入 ML 实验开发 | pass | `ml-development` 描述包含实验分析；`scripts/project-prompt.mjs` 的生命周期状态已合并为六阶段。 |
| standby/global 安装互斥 | pass | `cli.mjs` 阻止同一项目 global 与 standby 共存；不同项目 standby 可共存。 |
| 全局共享层路径 | pass | `scripts/cli-config.mjs` 默认 `~/plugins/hello-scholar/.hello-scholar/`；README、AGENTS、prompt 文案已同步。 |
| global cleanup 不删除共享层目录 | pass | `scripts/cli-codex.mjs` 只清理安装态和受管插件根，保留 `~/plugins/hello-scholar/.hello-scholar/`。 |
| Preference candidate-first | pass | `scripts/preferences-store.mjs` 支持 candidate 写入；`AGENTS.md` 明确不得自动 apply。 |
| Skill evolution candidate-first | pass | `skills/commands/evolve/SKILL.md` 和 evolution scripts 保持 candidate/review/apply 分离。 |
| AGENTS 不维护完整静态 skill 目录 | pass | `AGENTS.md` 只保留技能分层说明，具体选择由 catalog/profile 解析。 |

## 2. 已部分实现

| 需求 | 状态 | 当前实现 | 缺口 |
|---|---|---|---|
| 集中式 experiment package | partial | `scripts/experiment-store.mjs` 创建 `experiment.yaml`、`README.md`、`changes.md`、`runs.md`、`evidence.md`、`analysis.md`、`artifacts.json`。 | `change-tracker` 尚未自动把实验 change 主体写入 experiment package。 |
| experiment evidence | partial | `scripts/evidence-store.mjs record --experiment-id <id>` 可写入 experiment package；`delivery-gate --experiment-id <id>` 可读取 experiment evidence。 | 非实验 plan evidence 仍保留顶层 `hello-scholar/evidence/<target-id>/` 兼容路径。 |
| status | partial | `hello-scholar status` 展示安装态、profile、active experiment、experiment count、project/global preferences 路径。 | 尚未展示 active change、overlay resolver 详情、standby/global 双侧冲突矩阵。 |
| profile-first CLI | partial | help/README 只推荐核心入口：install、cleanup、profile list/use、preferences show、status。 | `list`、`doctor`、`update`、`activate` 仍作为兼容命令存在，未从代码删除。 |
| skills 按 profile 分类 | partial | 新增 `skills/core/README.md` 与 `skills/profiles/*/PROFILE.md`。 | 物理 skill 文件夹尚未迁移到 `skills/core/` 或 `skills/profiles/`；catalog 仍指向平铺 canonical skills。 |
| 全局 overlay skill | partial | catalog-loader 可读取 `~/plugins/hello-scholar/.hello-scholar/overlays/skills/` 并覆盖同名 skill。 | 尚未实现统一 `scripts/overlay/resolve.mjs`，也未提供 overlay 状态报告。 |

## 3. 仍缺失，建议后续阶段实现

| 需求 | 状态 | 建议 |
|---|---|---|
| 所有实质修改强制创建 change | missing | 增加 delivery gate 检查 diff 是否有 active change；必要时接入 hook 或 route command 自动调用 `change-tracker`。 |
| 实验相关修改自动创建/关联 experiment | missing | 在 `~build` 或 `track-intent` 层根据请求、route、文件类型、active/recent state 判断是否创建或复用 experiment。 |
| experiment-aware change tracker | missing | 给 `change-tracker` 增加 `--experiment-id`，实验 change 主体写 `experiments/<id>/changes.md`，顶层 `changes/INDEX.md` 只保留索引引用。 |
| 完整 state 统一 | partial | 合并 `STATE.md`、`active.json`、`recent.json` 的职责，写入 active change、active experiment、profile、route/tier、下一步和阻塞项。 |
| Preference evolution 触发链路 | partial | `writePreferenceCandidate` 已存在，但还需要由 closeout、`~evolve` 或用户“记住这个偏好”触发 candidate 生成。 |
| Overlay resolver | missing | 实现 built-in/profile/global overlay/project override/global preferences/project preferences 的统一解析器，并让 status 展示解析结果。 |
| 严格 schema validator | missing | 为 `experiment.yaml` 增加 validator，避免后续更新依赖字符串替换。 |

## 4. 当前边界决定

- 顶层 `hello-scholar/evidence/<target-id>/` 不再用于实验事实，但保留为非实验 plan/delivery gate 兼容路径。
- `list`、`doctor`、`update`、`activate` 不再是推荐用户入口，但本轮不删除实现，避免破坏已有测试和用户脚本。
- `skills/core/` 与 `skills/profiles/` 第一阶段作为 manifest 和能力边界说明；物理迁移 skill 文件夹属于后续重构。
- 全局共享层中的 preferences、overlay skills、evolution candidates 是用户长期资产；global cleanup 不应删除这些资产。
