# T074：让 Index 二次同步同时证明内容和文件 metadata 零变化

- Status: `completed`
- PR: `PR 2 / PR 5 - 文档内核与维护 Skill`
- Depends On: T007, T039
- Parallel: Yes。只修改 Index 场景的确定性 verifier，可与其他隔离 Task 并行。

## 为什么要做

`docs-maintenance-index` 原 verifier 在第二次 `docs sync` 前后只比较文件 SHA-256。即使 CLI 每次都重写相同字节、改变 mode 或 mtime，它仍会报告“幂等”。对用户来说这会造成无意义的文件触碰、增量构建和同步开销，也与“第二遍零变化”的 rubric 不一致。

本 Task 不改变 Index 内容规则，只把已经承诺的幂等性检查做实。

## 与原做法比较

| 原 verifier | 本 Task 后 |
|---|---|
| 比较路径和 bytes SHA-256 | 对每个普通文件比较 bytes SHA-256、file mode 和纳秒 mtime |
| 相同内容的重复覆写看不出来 | 任一重复覆写都会因 mtime 变化失败 |
| 输出只说明 changed paths | 明确给出第一遍三个生成 Index、第二遍空列表 |

## 文件边界

### Modify

- `test/skill-evals/docs-maintenance-index/fixture/scripts/verify-index-idempotence.mjs`
- `test/skill-evals/docs-maintenance-index/protocol.json` 中与 verifier/证据对应的 criterion 或命令说明，如当前文字不准确
- 对应 pending Approval 的 Fixture/Protocol Hash，最后统一刷新

### Must Not Modify

- `src/index-generator.js` 或生产 CLI，除非独立 T007/T008 的真实测试证明生产行为有错
- Fixture 中的核心文档、源码和手写项目规则
- 其他 Skill 场景、历史运行证据或产品 Skill

## 实施细节

1. `snapshotFile(filePath)` 返回一个稳定指纹，包含文件 bytes SHA-256、`stats.mode` 和 `stats.mtimeNs`。
2. Tree snapshot 拒绝 symlink 和特殊节点，路径统一为 POSIX 相对路径并排序。
3. 第一遍同步只允许三个 canonical `INDEX.md` 的指纹变化；任何核心文档或源码变化都失败。
4. 紧接着运行第二遍同步，所有路径的完整指纹必须完全相同，CLI 输出也必须为 `written 0, deleted 0, errors 0`。
5. 新增或修改的具名函数在函数体第一处写 `Purpose / Input / Output`，有文件读取、临时目录或异常时补 `Errors / Side effects`。

## 验证

- `node test/skill-evals/docs-maintenance-index/fixture/scripts/verify-index-idempotence.mjs <absolute-cli-path>`
- 预期输出中 `firstSyncChanged` 只有三份 Index，`secondSyncChanged` 为 `[]`
- 临时把第二遍改成覆写相同 bytes，验证 mtime 门会失败
- `node --test test/test_index_generator.js test/test_cli_docs.js`
- `git diff --check`

验证使用临时 Fixture copy 和本地 CLI，不启动 Agent、网络、Baseline 或 Live Eval。

## 完成标准

- “第二遍零变化”同时覆盖内容、mode 和纳秒 mtime。
- 第一遍的允许写入仍严格只有三份生成 Index。
- Verifier 输出可直接被 Reviewer 和用户理解，不需要读脚本猜结论。
- Proposal Hash 绑定当前 verifier bytes，批准前保持 pending。
