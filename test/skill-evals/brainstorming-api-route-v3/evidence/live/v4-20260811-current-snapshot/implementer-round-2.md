## manage-specs 分类：`Create Independent Spec`

依据：

- `SPEC-013` 只负责请求预算，明确不定义单项与批量响应合同。
- `SPEC-007` 只负责副本读取一致性，明确不负责请求基数、部分失败或批量响应形状。
- 同步批量逐项结果具有独立的公共接口、验证、兼容迁移和回滚边界，因此不是现有 Spec 的更新，也不是继任 Spec。
- 异步作业和客户端聚合属于同一批量检索问题的候选方案与权衡，不应拆成不同 Spec 身份。

依据 Stable Identity Test，拟定 canonical 路径为：

```text
hello-scholar/specs/batch-retrieval/SPEC-014-public-batch-retrieval-api/spec.md
```

其中：

- Topic：`batch-retrieval`
- Spec ID：`SPEC-014`
- 设计名：`public-batch-retrieval-api`

项目保持零写入。请明确确认以上**完整路径**后，我才会创建该 Spec 的 draft。
