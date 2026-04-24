---
name: latex-conference-template-organizer
description: 把杂乱的 conference LaTeX template `.zip` 整理成干净、可直接上传 Overleaf 的结构。用户要求“organize LaTeX template”、“clean up .zip template”或“prepare Overleaf submission template”时使用。
version: 0.1.0
---

# LaTeX Conference Template Organizer

## 概览

把混乱的 conference LaTeX template `.zip` 转换成干净、可直接用于写作的 Overleaf-ready submission template。官方模板通常带大量示例内容、教学注释和凌乱目录结构，本 skill 的目标是把它们整理成可用模板。

## Working Mode

**Analyze-then-confirm mode**：先分析问题并向用户展示，再在确认后执行清理。

## Complete Workflow

```text
Receive .zip file
    ↓
1. Extract and analyze file structure
    ↓
2. Identify main file and dependencies
    ↓
3. Diagnose issues (present to user)
    ↓
4. Ask for conference info (link/name)
    ↓
5. Wait for user confirmation of cleanup plan
    ↓
6. Execute cleanup, create output directory
    ↓
7. Generate README (with official website info)
    ↓
8. Output complete
```

## Step 1: Extract and Analyze

### Extract Files

先把 `.zip` 解压到临时目录：

```bash
unzip -q template.zip -d /tmp/latex-template-temp
cd /tmp/latex-template-temp
find . -type f -name "*.tex" -o -name "*.sty" -o -name "*.cls" -o -name "*.bib"
```

### Identify File Types

| File Type | Purpose |
|-----------|---------|
| `.tex` | LaTeX 源文件 |
| `.sty` / `.cls` | 样式文件 |
| `.bib` | 参考文献数据库 |
| `.pdf` / `.png` / `.jpg` | 图片文件 |

### Identify Main File

**常见主文件名：**
- `main.tex`
- `paper.tex`
- `document.tex`
- `sample-sigconf.tex`
- `template.tex`

**识别方法：**
1. 先看文件名是否符合常见模式
2. 搜索包含 `\documentclass` 的 `.tex`
3. 如果有多个候选，交给用户确认

```bash
grep -l "\\documentclass" *.tex
```

## Step 2: Diagnose Issues

向用户展示分析出的主要问题：

### Disorganized File Structure

- 多层目录嵌套
- `.tex` 文件分散在多个目录
- 主文件不明确

### Redundant Content

检测并标记以下冗余内容：
- 文件名中包含 `sample`、`example`、`demo`、`test`
- 注释中包含 `sample`、`example`、`template`、`delete this`

### Dependency Issues

- 被引用的 `.sty` / `.cls` 缺失
- 图片或表格路径不正确

## Step 3: Ask for Conference Information

向用户请求以下信息：

```markdown
Please provide the following information (optional):

1. **Conference submission link** (recommended): Used to extract official submission requirements
2. **Conference name**: If no link available
3. **Other special requirements**: Such as page limits, anonymity requirements, etc.
```

## Step 4: Present Cleanup Plan

先给出清理方案，等待用户确认：

```markdown
## Cleanup Plan

### Issues Found
- [List diagnosed issues]

### Cleanup Approach
1. Main file: main.tex (clean example content)
2. Section separation: text/ directory
3. Resource directories: figures/, tables/, styles/

### Output Structure
[Show output directory structure]

Confirm execution? [Y/n]
```

## Step 5: Execute Cleanup

### Create Output Directory Structure

```bash
mkdir -p output/{text,figures,tables,styles}
```

### Clean Up Main File (main.tex)

**保留：**
- `\documentclass`
- 必需 package import
- 核心配置（如匿名模式）

**删除：**
- 示例 section 内容
- 过长的教学注释
- 示例作者和标题信息

**新增：**
- 用 `\input{text/XX-section}` 导入章节

**示例 main.tex 结构：**
```latex
\documentclass[...]{...}

% Required packages

\title{Your Paper Title}
\author{Author Name}
\affiliation{...}

\begin{abstract}
% TODO: Write abstract content
\end{abstract}

\begin{document}
\maketitle
\input{text/01-introduction}
\input{text/02-related-work}
\input{text/03-method}
\input{text/04-experiments}
\input{text/05-conclusion}
\bibliographystyle{...}
\bibliography{references}
\end{document}
```

### KDD 2026 Anonymous Submission Special Configuration

对于 KDD 2026（ACM `acmart`），匿名投稿需要加 `nonacm` 选项以移除脚注：

```latex
\documentclass[sigconf,anonymous,review,nonacm]{acmart}
\settopmatter{printacmref=false}
\setcopyright{none}
\acmConference[]{}{}{}
\acmYear{}
\acmISBN{}
\acmDOI{}
```

camera-ready 时再恢复 ACM metadata。

### Create Section Files (text/)

为各 section 创建独立 `.tex` 文件，**只包含 section 内容**，不要包含 `\begin{document}` 等包装。

```latex
\section{Introduction}
% TODO: Write introduction content
```

**注意：**
- **Abstract** 应放在 `main.tex` 的 preamble 中
- `text/` 下文件只写章节内容
- 不要在 `text/` 文件里写 `\begin{document}`

### Copy Style Files (styles/)

复制所有 `.sty` / `.cls` 到 `styles/`：

```bash
find /tmp/latex-template-temp -type f \( -name "*.sty" -o -name "*.cls" \) -exec cp {} output/styles/ \;
```

### Handle Images and Tables

```bash
find /tmp/latex-template-temp -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.pdf" \) -exec cp {} output/figures/ \;
find /tmp/latex-template-temp -type f -name "*.tex" | grep -i table | while read f; do cp "$f" output/tables/; done
```

### Create Example Table File

由于 Overleaf 会自动删除空目录，若 `tables/` 为空，应创建一个示例表格文件防止目录消失。

### Copy Bibliography

```bash
find /tmp/latex-template-temp -type f -name "*.bib" -exec cp {} output/ \;
```

## Step 6: Generate README

### Information Source Priority

1. 用户提供的 conference link
2. 模板文件中的注释
3. 从 `\documentclass` 默认推断

README 需要包含：
- Conference 名称与官网
- Template version
- `documentclass`
- page limit / anonymity / compiler 等要求
- Overleaf 上传说明
- 目录说明
- 添加图片、表格、引用的示例
- 模板注释中提取出的关键提醒

如果用户给了 conference 链接，可用网页内容补充：
- page limits
- 匿名要求
- 格式要求
- 截止时间

## Step 7: Cleanup and Output

```bash
rm -rf /tmp/latex-template-temp
echo "Template cleanup complete! Output directory: output/"
echo "Please upload the output/ directory to Overleaf to test compilation."
```

## Error Handling

| Error Scenario | Handling Approach |
|----------------|-------------------|
| Main file not found | 列出所有 `.tex` 文件，让用户选择 |
| Dependency file missing | 警告用户，并尝试在模板目录中继续查找 |
| Cannot extract conference info | 使用模板中的默认信息，并标记为 `[To be confirmed]` |
| Website inaccessible | 回退到模板注释，并提醒用户手动补全 |
| Extraction failed | 让用户检查 `.zip` 是否损坏 |

## Common Conference Template Types

| Conference | Document Class | Notes |
|------------|---------------|-------|
| **KDD (ACM SIGKDD)** | `acmart` | 匿名投稿需加 `nonacm` 以去掉脚注 |
| ACM Conferences | `acmart` | 匿名模式通常要求 `\acmReview{anonymous}` |
| CVPR/ICCV | `cvpr` | 双栏、页数限制严格 |
| NeurIPS | `neurips_2025` | 匿名审稿，通常不限制页数 |
| ICLR | `iclr2025_conference` | 双栏，需要会议信息 |
| AAAI | `aaai25` | 双栏，8 页正文 + references |

## Quick Reference

### Detect Document Type

```bash
grep "\\documentclass" main.tex
grep -i "anonymous\|review\|blind" main.tex
grep "pagelimit\|pageLimit\|page_limit" main.tex
```

### Common Cleanup Patterns

```bash
rm -f sample-* example-* demo-* test-*
rm -f *.aux *.log *.out *.bbl *.blg
```
