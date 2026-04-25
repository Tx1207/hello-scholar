---
name: architecture-design
description: 仅在创建需要 Factory 或 Registry 模式的新 registrable ML 组件时使用。
version: 1.2.0
---

# 架构设计 - ML Project Template

该 skill 定义了基于模板结构的 machine learning 项目标准代码架构。在修改或扩展代码时，应遵循这些模式以维持一致性。

## 概览

该项目采用模块化、可扩展的架构，并明确分离关注点。每个模块（data、model、trainer、analysis）都通过 factory 和 registry patterns 独立组织，以获得最大的灵活性。

For non-ML architecture work, use these general constraints when this skill is already active: keep boundaries explicit, dependencies flowing in one direction, modules cohesive, public interfaces stable, and migration paths reversible. Prefer the smallest architecture change that solves the stated problem.

## 何时使用

在以下场景使用该 skill：
- 创建需要 `@register_dataset` 的新 Dataset class
- 创建需要 `@register_model` 的新 Model class
- 创建带有 `__init__.py` factory wiring 的新模块目录
- 从零初始化新的 ML 项目结构
- 新增 Augmentation、CollateFunction 或 Metrics 等组件类型

## 何时不使用

在以下场景不要使用该 skill：
- 修改已有函数或方法
- 修复现有代码中的 bug
- 添加 helper functions 或 utilities
- 仅重构而不新增 registrable components
- 对单文件做简单代码修改
- 修改配置文件
- 阅读或理解现有代码

关键判断标准：如果任务不需要 `@register_*` decorator 或 Factory pattern，就跳过这个 skill。

For general refactors, architecture review can still use the checklist below without importing the ML-specific factory requirements.

## 核心设计模式

### Factory Pattern

每个模块都使用 factory 动态创建实例：

```python
# Example from data_module/dataset/__init__.py
DATASET_FACTORY: Dict = {}

def DatasetFactory(data_name: str):
    dataset = DATASET_FACTORY.get(data_name, None)
    if dataset is None:
        print(f"{data_name} dataset is not implementation, use simple dataset")
        dataset = DATASET_FACTORY.get('simple')
    return dataset
```

详细说明参见 `references/factory_pattern.md`。

### Registry Pattern

组件通过 decorators 注册自身：

```python
# Example from data_module/dataset/simple_dataset.py
@register_dataset("simple")
class SimpleDataset(Dataset):
    def __init__(self, data):
        self.data = data
```

详细说明参见 `references/registry_pattern.md`。

### Auto-Import Pattern

模块会自动发现并导入子模块：

```python
# Example from data_module/dataset/__init__.py
models_dir = os.path.dirname(__file__)
import_modules(models_dir, "src.data_module.dataset")
```

详细说明参见 `references/auto_import.md`。

## 目录结构

```text
project/
|- run/
|  |- pipeline/            # 主工作流脚本
|  |  |- training/        # 训练流水线
|  |  |- prepare_data/    # 数据准备流水线
|  |  \- analysis/        # 分析流水线
|  \- conf/               # Hydra 配置文件
|     |- training/        # 训练配置
|     |- dataset/         # 数据集配置
|     |- model/           # 模型配置
|     |- prepare_data/    # 数据准备配置
|     \- analysis/        # 分析配置
|
|- src/
|  |- data_module/        # 数据处理模块
|  |  |- dataset/         # 数据集实现
|  |  |- augmentation/    # 数据增强
|  |  |- collate_fn/      # Collate 函数
|  |  |- compute_metrics/ # 指标计算
|  |  |- prepare_data/    # 数据准备逻辑
|  |  |- data_func/       # 数据工具函数
|  |  \- utils.py         # 模块内部工具
|  |
|  |- model_module/       # 模型实现
|  |  |- brain_decoder/   # Brain decoder 模型
|  |  \- model/           # 备选模型目录
|  |
|  |- trainer_module/     # 训练逻辑
|  |- analysis_module/    # 分析与评估
|  |- llm/                # LLM 相关代码
|  \- utils/              # 共享工具
|
|- data/
|  |- raw/                # 原始、不可变数据
|  |- processed/          # 清洗与转换后的数据
|  \- external/           # 第三方数据
|
|- outputs/
|  |- logs/               # 训练与评估日志
|  |- checkpoints/        # 模型检查点
|  |- tables/             # 结果表格
|  \- figures/            # 图表与可视化
|
|- pyproject.toml         # 项目配置
|- uv.lock                # 依赖锁文件
|- TODO.md                # 任务跟踪
|- README.md              # 项目文档
\- .gitignore             # Git 忽略规则
```

更详细的目录说明参见 `references/structure.md`。

## 模块组织

### 创建新 Dataset

新增 dataset 时：

1. 在 `src/data_module/dataset/` 中创建文件
2. 使用 `@register_dataset("name")` decorator
3. 继承 `torch.utils.data.Dataset`
4. 实现 `__init__`、`__len__`、`__getitem__`

```python
from torch.utils.data import Dataset
from typing import Dict
import torch
from src.data_module.dataset import register_dataset

@register_dataset("custom")
class CustomDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, i: int) -> Dict[str, torch.Tensor]:
        return self.data[i]
```

### 创建新 Model

**CRITICAL：模型使用 config-driven 模式**

新增 model 时：

1. 在 `src/model_module/model/` 或对应子目录中创建文件
2. 使用 `@register_model('ModelName')` decorator
3. `__init__` **只能**接收 `cfg` 参数，所有超参数都来自配置
4. `forward()` 返回 dict：`{"loss": loss, "labels": labels, "logits": logits}`
5. 使用 `self.training` 处理训练与推理模式

```python
from src.model_module.brain_decoder import register_model

@register_model('MyModel')
class MyModel(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.cfg = cfg
        self.task = cfg.dataset.task

        # ALL parameters from cfg
        self.hidden_dim = cfg.model.hidden_dim
        self.output_dim = cfg.dataset.target_size[cfg.dataset.task]

    def forward(self, x, labels=None, **kwargs):
        if self.training:
            # Training logic
            pass
        else:
            # Inference logic
            pass

        return {"loss": loss, "labels": labels, "logits": logits}
```

### 添加数据增强

新增 augmentation 时：

1. 在 `src/data_module/augmentation/` 中创建文件
2. 实现 transformation function
3. 如有需要，通过 factory 注册

## 代码风格指南

完整风格指南参见 `references/code_style.md`。

**关键原则：**
- 函数签名始终使用类型标注
- 遵循 import 顺序：standard library -> third-party -> local
- 模块 `__init__.py` 包含 factory / registry 逻辑
- Model classes 必须是 config-driven

## 配置管理

项目使用 Hydra 管理配置：

- 配置文件放在 `run/conf/`，按模块组织
- 每个 stage（training、analysis）都有独立配置结构
- 所有配置均使用 YAML 文件

## 在本项目中工作时

### 修改代码前

1. 阅读相关模块的 factory / registry pattern
2. 检查现有实现，确保一致性
3. 遵循既定目录结构
4. 为新组件使用 registration decorators

### 添加新特性时

1. 判断该功能属于哪个模块
2. 检查是否已有类似功能
3. 若创建新组件类型，遵循 factory / registry pattern
4. 如有需要，补充配置文件
5. 更新文档

### 代码审查清单

- [ ] 正确使用 factory / registry pattern
- [ ] 遵循模块目录结构
- [ ] 具备恰当类型标注
- [ ] imports 顺序正确
- [ ] 使用了 registration decorator
- [ ] 在需要时补充了配置文件
- [ ] 模块职责单一，边界清晰，没有把业务逻辑、I/O、配置和展示层混在一起
- [ ] 依赖方向清晰，没有引入循环依赖或跨层访问
- [ ] 公共接口保持兼容，破坏性变更有迁移策略和回滚方案
- [ ] 新抽象有多个真实调用点或明确扩展需求，不为单一场景过度抽象

## 额外资源

### 参考文件

详细信息请查看：
- **`references/structure.md`** - 带文件说明的详细目录结构
- **`references/factory_pattern.md`** - Factory pattern 详解
- **`references/registry_pattern.md`** - Registry pattern 详解
- **`references/auto_import.md`** - Auto-import pattern 详解
- **`references/code_style.md`** - 完整代码风格指南

### 示例文件

`examples/` 中的可运行示例：
- **`examples/custom_dataset.py`** - 自定义 dataset 实现
- **`examples/custom_model.py`** - 自定义 model 实现
- **`examples/augmentation_example.py`** - 数据增强示例
- **`examples/config_example.yaml`** - 配置文件示例
- **`examples/pipeline_example.sh`** - pipeline 脚本示例
