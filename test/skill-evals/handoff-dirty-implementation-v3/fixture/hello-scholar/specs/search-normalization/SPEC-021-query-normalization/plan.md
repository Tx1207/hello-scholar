---
schema: 1
kind: plan
spec: SPEC-021
spec_revision: 2
revision: 1
status: approved
title: 查询规范化实施方案
summary: 串行完成 case-fold 和排版破折号映射，并保留现有入口。
created: 2026-07-31
updated: 2026-07-31
---

# 查询规范化实施方案

先完成 case-fold 并验证既有行为，再增加破折号测试和映射。两个阶段修改同一函数，不能并行。禁止新增第二个规范化入口或兼容模式。
