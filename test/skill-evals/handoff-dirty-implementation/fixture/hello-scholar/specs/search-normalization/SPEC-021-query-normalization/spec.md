---
schema: 1
kind: spec
id: SPEC-021
title: 统一搜索查询规范化
topic: search-normalization
type: capability
status: accepted
revision: 2
summary: 在分词前统一大小写、空白和常见排版破折号。
created: 2026-07-29
updated: 2026-07-31
supersedes: []
superseded_by: null
---

# SPEC-021：统一搜索查询规范化

## 1. 问题

语义相同的大小写、Unicode 空白和排版破折号会产生不同查询 token。

## 2. 目标

在现有 `normalize_query()` 入口内完成 NFKC、case-fold、空白折叠和破折号映射。

## 3. 非目标

语言分词、拼写纠正和同义词扩展不在范围内。

## 4. 当前状态

NFKC 和空白折叠已经存在；case-fold 和破折号映射尚未完成。

## 5. 目标设计

按 NFKC、case-fold、破折号映射、空白折叠的固定顺序处理。

## 6. 实施边界

只修改规范化函数和聚焦测试。

## 7. 接口

保留 `normalize_query(value: str) -> str`。

## 8. 约束

非字符串仍抛出 `TypeError`，处理必须幂等。

## 9. 决策

常见 Unicode dash punctuation 统一映射成 ASCII `-`。

## 10. 验收标准

- AC-1：查询执行 Unicode case-fold。
- AC-2：em dash 与 en dash 映射为 `-`。
- AC-3：既有 NFKC、空白和类型错误行为不回归。

## 11. 验证

运行完整 `unittest`。

## 12. 迁移与清理

没有持久数据迁移或兼容分支。

## 13. 回滚

同时回滚源码和测试改动。

## 14. 证据

证据由当前 Tasks 实施产生。

## 15. Revision 历史

- Revision 2：接受 case-fold 和破折号顺序。
