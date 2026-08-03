# T073：为 Router 与 Framework E2E 固定正式实验的事前 Record 和 exactly-once 证据

- Status: `completed`
- PR: `PR 0 / PR 5 / PR 7 - Eval 与实验闭环`
- Depends On: T071, T072, T077
- Parallel: Yes。脚本和 Fixture 可与纯文档修正并行；Proposal Hash 必须最后统一刷新。

## 为什么要做

`router-experiment` 和 Framework E2E 都要求“正式实验先建最小可复现 Record，只启动一次”，但原 Fixture 只有 rubric 文字，没有不可绕过的过程证据。一个 Agent 可以先跑 Benchmark、事后补 Record，甚至重复运行后只保留最后一份结果，静态合同仍可能全绿。

这个 Task 把顺序和次数变成进程自己留下的事实：正式进程启动时读取已存在 Record，保存当时 Hash，并用独占 sentinel 拒绝第二次启动。它只为两个真实项目 Fixture 固定验收行为，不新增通用 Runner、后台服务或产品 `testing-skills`。

## 与原 `record-experiment` 中间状态的比较

修改前 Skill 同时出现“启动前建最小记录”和“先启动再写记录”的冲突句，无法稳定区分正式实验与低风险探索。已批准 Plan 的目标合同是：

- 正式、昂贵、长时间或不可逆实验在启动前创建最小可复现 Record；
- 低风险、隔离且可丢弃的探索可以先启动，但在结论、依赖工作、合并、分享或会话结束前补齐；
- 运行中不做高频文档维护，结束后一次补齐结果、结论和下一步。

本 Task 只覆盖两个“正式实验”场景，因此必须走第一条。探索例外仍由独立 `record-exploration-backfill` case 验证，不能被这里的 wrapper 扩大或取消。

## 文件边界

### Modify

- `test/skill-evals/router-experiment/scenario.md`
- `test/skill-evals/router-experiment/protocol.json`
- `test/skill-evals/router-experiment/fixture/docs/benchmark-campaign.md`
- `test/skill-evals/router-experiment/fixture/scripts/benchmark.mjs`
- `test/skill-evals/router-experiment/fixture/scripts/verify-run.mjs`
- `test/skill-evals/framework-e2e-paged-cache-v2/scenario.md`
- `test/skill-evals/framework-e2e-paged-cache-v2/protocol.json`

### Add

- `test/skill-evals/framework-e2e-paged-cache-v2/fixture/scripts/run_formal_benchmark.py`
- `test/skill-evals/framework-e2e-paged-cache-v2/fixture/scripts/verify_formal_run.py`

### Must Not Modify

- 历史 `test/skill-evals/framework-e2e-paged-cache/` 目录
- 生产 `record-experiment` Skill；它由 T034 单独负责
- Benchmark 算法、数据集、测试输入和用户项目公共 API
- 任何真实 Baseline/Scorecard/evidence

## Router 正式命令

Protocol 固定三条命令，其中 Benchmark 本身不能省略：

```text
node --test
node scripts/benchmark.mjs --run-dir runs/<run-id> > runs/<run-id>/outputs/benchmark.json
node scripts/verify-run.mjs runs/<run-id>
```

`benchmark.mjs` 在计算前完成：

1. 验证参数严格为 `runs/<run-id>`，路径没有逃逸。
2. 读取 `record.md`，确认其中写有本次完整命令。
3. 计算事前 Record SHA-256。
4. 以 exclusive create 写 `.launch-sentinel`；已存在时在任何 Benchmark 计算前失败。
5. 把命令、启动时间和事前 Record Hash 同时写入 sentinel 与 raw output。

Verifier 核对 Record 终态、raw/structured metrics、sentinel 三方一致，并真实尝试第二次启动；重复尝试必须被 sentinel 拒绝。

## Framework E2E 正式命令

新增固定 wrapper：

```text
python3 -B scripts/run_formal_benchmark.py --run-dir runs/<run-id> --blocks 24 --request-blocks 6
```

Wrapper 在子 Benchmark 前验证 Record、命令和产物目录，保存事前 Hash，独占创建 sentinel，并将原始 stdout 与结构化 metrics 分开保留。Verifier 检查 Record 在结束后完成终态更新、两份结果一致，再进行一次必须失败的重复启动探针。

所有新增或修改的 Python/JavaScript 具名函数必须在函数体第一处说明 `Purpose / Input / Output`，并按实际行为补充 `Errors / Side effects`。

## 非计时关键路径边界

这两个 wrapper 是关键路径守卫，不是计时器，也不要求 Agent 在启动前写完整报告。正式运行只需先具备最小可复现 Record、预期产物目录和一次性身份；结果、观察、结论和下一步在进程结束后一次补齐。Reviewer 依据 Record 事前 Hash、exclusive sentinel、命令、产物和交互顺序判断流程，不使用授权到启动秒数或暂停计数作质量门。

## 验证

- 在临时 Fixture 副本中按固定命令准备最小 Record 并运行 Router verifier，预期 `run-evidence-valid`
- 在临时 Fixture 副本中运行 Framework wrapper/verifier，预期 `formal-paged-cache-run-valid`
- 两个场景分别删除事前 Record、改命令、复用同一 Run ID 或篡改 raw metrics，验证必须失败
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`
- `git diff --check`

临时 smoke 只验证确定性 Fixture 脚本，不创建 Eval Agent，不写 Baseline，也不代表 Skill 质量通过。

## 完成标准

- 两个正式场景的 Protocol 都把真实 Benchmark 命令列入 `commands`。
- 进程证据能证明 Record 先存在、正式 Benchmark 只启动一次、原始与结构化结果来自同一启动。
- 非关键文档没有进入正式启动前的必要关键路径。
- 历史 v1 未改变，pending Proposal 在用户批准前未运行。
