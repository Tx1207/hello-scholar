分类：`Create Independent Spec`

依据：

- `SPEC-013` 只负责租户请求预算，并明确不定义单请求与批量响应契约。
- `SPEC-007` 只负责副本读取一致性，并明确不负责 HTTP 请求基数、部分失败或批量响应形状。
- 同步批量检索具有独立的公共接口、逐项结果与重试不变量，可独立批准、实施、验证和回滚。
- 异步作业与客户端聚合是同一能力的候选方案和取舍，不应拆成不同 Spec 身份。
- 全局现有最大 Spec 编号为 `013`，因此新身份使用 `014`；新 Topic 使用最窄能力边界 `batch-retrieval`，设计名为跨方案稳定的公共能力名称 `public-batch-retrieval-api`，不把“同步”写入身份。

拟定 canonical 路径：

```text
hello-scholar/specs/batch-retrieval/SPEC-014-public-batch-retrieval-api/spec.md
```

稳定身份测试通过：ID、Topic、设计名分别有现有 Spec 边界、Architecture/调用方事实和授权 identity 资产支持。

请确认是否绑定以下完整身份后再创建 draft Spec：

```text
hello-scholar/specs/batch-retrieval/SPEC-014-public-batch-retrieval-api/spec.md
```
