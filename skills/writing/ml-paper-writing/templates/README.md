# ML/AI 会议 LaTeX 模板说明

这个目录收录了常见 ML/AI 会议的 LaTeX 模板，便于在论文写作阶段直接选用官方或接近官方的模板骨架。

---

## 如何把 LaTeX 编译成 PDF

### 方案 1：VS Code + LaTeX Workshop（推荐）

**环境准备：**

1. 安装 [TeX Live](https://www.tug.org/texlive/)。
   - macOS：`brew install --cask mactex`
   - Ubuntu：`sudo apt install texlive-full`
   - Windows：从 [tug.org/texlive](https://www.tug.org/texlive/) 下载
2. 在 VS Code 中安装扩展 **LaTeX Workshop**。

**基本用法：**

- 在 VS Code 中打开任意 `.tex` 文件
- 保存文件后触发自动编译
- 或使用 `Cmd/Ctrl+Alt+B` 手动 build
- 用 `Cmd/Ctrl+Alt+V` 打开 PDF 预览

**推荐设置**（写入 VS Code `settings.json`）：

```json
{
  "latex-workshop.latex.autoBuild.run": "onSave",
  "latex-workshop.view.pdf.viewer": "tab",
  "latex-workshop.latex.recipes": [
    {
      "name": "pdflatex → bibtex → pdflatex × 2",
      "tools": ["pdflatex", "bibtex", "pdflatex", "pdflatex"]
    }
  ]
}
```

### 方案 2：命令行

```bash
# 基础编译
pdflatex main.tex

# 含参考文献的标准流程
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex

# 使用 latexmk 自动处理依赖
latexmk -pdf main.tex

# 持续编译
latexmk -pdf -pvc main.tex
```

### 方案 3：Overleaf

1. 打开 [overleaf.com](https://www.overleaf.com)
2. 新建项目并上传对应模板目录的 ZIP
3. 在线编辑与编译
4. 适合不想本地配置 LaTeX 的场景

### 方案 4：其他 IDE

| IDE | 扩展/插件 | 说明 |
|-----|-----------|------|
| Cursor | LaTeX Workshop | 用法与 VS Code 接近 |
| Sublime Text | LaTeXTools | 生态成熟 |
| Vim/Neovim | VimTeX | 适合键盘驱动工作流 |
| Emacs | AUCTeX | 功能完整 |
| TeXstudio | 内置 | 独立 LaTeX IDE |
| Texmaker | 内置 | 跨平台 |

### 常见编译问题

**找不到文件：**

```bash
cd templates/icml2026
pdflatex example_paper.tex
```

**参考文献没有出现：**

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

**缺少宏包：**

```bash
tlmgr install <package-name>
```

如果频繁遇到缺包，直接安装完整 TeX 发行版通常更省时间。

---

## 可用模板

| Conference | 目录 | 年份 | 来源 |
|------------|------|------|------|
| ICML | `icml2026/` | 2026 | [Official ICML](https://icml.cc/Conferences/2026/AuthorInstructions) |
| ICLR | `iclr2026/` | 2026 | [Official GitHub](https://github.com/ICLR/Master-Template) |
| NeurIPS | `neurips2025/` | 2025 | 社区模板 |
| ACL | `acl/` | 2025+ | [Official ACL](https://github.com/acl-org/acl-style-files) |
| AAAI | `aaai2026/` | 2026 | [AAAI Author Kit](https://aaai.org/authorkit26/) |
| COLM | `colm2025/` | 2025 | [Official COLM](https://github.com/COLM-org/Template) |

## 使用示例

### ICML 2026

```latex
\documentclass{article}
\usepackage{icml2026}  % submission
% \usepackage[accepted]{icml2026}  % camera-ready

\begin{document}
% Your paper content
\end{document}
```

关键文件：

- `icml2026.sty`：样式文件
- `icml2026.bst`：参考文献样式
- `example_paper.tex`：示例文档

### ICLR 2026

```latex
\documentclass{article}
\usepackage[submission]{iclr2026_conference}
% \usepackage[final]{iclr2026_conference}

\begin{document}
% Your paper content
\end{document}
```

关键文件：

- `iclr2026_conference.sty`
- `iclr2026_conference.bst`
- `iclr2026_conference.tex`

### ACL 系列会场（ACL / EMNLP / NAACL）

```latex
\documentclass[11pt]{article}
\usepackage[review]{acl}
% \usepackage{acl}

\begin{document}
% Your paper content
\end{document}
```

关键文件：

- `acl.sty`
- `acl_natbib.bst`
- `acl_latex.tex`

### AAAI 2026

```latex
\documentclass[letterpaper]{article}
\usepackage[submission]{aaai2026}
% \usepackage{aaai2026}

\begin{document}
% Your paper content
\end{document}
```

关键文件：

- `aaai2026.sty`
- `aaai2026.bst`

### COLM 2025

```latex
\documentclass{article}
\usepackage[submission]{colm2025_conference}
% \usepackage[final]{colm2025_conference}

\begin{document}
% Your paper content
\end{document}
```

关键文件：

- `colm2025_conference.sty`
- `colm2025_conference.bst`

## 页数限制概览

| Conference | Submission | Camera-ready | 备注 |
|------------|------------|--------------|------|
| ICML 2026 | 8 页 | 9 页 | 参考文献/附录通常不限页 |
| ICLR 2026 | 9 页 | 10 页 | 参考文献/附录通常不限页 |
| NeurIPS 2025 | 9 页 | 9 页 | checklist 不计入主文页数 |
| ACL 2025 | 长文 8 页 | 视会场而定 | 参考文献/附录通常不限页 |
| AAAI 2026 | 7 页 | 8 页 | 参考文献/附录通常不限页 |
| COLM 2025 | 9 页 | 10 页 | 参考文献/附录通常不限页 |

## 常见注意事项

### 编译问题

1. **缺宏包**：优先安装完整 TeX 发行版，如 TeX Live Full 或 MikTeX。
2. **参考文献报错**：使用模板自带 `.bst`，并确认 `\bibliographystyle{}` 配置正确。
3. **字体警告**：可安装 `cm-super`，或尝试 `\usepackage{lmodern}`。

### 匿名投稿

投稿版通常需要确认：

- `\author{}` 中没有真实作者信息
- 没有 acknowledgments
- 没有基金编号
- 代码仓库和补充链接做匿名处理
- 引用自己工作时保持第三人称

### 常用 LaTeX 宏包

```latex
\usepackage{amsmath,amsthm,amssymb}
\usepackage{graphicx}
\usepackage{booktabs}
\usepackage{hyperref}
\usepackage{algorithm,algorithmic}
\usepackage{natbib}
```

## 模板更新

会议模板每年都会更新。正式投稿前，最好再次核对官方来源：

- ICML: https://icml.cc/
- ICLR: https://iclr.cc/
- NeurIPS: https://neurips.cc/
- ACL: https://github.com/acl-org/acl-style-files
- AAAI: https://aaai.org/
- COLM: https://colmweb.org/
