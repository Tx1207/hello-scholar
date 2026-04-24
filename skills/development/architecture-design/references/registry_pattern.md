# Registry Pattern

## 概览

Registry pattern 允许组件通过 decorators 自注册，从而实现可用类型的自动发现和集中管理。

## 结构

```python
# In module __init__.py (e.g., data_module/dataset/__init__.py)
from typing import Dict, Callable, TypeVar

T = TypeVar('T')

DATASET_FACTORY: Dict[str, type] = {}

def register_dataset(name: str) -> Callable[[T], T]:
    """Decorator to register dataset classes."""
    def decorator(cls: T) -> T:
        DATASET_FACTORY[name] = cls
        return cls
    return decorator
```

## 用法

```python
# In implementation file (e.g., simple_dataset.py)
from data_module.dataset import register_dataset

@register_dataset("simple")
class SimpleDataset(Dataset):
    def __init__(self, cfg):
        # Implementation
        pass
```

## 优点

- **Automatic registration**：组件在 import 时自动注册自身
- **Declarative**：一行 decorator 替代手工注册逻辑
- **Import-time discovery**：auto-import pattern 能找到全部实现
- **Type-safe**：保留原始 class 类型

## 实现细节

1. Decorator 原样返回 class（便于直接使用）
2. 副作用是把 class 加入 factory dict
3. `name` 参数在同一模块中必须唯一
4. 注册发生在模块 import 时

## 高级模式

### 带配置的注册

```python
def register_model(name: str):
    def decorator(cls):
        MODEL_FACTORY[name] = cls
        # Add config validation
        cls._config_schema = getattr(cls, '_config_schema', {})
        return cls
    return decorator
```

### 条件注册

```python
def register_dataset(name: str, experimental: bool = False):
    def decorator(cls):
        if not experimental or cfg.enable_experimental:
            DATASET_FACTORY[name] = cls
        return cls
    return decorator
```

### Multi-Registry

```python
# Multiple registries in one module
DATASET_FACTORY = {}
AUGMENTATION_FACTORY = {}

def register_dataset(name: str):
    def decorator(cls):
        DATASET_FACTORY[name] = cls
        return cls
    return decorator

def register_augmentation(name: str):
    def decorator(fn):
        AUGMENTATION_FACTORY[name] = fn
        return fn
    return decorator
```

## 最佳实践

- **Unique names**：使用具描述性且唯一的注册名
- **Documentation**：在 class docstring 中记录必需参数
- **Validation**：在 `__init__` 中做 config 校验，而不是在 decorator 里
- **Consistency**：跨模块使用一致命名约定
