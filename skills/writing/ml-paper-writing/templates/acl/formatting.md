# ACL Proceedings 格式要求速查

这份文档是对 *ACL proceedings 常用格式要求的中文整理版，适合在写作或整理 camera-ready 时快速核对。最终权威规则仍以官方页面为准：

> https://acl-org.github.io/ACLPUB/

---

## 适用范围

以下要求适用于：

- 提交给 ACL 系列会议审稿的 review version
- 已录用、准备进入 proceedings 的 final version

所有作者都应遵守这些规范。

## 样式文件

*ACL 提供符合要求的 LaTeX 和 Microsoft Word 模板。强烈建议直接使用官方模板，而不是手工复刻版式。

## 篇幅要求

- 长文 review version：正文最多 8 页，参考文献不限页
- 长文 final version：正文最多 9 页，acknowledgements 与 references 不计入正文页数
- 短文 review version：正文最多 4 页，参考文献不限页
- 短文 final version：正文最多 5 页，acknowledgements 与 references 不计入正文页数

图表若属于正文一部分，必须放在页数限制之内。

允许提交 appendix 和 supplementary material，但 review version 必须保持自洽，不能默认审稿人一定会去看附录或补充材料。

如果论文引用了额外文档、代码或数据资源，这些资源在审稿阶段也必须对 reviewer 可访问。

不符合页数或格式规则的论文，可能直接 desk reject。

不同 workshop 可能会有自己的长度规则，最终仍以对应 CFP 为准。

## 匿名要求

ACL 审稿通常采用 double-blind，因此 review version 不应包含任何可识别作者身份的信息，例如：

- 作者姓名
- 单位信息
- 个人主页或项目 URL

暴露身份的自引写法应避免，例如：

> We previously showed (Gusfield, 1997)...

也不建议用明显的匿名占位自引：

> We previously showed (Anonymous, 1997)...

更稳妥的写法是直接把作者名当作文献主体的一部分，例如：

> Gusfield (1997) previously showed...

review version 还不应包含 acknowledgements。

初步的非归档版本如果曾在其他场合公开，可在投稿表单中填写，但不应写进匿名稿正文。

论文录用后，final version 可以恢复作者信息、单位信息以及正常的自引写法。

## 多投要求

- 如果论文已经或即将投往其他会议或期刊，需在 START submission form 中如实说明
- 如果论文被 ACL 接收，作者需要从冲突 venue 撤稿
- 已被 ACL 接收并安排口头/海报展示的论文，必须在 camera-ready 截止前确认是否展示
- 与已发表或即将发表工作存在显著内容重叠的论文，不应再次投稿

同一作者向 *ACL 同期提交多篇论文时，论文之间的内容或结果重合度不应超过 25%。

## 文件格式

- 论文必须提交为 PDF
- PDF 中必须嵌入所需字体，尤其是树结构图、特殊符号和 Asian languages 相关字体
- 生成 PDF 后，最好在另一台机器上测试能否正常打开与打印
- 避免把每一页都栅格化成图像，否则显示和打印质量可能很差
- 必须使用 **A4 paper format**

如果无法满足这些要求，应尽快联系 publication chairs。

## 版式要求

- 除页码外，正文内容必须全部落在版心范围内
- review version 需要在底部居中显示页码
- final version 不应保留页码
- 正文采用双栏排版
- 标题、作者信息、完整地址，以及必要的通栏图表可以例外

A4 页面常见尺寸要求如下：

- Left margin：2.5 cm
- Right margin：2.5 cm
- Top margin：2.5 cm
- Bottom margin：2.5 cm
- Column width：7.7 cm
- Column height：24.7 cm
- Gap between columns：0.6 cm

review version 通常还需要 ruler（左右边距中的行号），方便 reviewer 引用具体行。final version 不应保留 ruler。

## 字体要求

- 非拉丁文字和数学公式之外，正文通常使用 **Times Roman**
- 如果不可用，可用 **Times New Roman** 或 **Computer Modern Roman**

常见字号要求：

| 文本类型 | 字号 | 样式 |
|----------|------|------|
| paper title | 15 pt | bold |
| author names | 12 pt | bold |
| author affiliation | 12 pt | 常规 |
| `Abstract` 标题 | 12 pt | bold |
| section titles | 12 pt | bold |
| subsection titles | 11 pt | bold |

## 实操建议

- 直接以官方模板起稿，不要从旧会议模板拷贝样式
- 提交前检查匿名信息、页数、A4 设置、页码和参考文献
- camera-ready 阶段重点检查作者信息恢复、acknowledgements、最终引用、图表清晰度和 PDF 字体嵌入
- 若 workshop / shared task / special session 规则与主会不同，优先服从该 venue 的最新说明
