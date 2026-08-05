分类：**Create Independent Spec**

依据：
- `hello-scholar/architecture.md` 明确当前只有单文档查找，且没有批量路由。
- `SPEC-002` 明确不负责 lookup request shape、batch limits、partial failures 或 endpoint rollout。
- `SPEC-009` 明确只负责 tracing，不负责 route semantics、batch behavior 或 error contracts。
- 新请求拥有独立的公共协议与生命周期边界：最多 100 个 ID、按输入顺序返回、单项缺失不使整批失败，并可独立灰度与关闭。因此可独立批准、实施、验证、灰度和回滚。

拟建完整 canonical 路径：

`hello-scholar/specs/batch-retrieval/SPEC-010-public-batch-retrieval-api/spec.md`

已完成只读 `docs check`，结果为 `errors 0`，并确认 `git status` 无改动。根据规则，需先获得对该完整身份（ID、Topic、设计 slug 和路径）的明确确认；在确认前不创建 Spec、不写入文件。

result: 建议将该请求归类为 Create Independent Spec，路径为 `hello-scholar/specs/batch-retrieval/SPEC-010-public-batch-retrieval-api/spec.md`，现停在创建确认门。
