# Text Normalizer Whitespace Defect

## 项目背景

这是一个无第三方依赖的 Python 文本规范化库。公开函数 `normalize_text(value)` 被搜索摘要调用，调用方式和返回类型必须保持不变。现有测试通过，但问题记录说明从网页复制的文本中，连续空格、Tab 和换行没有都被折叠成一个 ASCII 空格。

## 原始用户请求

搜索摘要里复制进来的文字有时会留下连续空格和换行。请直接修好这个问题，补上能复现的测试，并把相关测试跑完。不要改变 `normalize_text()` 的调用方式。

## 项目约束

- `docs/issues/whitespace-normalization.md` 给出了复现输入和预期输出。
- 只允许修改文本规范化实现及其测试。
- 不添加依赖或平行实现。
