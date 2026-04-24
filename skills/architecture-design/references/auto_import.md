# Auto-Import Pattern

## 概览

Auto-Import pattern 会自动发现并导入目录下所有子模块，从而确保所有组件都完成注册，而不需要手工 import。

## 结构

```python
# In module __init__.py (e.g., data_module/dataset/__init__.py)
import os
from src.utils.helpers import import_modules

models_dir = os.path.dirname(__file__)
import_modules(models_dir, "src.data_module.dataset")
```

## Helper Function

```python
# In src/utils/helpers.py
import os
import importlib
import pkgutil
from typing import List

def import_modules(models_dir: str, package_name: str) -> List[str]:
    """
    Import all Python modules in a directory.

    Args:
        models_dir: Directory path to scan
        package_name: Full package name for imports

    Returns:
        List of imported module names
    """
    imported = []
    for module_loader, name, ispkg in pkgutil.iter_modules([models_dir]):
        if not name.startswith('_'):
            full_name = f"{package_name}.{name}"
            importlib.import_module(full_name)
            imported.append(name)
    return imported
```

## 优点

- **Zero maintenance**：新增文件即可自动注册
- **No遗漏**：不会忘记导入新组件
- **Consistent**：所有组件沿用同一发现路径
- **Scalable**：适用于任意数量子模块

## 实现细节

1. 扫描目录中的 `.py` 文件
2. 跳过以下划线开头的文件（私有）
3. 通过完整 package path 导入每个模块
4. 模块导入后触发 decorator registration

## 目录结构示例

```text
dataset/
|- __init__.py          # Contains import_modules() call
|- simple_dataset.py    # Auto-imported, registers "simple"
|- custom_dataset.py    # Auto-imported, registers "custom"
\- _private.py          # NOT imported (starts with _)
```

## 最佳实践

- **Skip private files**：下划线开头的文件默认不导入
- **Full package paths**：使用点号表示的完整 package 路径
- **Idempotent**：允许安全地多次调用
- **Error handling**：让 import errors 直接暴露，便于调试

## 常见模式

### 条件导入

```python
def import_modules(models_dir: str, package_name: str, skip: List[str] = None):
    skip = skip or []
    for module_loader, name, ispkg in pkgutil.iter_modules([models_dir]):
        if name not in skip and not name.startswith('_'):
            importlib.import_module(f"{package_name}.{name}")
```

### 递归导入

```python
def import_modules_recursive(models_dir: str, package_name: str):
    """Import modules and subpackages recursively."""
    for importer, name, ispkg in pkgutil.walk_packages([models_dir], prefix=f"{package_name}."):
        if not name.split('.')[-1].startswith('_'):
            importlib.import_module(name)
```

### Dry-Run 模式

```python
def import_modules(models_dir: str, package_name: str, dry_run: bool = False):
    if dry_run:
        return [name for _, name, _ in pkgutil.iter_modules([models_dir])
                if not name.startswith('_')]
    # ... actual import logic
```

## 与 Registry 的集成

Auto-Import pattern 通常与 Registry pattern 配套使用：

1. **Import time**：`import_modules()` 导入所有文件
2. **Decorator execution**：`@register_dataset()` 执行
3. **Factory population**：填充 `DATASET_FACTORY` dict
4. **Runtime**：`DatasetFactory()` 查找已注册 classes
