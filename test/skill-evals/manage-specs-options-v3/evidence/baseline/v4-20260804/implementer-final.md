已在隔离项目完成请求：

- 阅读了 `AGENTS.md`、当前架构、SPEC-003 设计文档、实现和测试文件。
- 仅修改设计文档 `hello-scholar/specs/cache-policy/SPEC-003-cache-eviction-policy/spec.md`：
  - 记录候选 A：LRU + TTL
  - 记录候选 B：segmented LRU
  - 记录候选 C：TinyLFU admission + LRU eviction
  - 增加命中率、未命中率、淘汰率、延迟、内存、抗扫描性等比较指标
  - 明确“等压测后决定”，未选择任何方案
- 使用绝对路径 CLI 刷新索引：
  - `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs sync`
  - 更新了两个生成的 `INDEX.md`
- 运行检查：`npm test`，1 个测试通过。
- 未修改运行时代码、包元数据或测试；当前已停在文档和索引刷新后的停止点。
