# Experiment Routing Scope-Verified Activation Proposal 审核

- Status: `completed-pass-pending-user-review`
- Batch ID: `activation-routing-v3`
- Batch SHA-256: `sha256:942adb3156f43be47593b53bfeea7028e284c45afdabe0d53f93bb75635f8944`
- Manifest: [`eval-activation-proposal-batch-v3.json`](./eval-activation-proposal-batch-v3.json)
- Scope: `1` 个 fresh Haiku scope-verified formal automatic-activation Probe。
- Run state at review creation: 未启动 v3 Probe，未创建 `activation-result.json` 或 `evidence/`，未消费 v3 Fixture 的 one-launch sentinel。
- Execution authorization: 用户批准 v3 scope-verified 修复计划，并以 standing continuous-execution authorization 绑定本 Batch；执行授权不接受尚未产生的输出。

## 为什么需要 v3

- v1：真实 Skill prelaunch activation 与单次正式进程成立，但 runner 权限只允许一种 CLI 拼写，导致 docs 命令被拒绝、`runs/INDEX.md` 缺失。
- v2：修复了等价 CLI 权限并生成 Run Index，但 Fixture Base 缺少已有 Spec Index；`docs sync` 越界补写两个 `hello-scholar/specs/**/INDEX.md`，而 v2 verifier 未检查 Git delta，产生不可采纳的 raw false positive。
- v1、v2 的 one-launch evidence 都已消费，保持原始字节，不重跑、不重标。

## v3 可执行硬门

v3 Fixture Base 已在独立 Git root 中运行绝对 `docs sync` 与 `docs check`：`hello-scholar/specs/INDEX.md` 和 Topic Index 都已纳入 Base 且为 Current，Base 没有 Run。

v3 runner 在判定 `pass` 前必须同时验证：

1. 只有一个 matching non-error 正式 Bash result；shell redirection 在进程启动前失败不计为 launch，第二个成功 launch 直接失败。
2. 至少一个成功的精确 absolute `docs sync` 调用。
3. evaluator artifact verifier 输出 `formal-run-valid`。
4. evaluator-owned absolute `docs check` 成功，`runs/INDEX.md` 为 Current，任何 Index 都不是 Missing 或 Stale。
5. NUL-delimited Git porcelain 中每个 changed path 都位于 `runs/`；`hello-scholar/specs/`、源码、测试、配置和其他路径变化直接失败。

## 不可变输入

- Scenario = `4acebe2e1e1f30066bd9c2bf5e91106ee64f37ddeb26c061db12d46acf9c26f9`
- Protocol = `e56ffdd7f4e863cfbf9850cb976bee3bb8e88ba46d052fd498b8f3a7fb6af279`
- Clean Fixture = `a6ff57ba8d566162dcbeb5229072819c908b130b65e3395c513af850c0c4bf93`
- Runner = `3967a8f838163322ea9282e4b5dba5164283a65a6c2d3d38192444b85dac9ee3`
- `using-helloscholar` = `3de502204b1649a2f547d77c87cb43295b91de45d0382641d9c896b6f7fbae74`
- `record-experiment` = `e3e31fbcd9d5cf2bcdbe9c6192fcb1edf4aab18fe4538849edd90080907588f2`
- Model = `claude-haiku-4-5-20251001`

批准顶部 Batch ID 与 SHA-256 只授权 fresh v3 Probe 执行一次，不接受尚未产生的输出，也不授权改动产品 Skill 或历史 evidence。

## 实际执行结果

- Canonical result: `pass` / `sha256:5f5ba865465404a47dd378301cf9695b59af5ee05cd3faf73ef51eca6e4fadad`
- `record-experiment` 有 matching non-error Skill result，且位于正式命令前。
- `successfulLaunchCount: 1`；一次同文命令在 shell redirection 阶段因目录不存在失败，Python benchmark 未启动，不计为 launch。
- `successfulDocsSyncCount: 3`；最终 evaluator-owned docs check 显示三个 Index 全部 Current。
- `scopeValid: true`；Git delta 的 8 个路径全部位于 `runs/`，没有 Spec、源码、测试、配置或 bytecode 变化。
- Artifact verifier 输出 `formal-run-valid`，`verificationExitCode: 0`；raw stdout/stderr、exit status、metrics、Record 和 Run Index 均已保留。
- 结果等待用户统一审核；执行授权不自动接受该输出。
