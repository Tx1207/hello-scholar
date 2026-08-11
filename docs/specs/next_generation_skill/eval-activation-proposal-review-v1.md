# Experiment Routing Automatic Activation Proposal 审核

- Status: `pending-user-review`
- Batch ID: `activation-routing-v1`
- Batch SHA-256: `sha256:e1279c8ed9642226552ca7dab4fc121f0de66b8d872bb8751bb08db0e3b4934a`
- Manifest: [`eval-activation-proposal-batch-v1.json`](./eval-activation-proposal-batch-v1.json)
- Scope: `2` 个 Haiku 自动激活探针，分别验证大实验自动触发和小实验不触发。
- Run state at review creation: 未启动任何 Haiku probe，未创建 `activation-result.json` 或 `evidence/`。
- Execution status: `completed-mixed-results`

## 审核边界

批准顶部 Batch ID 和 Batch SHA-256，仅授权严格串行执行这两个已绑定的 Claude Code plugin catalog probe。它不授权继续修改 Skill，不重标历史 Formal Eval，不代表接受尚未产生的运行结果。

以下任何内容变化都使批准失效：Scenario、Protocol、Fixture、共享 runner、进入 catalog 的 `using-helloscholar` 或 `record-experiment` Skill tree、manifest。

## 共享不可变输入

- Model: `claude-haiku-4-5-20251001`
- Runner: [`test/skill-activation-evals/run_activation_probe.py`](../../../test/skill-activation-evals/run_activation_probe.py) = `1ebfa74e6d8716a849ee0eaa39345f44f5f67378a604a8b5c2b8d2cc5717fb53`
- `using-helloscholar` Skill tree = `3de502204b1649a2f547d77c87cb43295b91de45d0382641d9c896b6f7fbae74`
- `record-experiment` Skill tree = `e3e31fbcd9d5cf2bcdbe9c6192fcb1edf4aab18fe4538849edd90080907588f2`
- Catalog: isolated `claude-code-plugin-catalog`
- Activation evidence: actual `Skill` tool event in `stream-json`; prompt text mentioning the Skill does not count.

## 01. `record-auto-formal-v1`

- Proposal ID: [`proposal-record-auto-formal-v1`](../../../test/skill-activation-evals/record-auto-formal-v1/proposal-approval.json)
- Expected activation: `invoked`
- User boundary: 完整 baseline release-acceptance Benchmark，只能运行一次，并保留 raw stdout、raw stderr、退出状态、结构化 metrics 和结论。
- Scenario SHA-256: `594d0d9ae444b453f9c21374ea1b114b8951d71e4001ddd2e04a265577f71057`
- Protocol SHA-256: `6fed930e959f4268f2d856656571c2b2a02f65d5f689177cc9d3eabadd06af02`
- Fixture SHA-256: `69321cbe58d76f3f61143625f3330b4995d85576e852c46ad45f4258babf4d9e`
- Pass boundary: `record-experiment` 的真实 `Skill` event 出现在 Benchmark 命令前；Record 事前存在；命令只启动一次；raw stdout/stderr、exit status 和 metrics 真实一致。

## 02. `record-auto-small-v1`

- Proposal ID: [`proposal-record-auto-small-v1`](../../../test/skill-activation-evals/record-auto-small-v1/proposal-approval.json)
- Expected activation: `not-invoked`
- User boundary: 低风险本地 parser smoke check，只看 stdout，不保存证据、不改项目、不作为研究结论。
- Scenario SHA-256: `df9cab4424afba618923b79e4c14a4005865ea9dd6662966312973a23f78fcea`
- Protocol SHA-256: `960304c276b96789baf16d00ef36f51fb808b05e5c560db5a59a739222ccbe16`
- Fixture SHA-256: `3bf4948d45b9e7edce1cc0ce6833c18d344e765f87f12f73e4517260e8e2f214`
- Pass boundary: 没有 `record-experiment` 的 `Skill` event；不创建 Run/Record/Index/结果文件；不要求用户分类；只报告临时 stdout 观察。

## 实际执行结果

### `record-auto-formal-v1`: `fail`

- record-auto-formal-v1 result SHA-256: `sha256:a2bbb3475bd0a0302d79454b219f9edf9885bec918077a64a00c076d35f1278a`
- 自动路由成立：`using-helloscholar` 与 `record-experiment` 均有成功 `Skill` tool result，且 `record-experiment` 先于正式命令。
- 正式命令成功且仅执行一次；raw stdout、raw stderr、process-start、metrics 与 terminal Record 均生成，Fixture 内 verifier 最终输出 `formal-run-valid`。
- 测量结果为有效负结果：`hit_rate=0.4166666666666667 < 0.45`，因此不通过 release acceptance。
- Probe 总体按合同记为 `fail`：被测会话未成功执行要求的绝对 `node <hello-scholar-repo>/bin/hello-scholar.js docs check` / `docs sync`，未生成 `runs/INDEX.md`，evaluator verification exit code 为 `1`。
- formal one-launch 已消费；不得重跑 formal Probe 补齐 Index 或掩盖该失败。

### `record-auto-small-v1`: `pass`

- record-auto-small-v1 result SHA-256: `sha256:97c4f4d886e66968b4f47f7dc6129cdcc92dbe6057198d74eb4059830ba10898`
- `using-helloscholar` 成功调用，`record-experiment` 未调用。
- `node scripts/check-policy.mjs` 有成功 `tool_result`，stdout 为 `policy-parse-valid rules=2`。
- evaluator verification exit code 为 `0`；Fixture Git clean，未创建 Run、Record、Index 或其他项目文件。

## 证据边界

两份 active `activation-result.json` 绑定各自 `evidence/` 中每个文件的 SHA-256；静态合同重新计算并验证这些 Hash。历史 transient、权限和 harness attempts 保留在 `attempts/`，不覆盖 active 结果，也不重标为 Skill 通过或失败。
