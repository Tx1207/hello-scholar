---
schema: 1
kind: tasks
spec: SPEC-003
spec_revision: 2
plan_revision: 1
revision: 1
approval: pending-review
approved_revision: null
status: pending
created: 2026-08-11
updated: 2026-08-11
---

# Feature Policy Precedence And Deny Rules Tasks

## Phase 1：显式拒绝优先于租户规则和全局默认

- [ ] T001: 以 TDD 方式实现显式拒绝优先级，并保持租户允许规则覆盖全局默认
  - Spec Coverage: AC-1、AC-2；Target Design；Verification
  - Depends On: None
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy.py`
  - Work:
    1. 在 `tests/test_policy.py` 的 `PolicyEngineTests` 中增加显式拒绝、租户允许和全局允许同时存在时返回 `False` 的 focused test，并保留租户规则覆盖全局默认的断言。
    2. 运行 focused test，确认当前 `PolicyEngine` 因尚未检查显式拒绝而失败；不要修改 `evaluate(feature, tenant) -> bool` 的公共调用形式或返回类型。
    3. 在 `src/policy.py` 为 `PolicyRules` 增加由 Plan 指定的全局默认、租户覆盖和显式拒绝数据，并在 `PolicyEngine` 中按“显式拒绝、租户允许/拒绝、全局默认”的固定顺序实现最小判断逻辑。
    4. 运行 focused tests，确认显式拒绝和租户覆盖分支通过；仅在 focused 与完整检查保持通过时整理重复结构，不改变优先级行为。
  - Process: `test-driven-development`
  - Red-Green-Refactor:
    - Red: 在修改生产代码前运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy.PolicyEngineTests.test_explicit_deny_overrides_allowing_rules`，观察显式拒绝用例因现有引擎未检查 deny 而失败。
    - Green: 在 `src/policy.py` 作出最小的 `PolicyRules` 与拒绝优先判断改动，观察 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy.PolicyEngineTests.test_explicit_deny_overrides_allowing_rules tests.test_policy.PolicyEngineTests.test_tenant_rule_overrides_global_default` 通过。
    - Refactor: 只在上述 focused 命令和 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` 均保持通过时整理实现。
    - Signal: focused 测试退出码为 0，完整测试输出 `OK`。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy.PolicyEngineTests.test_explicit_deny_overrides_allowing_rules tests.test_policy.PolicyEngineTests.test_tenant_rule_overrides_global_default`；预期退出码为 0。
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期测试通过且输出 `OK`。
  - Completion:
    - 显式 deny 在租户和全局都允许时返回 `False`，无 deny 时租户规则仍覆盖全局默认。
    - `evaluate(feature, tenant)` 仍接收原有两个参数并返回 `bool`；不得修改 `hello-scholar/architecture.md` 或任何 Plan 明确禁止的路径。

## Phase 2：全局默认和公开兼容性

- [ ] T002: 覆盖无拒绝时的全局默认分支并锁定公开布尔 API 兼容性
  - Spec Coverage: AC-3、AC-4；Source Of Truth；Verification
  - Depends On: T001
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy.py`
  - Work:
    1. 在 `tests/test_policy.py` 中补充没有 deny、没有租户规则时返回全局默认，以及未知 feature 返回既有默认行为的回归断言。
    2. 补充对 `PolicyEngine.evaluate(feature, tenant)` 的现有调用形态和布尔结果的测试，确保新 `PolicyRules` 数据不会向调用方暴露评估细节。
    3. 在 `src/policy.py` 调整 `PolicyRules` 到 `PolicyEngine` 的构造和读取路径，使缺少显式 deny 时使用租户规则后再使用全局默认；不引入持久化或远程配置。
    4. 运行该文件的完整测试，确认 AC-1 至 AC-4 的行为一起通过；若失败，恢复本 Task 中最后一次改动并重新定位到规则读取或测试夹具，而不是扩大范围。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy`；预期全部 `PolicyEngineTests` 通过。
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期退出码为 0 且输出 `OK`。
  - Completion:
    - 没有显式 deny 或租户规则时返回配置的全局默认，未知 feature 保持 `False`，既有布尔调用者无需观察新证据对象。
    - `src/policy.py` 仍只使用内存规则；未修改持久化、网络、打包或 `hello-scholar/architecture.md`。

## Phase 3：兼容构造迁移

- [ ] T003: 建立旧字典构造形式的兼容迁移测试
  - Spec Coverage: AC-4；Migration And Cleanup；Scope Boundary
  - Depends On: T002
  - Parallel: No
  - Files:
    - `tests/test_policy_migration.py`
  - Work:
    1. 新建 `tests/test_policy_migration.py`，按现有 unittest 风格导入 `PolicyEngine` 和 `PolicyRules`，建立覆盖旧字典输入与新规则对象的迁移 fixture。
    2. 增加测试，证明旧字典构造在兼容窗口内仍能对同一 feature/tenant 产生与 `PolicyRules` 一致的布尔结果。
    3. 增加测试输入显式 deny，确认迁移路径不会绕过 deny 优先级；测试只验证 Plan 已确定的兼容行为，不定义新的构造 API。
    4. 运行迁移测试和完整测试，若兼容测试尚未能通过则保留其作为后续迁移门，不删除任何生产分支。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy_migration`；预期迁移测试退出码为 0。
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期输出 `OK`。
  - Completion:
    - `tests/test_policy_migration.py` 可独立证明旧字典构造和 `PolicyRules` 的兼容结果，并覆盖 deny 优先级。
    - 旧兼容构造分支仍存在且未声称清理完成；未修改 Plan 禁止的文件。

- [ ] T004: 将所有测试调用方迁移到 `PolicyRules`
  - Spec Coverage: AC-4；Migration And Cleanup；Scope Boundary
  - Depends On: T003
  - Parallel: No
  - Files:
    - `tests/test_policy.py`
    - `tests/test_policy_migration.py`
  - Work:
    1. 搜索 `src` 和 `tests` 中所有 `PolicyEngine` 字典字面量构造，记录每个调用方及其全局默认、租户规则和 deny 数据形状。
    2. 在 `tests/test_policy.py` 将现有 fixture 改为使用 `PolicyRules`，保持每个测试的 feature、tenant 和预期布尔结果不变。
    3. 将 `tests/test_policy_migration.py` 中用于验证兼容窗口的旧构造调用保留为唯一迁移测试输入，并把其余 fixture 改为 `PolicyRules`。
    4. 运行完整测试和精确搜索，确认迁移后的测试仍通过且只剩计划允许的兼容测试调用方。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期退出码为 0 且输出 `OK`。
    - 运行 `rg -n 'PolicyEngine\(\s*\{' src tests`；预期仅返回明确保留的兼容迁移测试调用（若无匹配则退出码为 1，需结合迁移测试文件检查）。
  - Completion:
    - `tests/test_policy.py` 的正常 fixture 使用 `PolicyRules`，迁移测试清楚隔离仍需兼容的旧字典输入。
    - 所有测试行为保持通过；没有把旧构造形式引入新的生产调用方。

## Phase 4：兼容分支清理

- [ ] T005: 在调用方搜索为空后删除临时字典构造分支
  - Spec Coverage: AC-4；Migration And Cleanup；Scope Boundary
  - Depends On: T004
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy_migration.py`
  - Work:
    1. 在删除前运行 `rg -n 'PolicyEngine\(\s*\{' src tests`，确认没有仍需支持的生产或普通 fixture 调用方，并核对迁移测试已不再依赖该分支。
    2. 从 `src/policy.py` 删除仅服务旧字典输入的临时 `PolicyEngine` 构造分支，保留 `PolicyRules` 构造和 `evaluate(feature, tenant) -> bool`。
    3. 删除或改写 `tests/test_policy_migration.py` 中已完成迁移、仅验证旧分支存在的断言；保留能证明迁移后规则对象行为的回归覆盖。
    4. 运行完整测试和遗留构造搜索；任一检查失败时恢复本 Task 的删除改动并保留兼容分支，不宣称清理完成。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期退出码为 0 且输出 `OK`。
    - 运行 `rg -n 'PolicyEngine\(\s*\{' src tests`；预期无输出且退出码为 1。
  - Completion:
    - 临时字典-only 构造分支已删除，`src` 与 `tests` 中遗留构造搜索为空，规则对象路径仍覆盖所有验收分支。
    - 若搜索或回归失败，兼容分支保持不变；不得删除持久化数据或修改外部接口文件。

## Phase 5：最终回归和回滚证据

- [ ] T006: 完成全套验证并记录可回滚的单变更边界
  - Spec Coverage: AC-1、AC-2、AC-3、AC-4；Final verification and rollback check；Rollback
  - Depends On: T005
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy.py`
    - `tests/test_policy_migration.py`
  - Work:
    1. 在干净的当前工作变更基础上运行完整 unittest，核对显式 deny、租户优先、全局默认、未知 feature 和公开布尔 API 的结果均有测试覆盖。
    2. 运行 Plan 指定的遗留字典构造搜索和 `git diff --check`，确认清理门与空白检查均通过。
    3. 检查 diff 仅包含三个 Plan 允许的源码/测试路径；确认没有 `hello-scholar/architecture.md`、打包、网络或持久化文件变更。
    4. 记录回滚条件：若任一最终检查失败，整体恢复 `src/policy.py`、`tests/test_policy.py` 和 `tests/test_policy_migration.py` 的本次变更，不保留部分迁移或部分清理状态。
  - Validation:
    - 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`；预期退出码为 0 且输出 `OK`。
    - 运行 `rg -n 'PolicyEngine\(\s*\{' src tests`；预期无输出且退出码为 1。
    - 运行 `git diff --check`；预期退出码为 0。
  - Completion:
    - 完整测试输出 `OK`，遗留字典构造搜索为空，`git diff --check` 通过；`evaluate(feature, tenant)` 的两个参数和布尔结果兼容性未回归。
    - 回滚边界明确为三个 Plan 指定文件的整组恢复；没有新增持久化迁移，也没有触碰 Plan 的 Must Not Touch 路径。
