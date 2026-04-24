# Factory Pattern

## 概览

Factory pattern 允许在不指定具体 class 的情况下动态创建实例。每个模块都使用 factory，把“创建”与“使用”解耦。

## 结构

```python
# In module __init__.py (e.g., data_module/dataset/__init__.py)
DATASET_FACTORY: Dict[str, type] = {}

def DatasetFactory(data_name: str):
    """Create dataset instance by name."""
    dataset = DATASET_FACTORY.get(data_name, None)
    if dataset is None:
        # Fallback to default
        dataset = DATASET_FACTORY.get('simple')
    return dataset
```

## 用法

```python
# Consumer code doesn't need to know concrete class
dataset = DatasetFactory(cfg.dataset.name)
```

## 优点

- **Loose coupling**：调用方不需要 import 具体 classes
- **Extensibility**：新增类型无需修改调用方代码
- **Fallback handling**：面对未知类型时可优雅降级
- **Centralized registry**：可用类型集中在一个事实来源中

## 实现细节

1. 在模块级定义 factory dict
2. Factory function 负责查找和 fallback
3. 返回 class（而不是 instance），以便延迟初始化
4. 当结果为 `None` 时，回退到默认实现

## 常见模式

```python
# With config integration
def DatasetFactory(cfg):
    data_name = cfg.dataset.name
    dataset_cls = DATASET_FACTORY.get(data_name)
    if dataset_cls is None:
        raise ValueError(f"Unknown dataset: {data_name}")
    return dataset_cls(cfg)
```
