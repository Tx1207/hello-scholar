# Existing Ranking Sonnet v3 Baseline Implementer Final Reply

已完成纯文档更新，未修改实现代码。

- 将 `SPEC-001` 升级至修订 3，明确：
  - 完整短语精确匹配的权重必须严格高于普通词项匹配；
  - 语义回退仅在 `intent_score >= 0.68` 时生效；
  - `rank_documents` 公开入口、`list[str]` 返回结构及 `SPEC-004` 多样性策略均保持不变。
- 已用指定 `docs sync` 命令刷新文档索引：
  - `/tmp/hello-scholar-eval-manage-specs-existing-v3-baseline-20260804-1146/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-manage-specs-existing-v3-baseline-20260804-1146/hello-scholar/specs/search-ranking/INDEX.md`
- 已运行完整 Python 测试：`python3 -m unittest discover -s tests -v`，2/2 通过。
- 已检查最终差异范围和空白错误：仅上述两个索引及规格文件被修改，`src/ranking.py` 和测试源码未变。

主要设计记录：
`/tmp/hello-scholar-eval-manage-specs-existing-v3-baseline-20260804-1146/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`

result: 已记录短语优先与 0.68 语义回退门槛，并刷新索引、验证实现行为未改。
