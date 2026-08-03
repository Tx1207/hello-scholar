# T072：把 Eval 运行证据绑定到获批命令、消息顺序和 Prompt 隔离

- Status: `completed`
- PR: `PR 0 - Skill Eval 基础设施修正`
- Depends On: T068, T069, T070
- Parallel: No。必须先稳定 Protocol v2 Schema；完成后才能重算 Proposal Hash 或运行任何 Baseline。

## 为什么要做

Protocol v2 已经把命令、多轮回复和 Prompt 投影写进 Hash，但原静态校验只证明“运行记录里有一些命令和证据”，没有证明运行的就是获批命令，也没有证明后续消息是在前一停点之后才发送。这样会出现两类假阳性：用任意成功命令替代真正的验收命令，或把未来批准提前塞给 Implementer 后仍写出一份看似完整的 Scorecard。

这个 Task 补的是运行证据链，不修改任何产品 Skill。目标很直接：用户批准了哪组命令和消息，未来 Baseline/Live 记录就只能证明那一组实际发生过。

## 与原合同的比较

| 原合同 | 本 Task 后 |
|---|---|
| 只要求命令文本非空、退出码存在 | v2 命令数量、顺序和原始模板逐项等于 `protocol.commands` |
| 模板里的 `<run-id>` 可以被整条命令替换 | 另存 `executedCommand`，只允许替换尖括号占位符；重复占位符必须解析为同一值 |
| 多轮消息只在 Protocol 中受 Hash 绑定 | 每轮运行证据保存消息 Hash、实际 Prompt Hash、停点是否观察到以及是否在前一停点后投递 |
| Prompt 隔离是文字约定 | 每次运行都要给出三项不可见事实和对应证据 |
| Fixture tree hash 忽略常见运行垃圾 | Hash 仍保持稳定，但 Proposal Fixture 中一旦出现这些文件就直接判合同无效 |

## 文件边界

### Modify

- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`
- `test/skill-evals/WORKFLOW.md`
- 所有尚未运行的 `test/skill-evals/*/protocol.json`
- 对应仍为 pending 的 `proposal-approval.json`，仅在全部输入稳定后刷新 Hash
- T001、T002、T068 和 Task 导航中与运行证据相关的说明

### Must Not Modify

- `test/skill-evals/framework-e2e-paged-cache/` 的历史 Protocol v1 输入、Baseline 和 evidence
- 任何生产 Skill、CLI、安装目录或外部项目
- 尚未真实运行的 `baseline.json`、`scorecard.json` 或 evidence 占位文件

## v2 命令记录

Baseline 和 Scorecard 的每一项命令使用同一结构：

```json
{
  "command": "node scripts/run.mjs --run-dir runs/<run-id>",
  "executedCommand": "node scripts/run.mjs --run-dir runs/20260801-1200-case-s0",
  "exitCode": 0,
  "evidence": []
}
```

`command` 必须逐字等于相同索引的 Protocol 模板。`executedCommand` 可以把 `<...>` 换成当次真实值，但不能增加 flag、删除参数、换程序或调整顺序；模板中同名占位符出现两次时，两处解析值相同。Protocol 没有占位符时，两字段必须完全相同。

Protocol v1 继续按旧结构只读验证，不回写 `executedCommand`，也不借兼容逻辑创建新运行。

## v2 交互记录

每次运行新增：

```json
{
  "interaction": {
    "rounds": [
      {
        "sender": "user",
        "contentRole": "current-request",
        "messageSha256": "<sha256>",
        "promptSha256": "<sha256>",
        "stopConditionObserved": true,
        "deliveredAfterPreviousStop": null,
        "evidence": []
      }
    ],
    "promptProjection": {
      "rawScenarioVisibleToImplementer": false,
      "rawProtocolVisibleToImplementer": false,
      "futureRoundsVisibleToImplementer": false,
      "evidence": []
    }
  }
}
```

首轮 `messageSha256` 对应 Scenario 的原始用户请求；后续轮对应获批 Protocol 中的逐字 `message`。第 2 轮起，`deliveredAfterPreviousStop` 必须为 true，并由证据证明前一轮 stop condition 已出现。`pass` 和 `control-pass` 必须完成全部获批轮次；`fail` 可以保存从首轮开始的真实连续前缀，不能跳轮或伪造未发送消息。

Prompt Hash 绑定实际发送给 Implementer 的完整安全投影。证据必须能检查原始 Scenario、完整 Protocol 和未来消息没有进入 Prompt；只写三个 false 而没有证据无效。

## Fixture 运行垃圾

`sha256_tree` 继续忽略环境产生的缓存，以免跨平台 Hash 无意义波动；但 Proposal 的 `fixture/` 本身不得包含 `__pycache__/`、`.pyc`、`.pyo`、`.DS_Store` 或 `.hello-scholar-install.json`。校验器在计算并核对 Hash 之外单独遍历并拒绝这些节点，避免“被 Hash 忽略”变成批准后的隐形输入。

## 实施步骤

1. 先为命令数量、顺序、模板替换、重复占位符、消息 Hash、停点顺序、Prompt 隔离和 Fixture 垃圾写失败测试，确认旧校验器为 Red。
2. 在校验器中实现 v2 分支；所有新增或修改的具名函数在函数体第一处写 `Purpose / Input / Output`，存在读文件或报错时补充副作用/错误。
3. 把当时 39 个 pending Protocol 的 `skillExpectations` 和运行证据说明迁到当前结构；历史 v1 不动。T078 随后删除四个 no-auto case、增加两个显式价值 case，当前批次为 37 项。
4. 更新 Workflow 和 owner Task，使后续 Agent只读合同即可生成相同结构。
5. 所有 Scenario/Protocol/Fixture 语义稳定后，再由 Proposal owner 一次刷新 pending Approval Hash。

## 验证

- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_function_contract_comments.py'`
- 对任意一个生成式 fixture 删除命令、交换命令、篡改消息 Hash、提前标记第二轮或放入 `.pyc`，静态合同必须失败
- 对历史 v1 目录复算内嵌 Hash，确认仍自洽且字节未变化
- `git diff --check`

这些验证只读本地合同或使用临时目录，不启动 subagent、Baseline、网络或外部 API。

## 完成标准

- v2 的每条命令都能追溯到获批模板和真实执行值。
- v2 的每轮消息都能追溯到获批文本、前一停点和实际 Prompt。
- 运行记录能证明答案隔离，而不是只声称隔离。
- Fixture 中没有不受 Hash 约束的运行产物。
- 历史 v1 保持只读；T078 调整后的当前 37 个 v2 Proposal 仍为 pending，用户批准前没有任何真实 Eval 运行。
