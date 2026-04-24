# 详细目录结构

本文档对 ML 项目模板的目录结构进行完整拆解。

## 根目录文件

| 文件 | 用途 |
|------|------|
| `README.md` | 项目文档、安装说明、使用示例 |
| `TODO.md` | 按周重点和日常任务组织的任务跟踪 |
| `.gitignore` | Python、Jupyter、IDE、logs、cache 等 Git 忽略模式 |
| `pyproject.toml` | build system 与依赖的项目配置 |
| `uv.lock` | 用于可复现性的锁定依赖版本 |

## run/ - 执行层

### pipeline/

按阶段组织的主工作流脚本：

| 目录 | 用途 |
|-----------|---------|
| `training/` | 训练执行脚本（`training.sh`、`inference.sh`） |
| `prepare_data/` | 数据准备与预处理流水线 |
| `analysis/` | 评估与分析工作流 |

### conf/

按模块组织的 Hydra 配置文件：

| 目录 | 用途 |
|-----------|---------|
| `training/` | 训练超参数、模型配置、优化器设置 |
| `dataset/` | 数据集配置、数据路径、预处理选项 |
| `model/` | 模型架构配置 |
| `prepare_data/` | 数据准备参数 |
| `analysis/` | 分析与评估配置 |
| `dir/` | 目录路径配置 |
| `analysis/` | 分析专项设置 |

## src/ - 源代码层

### data_module/ - 数据处理模块

```text
data_module/
|- __init__.py              # 模块导出
|- utils.py                 # 数据相关工具函数
|- dataset/                 # 数据集实现
|  |- __init__.py           # Dataset factory 和 registry
|  \- simple_dataset.py     # Simple dataset 示例
|- augmentation/            # 数据增强方法
|  |- __init__.py
|  |- mixup.py              # Mixup augmentation
|  |- random_shift.py       # Random shifting
|  |- channel_mask.py       # Channel masking
|  |- time_masking.py       # Time masking
|  \- add_noise.py          # Noise injection
|- collate_fn/              # Batch collation functions
|  |- __init__.py
|  \- simple_collate_fn.py
|- compute_metrics/         # 指标计算
|  |- __init__.py
|  \- simple_compute_metrics.py
|- prepare_data/            # 数据准备逻辑
|  |- __init__.py
|  |- prepare_data.py
|  \- generate_yaml.py
\- data_func/               # 数据工具函数
   |- __init__.py
   \- simple_data_func.py
```

### model_module/ - 模型模块

```text
model_module/
|- __init__.py             # 模块导出
\- model/                  # 模型实现
   \- [model files]
```

### trainer_module/ - 训练模块

包含 training loop、validation 和 checkpoint 管理逻辑。

### analysis_module/ - 分析模块

包含评估、可视化和结果分析代码。

### llm/ - LLM 模块

LLM 相关代码与集成。

### utils/ - 共享工具

```text
utils/
|- __init__.py
|- helpers.py              # Helper functions（如 import_modules）
|- logging.py              # Logging 配置
|- get_optimizer.py        # Optimizer factory
|- get_scheduler.py        # Learning rate scheduler factory
|- get_callback.py         # Training callbacks
|- get_activation.py       # Activation functions
\- get_checkpoint_aggregation.py  # Checkpoint handling
```

## data/ - 数据层

遵循 Cookiecutter Data Science 标准：

| 目录 | 用途 |
|-----------|---------|
| `raw/` | 原始、不可变数据 dump |
| `processed/` | 清洗和转换后、可直接使用的数据 |
| `external/` | 第三方数据 |

## outputs/ - 输出层

| 目录 | 用途 |
|-----------|---------|
| `logs/` | 训练日志、tensorboard 日志 |
| `checkpoints/` | 用于恢复训练的模型检查点 |
| `tables/` | 结果表格、CSV 输出 |
| `figures/` | 图表、可视化、插图 |

## 模块交互流

```text
run/pipeline/    ->  src/trainer_module/  ->  src/model_module/
                     src/data_module/         src/utils/
                     src/utils/

run/conf/        ->  Hydra config loader  ->  All modules
```

## 文件命名约定

- **Modules**：`simple_dataset.py`、`custom_model.py`
- **Pipelines**：`training.sh`、`inference.sh`
- **Configs**：`config.yaml`、按 dataset 命名的配置
- **Utilities**：语义明确的名字（`get_optimizer.py`、`helpers.py`）

## Python 包结构

每个模块都应是标准 Python package：
- 拥有带 factory / registry 逻辑的 `__init__.py`
- 可以像 `from src.module import Component` 这样导入
- 子包通过 `import_modules()` 自动发现
