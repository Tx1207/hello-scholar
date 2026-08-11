---
schema: 1
kind: tasks
spec: SPEC-014
spec_revision: 3
plan_revision: 2
revision: 1
approval: pending-review
approved_revision: null
status: pending
created: 2026-08-11
updated: 2026-08-11
---

# Complete The JSON V2 Profile Migration Tasks

## Phase 1：迁移准备与兼容性证明

- [ ] T001: 建立可回滚的双读迁移准备工具与兼容性证明
  - Spec Coverage: AC-1, AC-2, AC-3, AC-6; Plan Phase 1; Plan Scope Add (`src/migrate-config.js`, `test/migration.test.js`)
  - Depends On: None
  - Parallel: No
  - Files:
    - `src/migrate-config.js`
    - `test/migration.test.js`
    - `src/config-store.js`
    - `src/cli.js`
  - Work:
    1. 在 `src/migrate-config.js` 实现 `migrate` 的 `--dry-run` 与 apply 输入解析，扫描传入 profile directory 的 `.properties`/`.json` 文件，并使用现有 `readConfig`/`writeConfig` 生成规范 `{version: 2, endpoint, retries}`；保持 `config/migration-state.json` 的 `phase: dual-read` 与 `allowLegacyRead: true`。
    2. 实现每个 legacy source 的备份、临时 JSON 写入与重读比较、原子 rename、SHA-256 manifest 记录及逐文件错误恢复；失败时删除未安装的临时 target、保留或恢复 source，并在 manifest/state 未完成前不删除 active source。
    3. 在 `src/cli.js` 暂时加入 `migrate <profiles-dir> --dry-run [--backup-dir]` 入口，并在 `test/migration.test.js` 用临时目录覆盖双读等价、dry-run 无写入、成功前失败保留 source/backup、损坏输入不改变 active profiles 或 backups 的行为；不得移除 `--legacy-output` 或 legacy writer。
  - Validation:
    - 运行 `node --test test/config-store.test.js test/migration.test.js`；预期 exit `0`，legacy 与 JSON canonical-read、dry-run、失败保护测试通过。
    - 运行 `node src/cli.js migrate config/profiles --dry-run --backup-dir .migration-backup`；预期 `planned=1 current=1 errors=0`，且 `git diff -- config .migration-backup` 为空。
  - Completion:
    - 迁移命令可在独立临时目录 dry-run 或 apply，失败不会改变 active legacy source、backup 或 dual-read state，且兼容 reader 仍能读取 `.properties` 与 `.json` 为相同 canonical object。
    - `src/legacy-writer.js`、`--legacy-output`、legacy codec 与 `config/migration-state.json` 的 dual-read 开关仍存在；不得创建 `.pyc` 或 `__pycache__`。

## Phase 2：双读窗口内应用转换

- [ ] T002: 应用 east profile 转换并留下可验证的迁移证据
  - Spec Coverage: AC-1, AC-3, AC-6; Plan Phase 2; Plan Scope Add (`config/profiles/east.json`, `.migration-backup/east.properties`, `config/migration-manifest.json`)
  - Depends On: T001
  - Parallel: No
  - Files:
    - `config/profiles/east.properties`
    - `config/profiles/east.json`
    - `.migration-backup/east.properties`
    - `config/migration-manifest.json`
  - Work:
    1. 使用已完成的 `src/cli.js migrate` 对 `config/profiles` 执行 apply，先把 `config/profiles/east.properties` 原始字节复制到 `.migration-backup/east.properties`，再写入并重读临时 JSON target，比较 canonical object 后原子安装 `config/profiles/east.json`。
    2. 仅在 target、canonical comparison 与 SHA-256 manifest entry（source path、target path、source/target hashes、canonical values）持久化成功后删除 active `east.properties`；保持 `config/migration-state.json` 为 dual-read。
    3. 重新执行同一 apply 命令并记录幂等结果；若任一步失败，删除未安装临时 target、恢复 source、保持 dual-read state，并停止而不进入 cutover。
  - Validation:
    - 运行 `node src/cli.js migrate config/profiles --backup-dir .migration-backup`；预期 `migrated=1 current=1 errors=0`，`east.json` 是 exact JSON v2，backup 字节与原始 `east.properties` 相同，manifest 存在一条对应记录。
    - 再运行同一命令；预期 `migrated=0 current=2 errors=0` 且相对首次成功结果无新增 diff。
    - 运行 `node --test test/config-store.test.js test/migration.test.js`；预期 exit `0`，双读与迁移/幂等/损坏输入保护通过。
  - Completion:
    - `config/profiles/east.json` 与 `west.json` 均为 exact JSON v2，`east.properties` 已在证据持久化之后移除，backup 与 manifest 保留，state 仍是 `phase: dual-read`、`allowLegacyRead: true`。
    - 任意失败恢复后 source 可被兼容 reader 读取，未留下未安装 `.tmp.json`，且未执行 cutover。

## Phase 3：切换门

- [ ] T003: 证明所有 active profiles 可切换到 JSON-only
  - Spec Coverage: AC-4, AC-6; Plan Phase 3; Plan Rollback Gate
  - Depends On: T002
  - Parallel: No
  - Files:
    - `src/migrate-config.js`
    - `src/cli.js`
    - `test/migration.test.js`
    - `config/migration-state.json`
  - Work:
    1. 在 `src/migrate-config.js` 实现 cutover verification：递归扫描 active profiles 的 `.properties`、检查每个 manifest target 存在，并通过 `readConfig` 重读每个 target 与 manifest canonical values 比较。
    2. 在 `src/cli.js` 暂时加入 `verify-cutover <profiles-dir> --manifest <path>`，仅当 `legacy=0 targets=<manifest count> mismatches=0 errors=0` 时写入 `phase: json-only`、`allowLegacyRead: false`；任何失败不得改变 state。
    3. 在 `test/migration.test.js` 建立三个隔离失败夹具：保留一个 `.properties`、删除一个 manifest target、篡改 target canonical value；分别断言非零退出和 state 仍为 dual-read，再断言全绿 gate 才允许 JSON-only。
  - Validation:
    - 运行 `node src/cli.js verify-cutover config/profiles --manifest config/migration-manifest.json`；预期 `legacy=0 targets=1 mismatches=0 errors=0`，并且 state 精确变为 `phase: json-only`、`allowLegacyRead: false`。
    - 运行 `node --test test/migration.test.js`；预期三个失败夹具均非零且不改变 state，全绿夹具才改变 state。
  - Completion:
    - 切换 state 只由全绿验证写入；active scan、manifest target existence 与 canonical comparison 任一失败均保留 dual-read，并保留可恢复的 source/backup/manifest。
    - T003 不删除 writer、flag、codec 或 properties reader；cleanup 前仍可回滚至 dual-read。

## Phase 4：精确删除旧路径

- [ ] T004: 在切换与回滚证据齐全后删除全部 legacy persistence 路径
  - Spec Coverage: AC-5, AC-6; Plan Phase 4; Plan Scope Modify/Delete; Plan Rollback Gate
  - Depends On: T003
  - Parallel: No
  - Files:
    - `src/config-store.js`
    - `src/cli.js`
    - `src/legacy-writer.js`
    - `package.json`
    - `package-lock.json`
    - `vendor/legacy-properties-codec/package.json`
    - `vendor/legacy-properties-codec/index.js`
    - `test/config-store.test.js`
    - `test/cli.test.js`
  - Work:
    1. 仅在 `config/migration-manifest.json`、`.migration-backup/east.properties`、JSON-only state 与可恢复 cleanup release 都存在时，从 `src/config-store.js` 移除 properties branch、legacy codec import 与 `writeLegacyConfig` import，并从 `src/cli.js` 移除 `--legacy-output` 解析、传递和 help 文本。
    2. 删除 `src/legacy-writer.js` 与两个 vendored codec 文件，精确移除 `@fixture/legacy-properties-codec` 的 `package.json` 与 `package-lock.json` 条目；保留 migration/restore 对 legacy evidence 的必要定位逻辑。
    3. 更新 `test/config-store.test.js` 与 `test/cli.test.js`，断言 JSON v2 读写正常、unsupported `.properties` 输入清晰失败、旧 flag 被拒绝；若 prerequisite 或测试失败，恢复本 Task 的 cleanup/cutover 代码与 dependency，state 回到 dual-read，保留 active/backup legacy profile。
  - Validation:
    - 运行 `rg -n 'writeLegacyConfig|legacyCodec|legacyOutput|legacy-output|legacy-properties-codec' src/config-store.js src/cli.js package.json package-lock.json`；预期 exit `1` 且无旧 reader、writer、flag、import、dependency 匹配。
    - 运行 `test ! -e src/legacy-writer.js && test ! -e vendor/legacy-properties-codec`；预期 exit `0`。
    - 运行 `npm test`；预期 exit `0`，JSON read/write、JSON-only state、unsupported legacy input、removed flag 与 package cleanup 测试通过。
  - Completion:
    - 旧 writer、flag、reader branch、codec dependency 与 vendored files 均不存在，JSON-only public CLI 与 migration/restore 可验证；不得删除 `.migration-backup/east.properties` 或 `config/migration-manifest.json`。
    - Cleanup 失败时可恢复 cleanup/cutover release 并回到 dual-read；成功后才允许最终回归与 rollback drill。

## Phase 5：最终回归与回滚验证

- [ ] T005: 完成 JSON-only 最终回归矩阵并保存迁移证据
  - Spec Coverage: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6; Plan Phase 5
  - Depends On: T004
  - Parallel: No
  - Files:
    - `test/config-store.test.js`
    - `test/cli.test.js`
    - `test/migration.test.js`
    - `config/migration-state.json`
    - `config/migration-manifest.json`
  - Work:
    1. 将已保存的 focused command 输出作为 mixed-format、dry-run、successful/idempotent migration、corrupt-input preservation 与三个 cutover failure gates 的回归证据，并在本 Task 的记录中逐项标注对应命令与结果。
    2. 在 JSON-only 结果运行完整测试，覆盖 JSON read/write、CLI output、cutover state、unsupported legacy input、removed flag 与 package cleanup；检查 manifest target 和 backup 仍可供 rollback。
    3. 核对所有 active profiles 无 `.properties`、所有 manifest targets 存在且 canonical values 匹配，避免以测试通过替代数据 gate。
  - Validation:
    - 运行 `npm test`；预期 exit `0`，完整 JSON-only regression matrix 全部通过。
    - 运行 `find config/profiles -type f -name '*.properties' -print`；预期无输出；再运行 `node src/cli.js verify-cutover config/profiles --manifest config/migration-manifest.json`；预期 `legacy=0 targets=1 mismatches=0 errors=0`。
  - Completion:
    - AC-1 至 AC-6 的测试与命令证据均可追溯，primary worktree 保持 JSON-only、manifest 与 backup 不被删除；回归失败时不得继续删除证据，应恢复 cleanup/cutover 并回到 dual-read。

- [ ] T006: 在隔离 Git worktree 完成 post-cleanup rollback drill
  - Spec Coverage: AC-6; Plan Phase 5; Plan Rollback Gate
  - Depends On: T005
  - Parallel: No
  - Files:
    - `.migration-backup/east.properties`
    - `config/migration-manifest.json`
    - `config/migration-state.json`
    - `config/profiles/east.properties`
    - `config/profiles/east.json`
    - `src/config-store.js`
    - `src/cli.js`
    - `src/legacy-writer.js`
    - `package.json`
    - `package-lock.json`
    - `vendor/legacy-properties-codec/package.json`
    - `vendor/legacy-properties-codec/index.js`
  - Work:
    1. 在 cleanup result 创建临时 Git worktree，不修改 primary worktree；在该 worktree 先恢复 cleanup/cutover release，使 legacy reader、writer、flag 与 codec 可用，再保留 migration manifest 与 backup。
    2. 在隔离 worktree 运行 `node src/cli.js restore config/profiles --manifest config/migration-manifest.json --backup-dir .migration-backup`，恢复 `config/profiles/east.properties`，把 state 改回 `phase: dual-read`、`allowLegacyRead: true`，并确认 JSON/legacy canonical output 一致。
    3. 运行保存的 phase 1 mixed-format suite；若 restore 或验证失败，仅清理该临时 worktree，保留 primary worktree 的 JSON-only result、backup 与 manifest，报告失败证据而不修改 primary。
  - Validation:
    - 在临时 worktree 运行 `node src/cli.js restore config/profiles --manifest config/migration-manifest.json --backup-dir .migration-backup`；预期 `restored=1 errors=0`。
    - 运行 `node --test test/config-store.test.js test/migration.test.js`；预期 exit `0`，恢复的 `east.properties` canonical output 与 `east.json` 等价，state 为 dual-read。
    - 检查 primary worktree 的 `git status --short`；预期除已审阅的 Tasks/CLI 索引外无 rollback drill 写入。
  - Completion:
    - rollback 证明 cleanup/cutover 必须先恢复代码与 dependency，再恢复数据与 dual-read state；backup 和 manifest 在 rollback drill 通过前始终保留。
    - primary worktree 未被 rollback drill 改写，且 drill 失败不会伪造通过信号或删除任何恢复材料。
