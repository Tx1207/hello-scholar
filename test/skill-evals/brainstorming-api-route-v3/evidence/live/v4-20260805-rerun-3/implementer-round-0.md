当前已确认：

- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-000000/src/retrieval-service.js` 只有单文档 `getDocument(id)`，找不到时返回 `null`。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-000000/clients/export-client.js` 当前由客户端逐 ID 聚合，并保留每个输入 ID 的结果顺序。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-000000/test/retrieval-service.test.js` 只覆盖单查和客户端聚合。
- Architecture 明确尚无批量契约；`SPEC-007` 负责副本读一致性，`SPEC-013` 负责租户请求限流，二者都未定义批量响应或部分失败。
- 本轮未修改任何文件，也未创建 Spec、Plan 或 Tasks。

在比较同步批量入口、异步作业和继续客户端聚合之前，需要先确定一个会直接影响公共接口、限流、失败语义与兼容性的边界：

**一次批量请求的限流成本应按“整个请求计一个确定的预算单位”，还是按“请求中的每个文档 ID 分别计费”，还是需要采用其他明确规则？**
