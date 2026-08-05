已检查隔离项目事实，未修改任何项目文件：

- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-191500/src/retrieval-service.js` 当前仅提供单文档 `getDocument(id)`，找不到文档返回 `null`。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-191500/clients/export-client.js` 由客户端逐个调用并聚合结果。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-191500/test/retrieval-service.test.js` 目前只覆盖单查及客户端保留每个输入 ID 的结果。
- 当前 Architecture 明确没有批量契约；`SPEC-007` 不负责批量响应或部分失败，`SPEC-013` 不负责单次与批量接口契约。

需要先确认一个会直接影响三种方案取舍的问题：

**批量导出是否必须在一次同步请求中返回完整结果，还是允许异步作业（含创建、查询状态、获取结果的独立生命周期）作为正式公共接口？**

needs input: 请确认批量导出的同步/异步产品约束后，我再比较方案。
