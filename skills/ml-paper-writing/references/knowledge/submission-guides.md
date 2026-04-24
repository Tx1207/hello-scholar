# 投稿指南与会议要求

本文档整理 venue-specific submission requirements、格式规范和 checklist 要点。

## NeurIPS

常见要求：

- Main paper：9 pages（references 不计）
- Appendix 允许，但 reviewer 不一定看
- 必须有 checklist
- 接收后通常还需要 lay summary
- double-blind
- 使用官方 LaTeX template

投稿前重点核查：

- abstract 是否在字数限制内
- paper 是否匿名
- figures / tables 是否清晰
- code / data availability 是否说明
- equations 和 citations 是否完整
- limitations / ethics 是否已覆盖

## ICML

常见要求：

- Main paper：8 pages
- camera-ready 常允许 +1 page
- references 不计页数
- 需要 Broader Impact Statement
- double-blind
- 官方 template

Broader Impact 应覆盖：

- 正向社会影响
- 负向社会影响
- bias / fairness
- environmental impact

## ICLR

常见要求：

- Main paper：9 pages
- references 不计页数
- 必须有 Limitations section
- 若使用 LLM，需要做 LLM disclosure
- double-blind

LLM disclosure 常应说明：

- LLM 在论文中的用途
- 模型信息
- 相关限制
- 是否使用自动文本生成

## ACL

常见要求：

- 长文通常 8 pages
- references 不计页数
- 必须有 Limitations section
- 如适用需有 Ethics Statement
- double-blind
- 使用 ACL style files

需要特别关注：

- human subjects 是否有 IRB
- data privacy 和 consent
- environmental impact

## AAAI

常见要求：

- Main paper：7 pages
- camera-ready 常允许 +1 page
- 必须严格遵守官方 template
- 不要修改 style files

## COLM

常见要求：

- Main paper：9 pages
- 主要面向 language models
- 实验和贡献应与 LM community 相关

## 通用投稿要求

### Double-Blind

常见要求：

- 移除作者名和机构
- 自引匿名化
- 不在 acknowledgments 中暴露身份
- 补充材料同样匿名
- 不要忘记匿名 GitHub links 和文件路径

### Code / Data Availability

越来越多会议会要求或强烈鼓励：

- 代码仓库说明
- 数据访问方式
- hyperparameters 和运行设置
- proprietary constraints 说明

### Supplementary Materials

一般原则：

- appendix 可放额外实验、证明和大表
- main paper 仍需自包含
- main text 中要引用 supplementary

## 引用格式

ML 常见风格：

- IEEE / ACM 编号制
- author-year 风格

最佳实践：

- 整篇引用风格统一
- 有 DOI 时尽量给 DOI
- preprint 给出 arXiv 链接
- 提交前验证所有 citation

## 投稿前 Checklist

### 内容

- [ ] novel contribution 写清楚
- [ ] related work 充分
- [ ] methods 可复现
- [ ] results 支撑所有 claims
- [ ] limitations 已说明
- [ ] broader impact / ethics 已处理（如需要）

### 格式

- [ ] page limits 合规
- [ ] style file 严格遵守
- [ ] references 完整一致
- [ ] 图表清晰可读
- [ ] equations 编号并被引用
- [ ] supplementary material 组织清楚

### 匿名

- [ ] author names 已移除
- [ ] acknowledgements 已匿名
- [ ] self-citations 已匿名
- [ ] GitHub links 已匿名
- [ ] 所有 identifying information 都已去掉

## 备注

- 会议要求会逐年变化，投稿前一定重新核对当年官方指南
- 严格格式会议要尽早开始排版
- 多看前几年写得好的论文
- 不确定时优先查 program chairs 或有经验的合作者
