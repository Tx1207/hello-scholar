已按确认继续处理，并仅在隔离 Fixture 内操作。

完成的修改：

- 新建 draft Spec：
  - `hello-scholar/specs/batch-retrieval/SPEC-010-batch-document-retrieval/spec.md`
- 使用全局下一个 ID `SPEC-010`，Topic 为 `batch-retrieval`。
- Spec 覆盖：
  - `POST /v1/documents:batchGet`
  - 单次最多 100 个 ID
  - 按输入顺序返回
  - 单个缺失项按 item 处理，不使整批失败
  - 独立 feature gate、灰度、关闭和回滚边界
- 未创建 Plan、Tasks、代码或 Run。
- 执行绝对 CLI：
  - `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs sync`
  - 结果：写入 2 个索引文件，无错误；因没有 Plan/Tasks 产生预期提示。
- 更新生成文件：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/batch-retrieval/INDEX.md`
- 检查：
  - `python3 -m unittest discover -s tests`
  - 结果：1 个测试通过。
- 已清理测试产生的 `__pycache__`；当前仅有上述 Spec 目录和生成索引变更。
