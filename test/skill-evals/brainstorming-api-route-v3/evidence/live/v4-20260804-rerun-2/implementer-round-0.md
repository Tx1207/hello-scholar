已检查指定隔离项目与允许的中文 Skills，确认当前事实：

- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-203000/src/retrieval-service.js` 只有单文档 `getDocument(id)`。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-203000/clients/export-client.js` 当前由客户端逐 ID 聚合，并保留输入顺序。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-203000/test/retrieval-service.test.js` 只覆盖单查和客户端聚合。
- `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260804-203000/hello-scholar/architecture.md` 明确当前不存在批量契约。
- 项目工作区未发生写入；未创建 Spec、Plan、Tasks 或源码变更。

需要先确认一个影响接口与验收的决定：

对于批量入口，是否接受“逐项返回结果、单项可成功/未找到/失败，整体请求仍返回批量响应”，而不是任一文档失败就让整个批量请求失败？

needs input: 请确认批量操作采用部分成功的逐项结果模型，还是采用全有或全无模型。
