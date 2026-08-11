# Experiment Routing Automatic Activation Successor Proposal 审核

- Status: `completed-invalid-verifier`
- Batch ID: `activation-routing-v2`
- Batch SHA-256: `sha256:c7dd941ca85173c968962e6b770700ba3cd1963cd770c6b05e6a9ffef0cd5fb8`
- Manifest: [`eval-activation-proposal-batch-v2.json`](./eval-activation-proposal-batch-v2.json)
- Scope: `1` 个 fresh Haiku successor formal automatic-activation Probe。
- Run state at review creation: 未启动 successor Probe，未创建 `activation-result.json` 或 `evidence/`，未消费 v2 Fixture 的 one-launch sentinel。
- Execution authorization: 用户的 standing continuous-execution authorization 与已批准实施计划绑定到本 Batch；它只授权执行，不接受尚未产生的 Probe 输出。

## 根因与修复边界

v1 已证明 `record-experiment` 通过真实 Skill catalog 在正式命令前成功触发，且正式命令只运行一次。其 `runs/INDEX.md` 缺失来自 Eval harness 的权限表达：runner 只允许 `node <absolute-cli> docs check|sync`，而 fresh 主 Agent 使用具有 shebang 且 mode 为 `100755` 的 `<absolute-cli> docs check|sync`，等价命令在执行前被权限门拒绝。

本 successor runner 仅增加以下四条精确 allow 规则，不增加通用 `Bash(node *)`、`Bash(*)` 或仓库级 Write：

- `node <absolute-cli> docs check`
- `node <absolute-cli> docs sync`
- `<absolute-cli> docs check`
- `<absolute-cli> docs sync`

产品 `record-experiment` 与 `using-helloscholar` Skill 不因该 harness 缺口继续修改。

## 不可变输入

- Scenario: `record-auto-formal-v2/scenario.md` = `a8acab82f98b7588ef9b10f36121747a97f9afafc3a475473f959b7ce12d6002`
- Protocol: `record-auto-formal-v2/protocol.json` = `6da79916d621b6eac6961b63b386f55765e25ac7c212e1d5a5d9742e006f7f1c`
- Fixture: `record-auto-formal-v2/fixture` = `69321cbe58d76f3f61143625f3330b4995d85576e852c46ad45f4258babf4d9e`
- Runner: `run_activation_probe_v2.py` = `a8572970903a133f4e51d65c2d4165ab955718a33c36703f98b48455e61cb3f4`
- `using-helloscholar` Skill tree = `3de502204b1649a2f547d77c87cb43295b91de45d0382641d9c896b6f7fbae74`
- `record-experiment` Skill tree = `e3e31fbcd9d5cf2bcdbe9c6192fcb1edf4aab18fe4538849edd90080907588f2`
- Model: `claude-haiku-4-5-20251001`

## 批准语义

批准顶部 Batch ID 和 Batch SHA-256，只授权使用 fresh main-Agent session 严格执行一次这个 successor Probe。它不允许重跑或改写 v1，不授权修改 Skill，也不代表接受尚未产生的结果。

通过必须同时满足：成功 `record-experiment` Skill tool result 位于正式命令前；正式命令只启动一次；Record 事前存在；raw stdout/stderr、exit status 与 metrics 一致；绝对 docs CLI 成功生成 `runs/INDEX.md`；evaluator verification exit `0`。

## 实际执行结果

v2 raw runner result 为 `pass`，并真实证明绝对 docs CLI 权限修复有效：`runs/INDEX.md` 已生成，正式 Python 进程只有一个成功启动，Run artifact verifier 输出 `formal-run-valid`。但该 raw result 不能作为产品通过证据：Fixture Base 未预生成现有 Spec Index，`docs sync` 额外创建 `hello-scholar/specs/INDEX.md` 与 `hello-scholar/specs/cache-admission/INDEX.md`，违反 Protocol 的 `paths.deny`；v2 verifier 未检查 Git delta，未拒绝该越界写入。

v2 one-launch sentinel 已消费，不重跑、不改写 raw `activation-result.json` 或 evidence。后续 v3 successor 必须预同步 Base Spec Index，并在 runner 内硬检成功 launch 数与最终路径 delta。
