# 发布检查

用这些检查判断组装好的发布是否完整、能否安全公开。它们辅助判断；某项通过不能代替对照报告结果的复现检查。

## 完整性

以下沿用 Papers with Code 科研代码发布指南中的 ML 代码完整性清单。

| 项目 | 读者需要什么 |
| --- | --- |
| 依赖 | `requirements.txt`、`environment.yml` 或包元数据，写明实际运行过的版本；结果依赖 CUDA 和框架版本时一并写明。 |
| 训练代码 | 产生每条发布结论的入口和配置，不依赖内部启动器即可运行。 |
| 评测代码 | 计算每个报告指标的入口，以及评测数据划分和预处理。 |
| 预训练权重 | 下载位置，以及每行结果使用的 checkpoint；写明权重的许可证。 |
| README 结果 | 每条结论一行的表格：结果、能复现它的精确命令、带容差的预期值。 |

README 中的一行应当像这样：

| 结论 | 命令 | 预期 |
| --- | --- | --- |
| 表 2，UVG，DISTS | `python scripts/eval.py --config configs/uvg.yaml --ckpt weights/main.pt` | 0.081 ± 0.002 |

## 泄漏

在组装好的发布目录中搜索，而不是开发目录，因为公开的是发布目录：

- 密钥：API key、token、密码、私钥（`.pem`、`id_rsa`）、云服务凭证、`.env` 文件；
- 内部位置：家目录或集群的绝对路径、内部主机名、IP 地址、调度系统账号、内部 URL；
- 数据：私有数据集、没有再分发权的样本、fixture 或日志中的个人信息；
- 文字：内部注释、未同意署名的合作者姓名、关于审稿人或未发表工作的备注。

gitleaks 这类扫描工具能发现常见的密钥格式；再用文本搜索项目自己的内部路径前缀和主机名，补上扫描工具漏掉的部分。

## README

README 是读者第一个用到的东西，多数读者只想用发布的模型跑自己的数据，或核对一个数字。评价高的科研代码 README 有这些共同做法：

- 安装之前先展示方法做了什么：一张图、一行链接（论文、项目主页、权重、引用），以及带条件的核心结果。[Segment Anything](https://github.com/facebookresearch/segment-anything) 就是这样做的，而且没有徽章。
- 给出用发布权重得到真实输出的最短路径：一条安装命令，加上几行代码或一条命令。Segment Anything 的核心用法大约三行；[MAE](https://github.com/facebookresearch/mae) 还提供了不需要 GPU 的 notebook 演示。
- 每个报告的数字都对应一个 checkpoint 和一条命令。[Papers with Code 模板](https://github.com/paperswithcode/releasing-research-code) 要求结果表附复现命令；MAE 把 checkpoint 表和结果表放在一起。
- 写明会改变数字的条件，并在跨方法比较不公平时提醒读者。[DCVC](https://github.com/microsoft/DCVC) 精确列出测试过的版本，把测试条件放在单独文件里，并解释 intra period、帧数和填充如何影响比较。
- 较长的流程放在单独文件里，从 README 链接过去，例如 MAE 的 PRETRAIN.md 和 FINETUNE.md、DCVC 的 training.md。

README 中的每个数字，要么经过复现检查确认，要么是从论文引用并写明条件。不要堆砌徽章、营销用语或内部细节。

## 许可证

保留复制来的第三方代码的许可证头和声明，并确认其许可证允许以发布许可证再分发。数据集和权重的许可证与代码许可证分开写明。发布许可证尚未确定时询问用户。
