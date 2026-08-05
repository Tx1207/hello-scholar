当前事实已确认：`RetrievalService` 只有单文档 `getDocument(id)`，`ExportClient.collect(ids)` 负责客户端聚合并按 ID 保留结果；目前没有批量公共契约。正式设计前需要明确一个接口决策：

批量请求是否必须保持输入 ID 的顺序，并为重复 ID 返回重复结果（即结果与输入逐项对应），还是允许服务端去重并按文档 ID 返回唯一结果？
