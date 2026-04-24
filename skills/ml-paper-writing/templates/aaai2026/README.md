# AAAI 2026 统一 LaTeX 模板说明

本目录提供一个统一的 AAAI 2026 模板用法说明，重点是帮助你在匿名投稿版和 camera-ready 版之间切换。

## 在线查看

- Overleaf 在线链接：https://cn.overleaf.com/read/wyhcnvcrtpyt#cd4a07

如果只想快速预览、编辑或测试模板，可以直接在 Overleaf 中操作，不必先配置本地 LaTeX 环境。

## 模板概览

当前目录中的统一模板思路是：把 AAAI 2026 的匿名投稿版和 camera-ready 版合并为一套主模板，通过一行条件控制在两种模式之间切换。

统一模板覆盖的内容包括：

- 主要格式说明
- 示例代码与表格
- 图片与参考文献的基本示例
- 主论文与补充材料的模板入口

## 两个版本的核心差异

### 1. 样式加载方式

- 匿名投稿版：`\usepackage[submission]{aaai2026}`
- camera-ready 版：`\usepackage{aaai2026}`

### 2. 标题文字

- 匿名投稿版使用匿名投稿说明标题
- camera-ready 版使用正式排版说明标题

### 3. Links 环境

- 匿名投稿版通常需要禁用或注释掉可能暴露身份的信息
- camera-ready 版可以正常显示相关链接

### 4. 内容块

- 匿名投稿版会额外强调匿名提交要求
- camera-ready 版会补充正式版权和排版信息

## 目录内关键文件

- `aaai2026-unified-template.tex`：统一主论文模板
- `aaai2026-unified-supp.tex`：统一补充材料模板
- `aaai2026.sty`：AAAI 2026 样式文件
- `aaai2026.bst`：参考文献样式
- `aaai2026.bib`：示例参考文献
- `figure1.pdf`、`figure2.pdf`：示例图片

## 如何切换版本

### 切到匿名投稿版

在模板中取消注释这一行：

```latex
\def\aaaianonymous{true}
```

### 切到 camera-ready 版

将这一行注释掉或删除：

```latex
% \def\aaaianonymous{true}
```

## 条件切换机制

统一模板依靠 LaTeX 条件判断控制模式切换，例如：

```latex
\ifdefined\aaaianonymous
    \usepackage[submission]{aaai2026}
\else
    \usepackage{aaai2026}
\fi
```

同样的条件逻辑也可以用于：

- 标题切换
- 匿名信息显示控制
- 某些仅在 camera-ready 出现的内容块

## 补充材料模板

`aaai2026-unified-supp.tex` 用于补充材料，切换方法与主论文模板一致，也适合放置：

- 额外实验结果
- 消融研究
- 数学推导与证明
- 更多图表
- 算法伪代码
- 实现细节
- 数据预处理流程
- 超参数与实验配置

## 使用检查清单

### 投稿前

- 已启用 `\def\aaaianonymous{true}`
- 已去除作者姓名、单位、链接等身份信息
- 已检查参考文献中的自引不会暴露身份
- 已确认主文与补充材料都能正常编译
- 已核对页数、图表、公式和参考文献格式

### 录用后

- 已关闭 `\def\aaaianonymous{true}`
- 已补回作者和单位信息
- 已恢复需要公开的链接
- 已根据审稿意见更新正文和补充材料
- 已检查最终 PDF 质量与提交要求

## 实际建议

1. 投稿阶段优先确保匿名性，不要因为模板切换遗漏身份信息。
2. 录用后切换到 camera-ready 时，同时核对作者信息、acknowledgements 和补充材料。
3. 最好分别在两种模式下各编译一次，确认条件分支都可用。
4. 若移动模板目录，记得同时移动 `.sty`、`.bst`、`.bib` 和示例资源。

## 重要注意事项

`aaai2026.sty` 通常已经处理了 `\bibliographystyle{aaai2026}`，因此正文里不要重复再写一遍，否则可能触发：

```text
Illegal, another \bibstyle command
```

一般只需要正常使用：

```latex
\bibliography{aaai2026}
```

## 编译示例

```bash
pdflatex aaai2026-unified-template.tex
bibtex aaai2026-unified-template
pdflatex aaai2026-unified-template.tex
pdflatex aaai2026-unified-template.tex
```

## 版本信息

- 模板版本：AAAI 2026 Unified
- 支持模式：Anonymous Submission / Camera-ready
- 覆盖内容：Main Paper Template + Supplementary Material Template
- 推荐环境：LaTeX 2020+ / TeX Live 2024+
