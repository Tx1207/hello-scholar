# Router Fast Path: Text Normalizer Bug

## 项目背景

这是一个无第三方依赖的 Python 文本规范化库。公开函数 `normalize_text()` 已被搜索摘要调用，当前接口稳定。现有测试全部通过，但真实 Bug 报告显示，从网页复制的文本包含连续空格、Tab 或换行时，输出仍可能保留多余空白。项目规则把这种局部实现修复归为普通维护，不要求设计文档。

## 原始用户请求

搜索摘要里复制进来的文字有时会留下连续空格和换行。请直接修好这个问题，补上能复现的测试，并把相关测试跑完。不要改变 `normalize_text()` 的调用方式。

## 当前状态与目标 Skill

- 当前代码和既有测试可运行，Bug 报告位于 `docs/issues/whitespace-normalization.md`。
- 目标 Skill 是 `using-helloscholar`，应选择 Fast Path。
- 当前主 Agent直接定位、修复并验证；本请求没有显式指定 TDD。
- 不进入 Brainstorm、Spec、Plan、Tasks、Record、Architecture 或 Handoff 流程。

## 允许范围

- `src/text_normalizer.py`
- `tests/test_text_normalizer.py`

## 预期产物

- 一个保持公开函数签名不变的最小实现修复。
- 一个覆盖连续空格、Tab 和换行的回归测试。
- 当前单元测试的真实输出和退出码。

## 禁止产物

- 新增或修改 `hello-scholar/`、`runs/`、Spec、Plan、Tasks、Record 或 Architecture。
- 调用 `brainstorming`、`test-driven-development` 或已淘汰的执行/Review Skill。
- 新增依赖、平行实现或改变公开函数签名。

## 验证与交互

初始验证命令为 `python3 -m unittest discover -s tests`。实现后再次运行同一命令，并检查核心文档改动数为 0。本场只有用户首轮请求，没有未来批准回复。
