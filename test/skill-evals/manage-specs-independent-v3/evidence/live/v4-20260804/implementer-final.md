已按确认创建 draft Spec：

- 分类：`Create Independent Spec`
- 新文件：`hello-scholar/specs/batch-retrieval/SPEC-010-batch-get-documents/spec.md`
- 内容范围：`POST /v1/documents:batchGet`、最多 100 个 ID、按输入顺序返回、单项缺失不使整批失败、独立灰度/关闭/回滚边界。
- 未创建：Plan、Tasks、代码或 Run。
- 检查：`python3 -m unittest discover -s tests` 通过（1 个测试）。
- `docs sync` 与 runtime artifact cleanup 最初被 Agent 工具权限策略阻止；Eval 主流程随后只执行获批 CLI、清理缓存并完成确定性检查。
