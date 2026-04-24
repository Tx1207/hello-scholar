# 引用管理与幻觉预防

本参考提供一套可编程 citation workflow，用于管理引用、预防 AI 生成不存在的引用，并维护干净的 bibliography。

## 为什么必须验证引用

AI 生成引用常见问题包括：

- 真实作者名搭配伪造论文标题
- venue 或年份错误
- metadata 看起来合理但论文不存在
- DOI 或 arXiv ID 错误

后果包括 desk rejection、审稿人信任下降、已发表后更正或撤稿，以及浪费时间追不存在的来源。

核心规则：**不要凭记忆生成 citation，必须用程序化来源验证。**

## Citation APIs

| API | 覆盖范围 | 适合用途 |
|-----|----------|----------|
| Semantic Scholar | 大规模论文库 | ML/AI 论文检索、citation graph |
| CrossRef | DOI 记录 | DOI lookup、BibTeX retrieval |
| arXiv | 预印本 | ML preprint、PDF access |
| OpenAlex | 开放论文数据 | MAG 替代、批量开放数据 |

Google Scholar 没有官方 API；默认不要 scraping。

## 已验证引用流程

```text
1. SEARCH   -> 用 Semantic Scholar 或 arXiv 搜索具体关键词
2. VERIFY   -> 在 2 个以上来源确认论文存在
3. RETRIEVE -> 通过 DOI content negotiation 获取 BibTeX
4. VALIDATE -> 确认被引用 claim 确实出现在来源中
5. ADD      -> 将验证后的条目加入 .bib 文件
```

## Python 实现要点

### 搜索

```python
from semanticscholar import SemanticScholar

sch = SemanticScholar()
results = sch.search_paper("transformer attention mechanism", limit=10)

for paper in results:
    print(paper.title, paper.year, paper.externalIds)
```

### 验证存在性

```python
import requests

def verify_paper(doi=None, arxiv_id=None):
    sources = []
    if doi:
        if requests.get(f"https://api.crossref.org/works/{doi}").status_code == 200:
            sources.append("CrossRef")
    if arxiv_id:
        text = requests.get(f"http://export.arxiv.org/api/query?id_list={arxiv_id}").text
        if "<entry>" in text:
            sources.append("arXiv")
    return sources
```

### 获取 BibTeX

```python
import requests

def doi_to_bibtex(doi: str) -> str:
    response = requests.get(
        f"https://doi.org/{doi}",
        headers={"Accept": "application/x-bibtex"},
        allow_redirects=True,
    )
    response.raise_for_status()
    return response.text
```

### 验证 claim

引用某篇论文支持具体 claim 前，要检查 abstract、正文或全文片段中是否确实支持该 claim。不要因为论文标题相关就引用。

## BibTeX 管理

推荐新论文使用 BibLaTeX + Biber：

```latex
\usepackage[
    backend=biber,
    style=numeric,
    sorting=none
]{biblatex}
\addbibresource{references.bib}
```

推荐 citation key 格式：

```text
author_year_firstword
vaswani_2017_attention
devlin_2019_bert
brown_2020_language
```

## 常见 BibTeX 类型

- `@inproceedings`：会议论文
- `@article`：期刊论文
- `@misc`：arXiv preprint 或未正式出版材料
- `@online` / `@dataset`：在 BibLaTeX 中用于网页或数据集

## 常见问题

- Semantic Scholar 没结果：换更具体关键词，检查作者拼写，尝试精确短语。
- DOI 无法返回 BibTeX：可能未接入 CrossRef；尝试 arXiv ID 或从 metadata 生成。
- rate limit：请求间加 1-3 秒延迟，使用 API key，缓存结果。
- BibTeX 编码问题：确保 UTF-8；复杂字符用 LaTeX escaping；优先用 BibLaTeX。

## 加入引用前检查

- [ ] 至少在 2 个来源确认论文存在
- [ ] DOI 或 arXiv ID 已验证
- [ ] BibTeX 来自可信 metadata，而不是模型记忆
- [ ] entry type 正确
- [ ] 作者、年份、venue 已核对
- [ ] citation key 格式一致

## 参考资源

- Semantic Scholar: https://api.semanticscholar.org/api-docs/
- CrossRef: https://www.crossref.org/documentation/retrieve-metadata/rest-api/
- arXiv: https://info.arxiv.org/help/api/basics.html
- OpenAlex: https://docs.openalex.org/
