# hello-scholar 实施符合性报告

生成日期：2026-04-25

本报告对照 `doc/experiment-development-runtime-prd.md` 与 `doc/experiment-development-runtime-implementation-design.md`，审计当前 `hello-scholar` 的实现状态。当前版本是全新版本，不兼容旧项目；旧功能已按确认结果删除、迁移或收敛。

## 1. 当前实现摘要

当前仓库已经完成 hello-scholar 科研 runtime 的核心架构收口：默认 base profile 是 `ml-development`，六个科研生命周期 profile 已定义，profile 直接声明 skills/agents，支持多个 active profiles 叠加；standby/global 安装互斥已实现；正式 CLI 保持最小入口；experiment package 是实验事实唯一来源；顶层 legacy evidence 写入已删除；统一机器可读状态入口 `hello-scholar/state/runtime.json` 已接入；legacy `helloagents` / `hello-*` skills 的有价值内容已迁入 canonical skills 后删除；scripts 已迁入目标分层目录。

当前 catalog 状态：

- `catalog/profiles.json`：6 个 lifecycle profiles，直接声明 `skills` / `agents`。
- `catalog/skills.json`：56 个真实 skills。
- `catalog/agents.json`：15 个 agents。
- `catalog/bundles.json`：已删除。
- 真实 skill 物理目录：`skills/core/`、`skills/research/`、`skills/development/`、`skills/writing/`、`skills/review/`、`skills/submission/`、`skills/post-acceptance/`、`skills/memory/`、`skills/meta/`。
- `skills/profiles/` 只保留 profile manifest，不复制 skill 本体。
- `skills/commands/` 只保留 `idea`、`plan`、`build`、`verify`、`analyze`、`evolve` 六个核心命令壳。
- `skills/helloagents/` 与 `skills/hello-*`：已删除。

最近验证：

- `npm run build:catalog` 通过。
- `npm test` 通过，55/55 passing。

## 2. 已符合

| 需求 | 状态 | 证据 |
|---|---|---|
| 科研代码项目开发优先 | pass | `AGENTS.md` 默认主线为 `ml-development`，围绕 change、experiment、run、evidence、analysis。 |
| 六个 lifecycle profiles | pass | `catalog/profiles.json` 包含构思、ML 实验开发、论文写作、自审、投稿/Rebuttal、录用后处理。 |
| `ml-development` 是 base/default profile | pass | profile 解析采用 `baseProfile=ml-development`，默认 `activeProfiles=['ml-development']`。 |
| 多 active profiles 叠加 | pass | `profile use <profile-id> [...profile-id]`、`modules.json.activeProfiles`、selection 解析与测试已覆盖。 |
| 彻底移除 bundle schema | pass | `catalog/bundles.json` 删除；catalog loader、selection state、prompt、tests 不再使用 bundle 作为概念。 |
| profile-first CLI | pass | CLI 只暴露 `install`、`cleanup`、`profile list/use`、`preferences show`、`status`。 |
| standby/global 安装互斥 | pass | 同一项目不能同时安装 standby/global；不同项目 standby 可共存；global cleanup 保留共享层。 |
| canonical skill 目录 | pass | 真实 skills 按能力域组织；profile manifest 不复制 skill。 |
| legacy hello-agents skill 删除 | pass | `helloagents` 与 `hello-*` 内容迁入 canonical skills 后删除。 |
| command skills 最小化 | pass | 删除旧 `auto/clean/commit/help/init/loop/prd/test/wiki` 命令壳。 |
| experiment package 唯一实验事实源 | pass | evidence、delivery gate、research-store 默认围绕 `hello-scholar/experiments/EXP-*`。 |
| 删除顶层 evidence 写入 | pass | `evidence-store` 拒绝 legacy top-level target；delivery gate 只接受 experiment evidence。 |
| 统一 runtime state | pass | 新增 `hello-scholar/state/runtime.json`，experiment/change/profile/status 路径已接入。 |
| Preference Evolution candidate-first | pass | preference candidate 生成不自动 apply。 |
| Skill Evolution candidate-first | pass | review/apply/merge 分离，apply 需要显式 approval，默认写 overlay。 |
| scripts 目标分层 | pass | install/profile/preferences/evolution/overlay 等已迁入分层目录。 |
| npm scripts 最小化 | pass | `package.json` 保留 `build:catalog`、`test`、`postinstall`。 |

## 3. 当前边界

| 主题 | 当前处理 | 后续可深化 |
|---|---|---|
| experiment schema | 已有 centralized package 与 MLflow/W&B/Hydra 风格核心字段。 | 增强 schema validation、run/env/seed/dataset/metric history 的结构化索引。 |
| experiment-aware change | 实验 change 可镜像到 experiment package；顶层 change/index 仍保留。 | 可进一步让实验 change 主体只写 experiment package，顶层只做索引。 |
| runtime state | `runtime.json` 是统一机器入口；旧 `STATE.md`、`active.json`、`recent.json` 保留派生/兼容输出。 | 后续可完全删除旧状态文件或改为纯人类摘要。 |
| scripts 分层 | 高影响 install/profile/preferences/evolution/overlay 已迁移；部分状态和实验脚本仍在 `scripts/*.mjs`。 | 可继续细分 `scripts/experiment/`、`scripts/change/`、`scripts/state/`。 |
| global shared evolution CLI | 暂不考虑。 | 后续如需要再设计显式同步/提升命令。 |

## 4. 已删除的旧功能

| 旧功能 | 当前处理 |
|---|---|
| `catalog/bundles.json` | 已删除。 |
| bundle-based selection state | 已删除，改为 `activeProfiles`。 |
| `hello-scholar list bundles|skills|agents` | 已删除；profile list 是唯一列表入口。 |
| `hello-scholar doctor` | 已删除；状态检查并入 `hello-scholar status`。 |
| `hello-scholar update` / `activate` / `uninstall` | 已删除兼容别名。 |
| install selection flags | 已删除正式选择路径；安装只使用当前 profile selection。 |
| 旧 command skills | 已删除 `auto/clean/commit/help/init/loop/prd/test/wiki`。 |
| `skills/helloagents/` 与 `skills/hello-*` | 已迁移有价值内容并删除。 |
| 顶层 evidence 写入目标 | 已删除；legacy target 会拒绝。 |
| `research-store` 第二套实验事实 | 已拒绝旧写入命令，改为 experiment package 派生视图。 |

## 5. 验证结果

```bash
npm run build:catalog
npm test
```

结果：55/55 tests passing。
