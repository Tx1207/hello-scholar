---
name: uv-package-manager
description: 掌握 uv package manager，用于快速 Python 依赖管理、virtual environment 和现代 Python 项目工作流。设置 Python 项目、管理依赖、配置 package manager，或用 uv 优化 Python 开发流程时使用。也响应 “setup package manager” 或 “configure pm”。
version: 0.1.0
---

# UV Package Manager

uv 是用 Rust 编写的高速 Python package installer 和 resolver，可用于现代 Python 项目管理、依赖安装、virtual environment、Python 版本管理和可复现构建。

## When to Use This Skill

- 快速初始化 Python 项目
- 比 pip 更快地管理依赖
- 创建和管理 virtual environment
- 安装 Python interpreter
- 高效解决依赖冲突
- 从 pip / pip-tools / poetry 迁移
- 加速 CI/CD
- 管理 Python monorepo
- 使用 lockfile 实现可复现构建
- 优化 Docker 中的 Python 依赖安装

## Core Concepts

### What is uv?

- **Ultra-fast package installer**：通常比 pip 快 10-100 倍
- **Written in Rust**：利用 Rust 性能
- **Drop-in pip replacement**：兼容 pip 工作流
- **Virtual environment manager**：创建和管理 venv
- **Python installer**：下载并管理 Python 版本
- **Resolver**：高级依赖解析
- **Lockfile support**：可复现安装

### uv vs Traditional Tools

- **vs pip**：更快，resolver 更强
- **vs pip-tools**：更快，体验更简单
- **vs poetry**：更轻、更少 opinionated
- **vs conda**：更快，但更聚焦 Python 包生态

## Installation

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# pip
pip install uv

# Homebrew
brew install uv
```

验证：

```bash
uv --version
```

## Quick Start

### Create a New Project

```bash
uv init my-project
cd my-project

# 或在当前目录初始化
uv init .
```

初始化通常会创建：
- `.python-version`
- `pyproject.toml`
- `README.md`
- `.gitignore`

### Install Dependencies

```bash
uv add requests pandas
uv add --dev pytest black ruff
uv pip install -r requirements.txt
uv sync
```

## Virtual Environment Management

### Creating Virtual Environments

```bash
uv venv
uv venv --python 3.12
uv venv my-env
uv venv --system-site-packages
uv venv /path/to/venv
```

### Activating Virtual Environments

```bash
# Linux/macOS
source .venv/bin/activate

# Windows Command Prompt
.venv\Scripts\activate.bat

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

也可以直接使用 `uv run`，无需手动 activate：

```bash
uv run python script.py
uv run pytest
uv run black .
```

## Package Management

### Adding Dependencies

```bash
uv add requests
uv add "django>=4.0,<5.0"
uv add numpy pandas matplotlib
uv add --dev pytest pytest-cov
uv add --optional docs sphinx
uv add git+https://github.com/user/repo.git
uv add git+https://github.com/user/repo.git@v1.0.0
uv add ./local-package
uv add -e ./local-package
```

### Removing Dependencies

```bash
uv remove requests
uv remove --dev pytest
uv remove numpy pandas matplotlib
```

### Upgrading Dependencies

```bash
uv add --upgrade requests
uv sync --upgrade
uv tree --outdated
```

### Locking Dependencies

```bash
uv lock
uv lock --upgrade
uv lock --no-install
uv lock --upgrade-package requests
```

## Python Version Management

```bash
uv python install 3.12
uv python install 3.11 3.12 3.13
uv python list
uv python list --all-versions
uv python pin 3.12
uv --python 3.11 run python script.py
uv venv --python 3.12
```

## Project Configuration

### pyproject.toml with uv

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "My awesome project"
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "requests>=2.31.0",
    "pydantic>=2.0.0",
    "click>=8.1.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

## Advanced Workflows

### Monorepo Support

```toml
[tool.uv.workspace]
members = ["packages/*"]
```

```bash
uv sync
uv add --path ./packages/package-a
```

### CI/CD Integration

```yaml
- name: Install uv
  uses: astral-sh/setup-uv@v2
  with:
    enable-cache: true

- name: Set up Python
  run: uv python install 3.12

- name: Install dependencies
  run: uv sync --all-extras --dev

- name: Run tests
  run: uv run pytest
```

### Docker Integration

```dockerfile
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
CMD ["uv", "run", "python", "app.py"]
```

### Lockfile Workflows

```bash
uv lock
uv sync --frozen
uv lock --check
uv export --format requirements-txt > requirements.txt
uv export --format requirements-txt --hash > requirements.txt
```

## Performance Optimization

uv 默认使用全局缓存：
- Linux：`~/.cache/uv`
- macOS：`~/Library/Caches/uv`
- Windows：`%LOCALAPPDATA%\uv\cache`

```bash
uv cache clean
uv cache dir
uv sync --frozen --offline
```

## Common Workflows

### Starting a New Project

```bash
uv init my-project
cd my-project
uv python pin 3.12
uv add fastapi uvicorn pydantic
uv add --dev pytest black ruff mypy
mkdir -p src/my_project tests
uv run pytest
uv run black .
uv run ruff check .
```

### Maintaining Existing Project

```bash
git clone https://github.com/user/project.git
cd project
uv sync
uv sync --all-extras
uv lock --upgrade
uv run python app.py
uv run pytest
uv add new-package
git add pyproject.toml uv.lock
git commit -m "Add new-package dependency"
```

## Tool Integration

### Pre-commit Hooks

```yaml
repos:
  - repo: local
    hooks:
      - id: uv-lock
        name: uv lock
        entry: uv lock
        language: system
        pass_filenames: false
```

### VS Code Integration

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.testing.pytestEnabled": true
}
```

## Troubleshooting

```bash
# uv not found
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc

# Python version 不对
uv python pin 3.12
uv venv --python 3.12

# 依赖冲突
uv lock --verbose

# cache 问题
uv cache clean

# lockfile 不同步
uv lock --upgrade
```

## 最佳实践

1. 新项目优先 `uv init`
2. 提交 `uv.lock`
3. 用 `.python-version` pin Python 版本
4. 用 `uv run` 替代手动 activate
5. dev dependency 与 production dependency 分开
6. CI 中使用 `uv sync --frozen`
7. 利用全局 cache 加速
8. monorepo 使用 workspace
9. 需要兼容时导出 `requirements.txt`
10. 定期更新 uv

## Migration Guide

### From pip + requirements.txt

```bash
uv venv
uv pip install -r requirements.txt

# 更推荐
uv init
uv add -r requirements.txt
```

### From Poetry

```bash
uv sync
uv add requests
```

### From pip-tools

```bash
uv lock
uv sync --frozen
```

## Command Reference

```bash
uv init [PATH]
uv add PACKAGE
uv remove PACKAGE
uv sync
uv lock
uv venv [PATH]
uv run COMMAND
uv python install VERSION
uv python list
uv python pin VERSION
uv pip install PACKAGE
uv pip uninstall PACKAGE
uv pip freeze
uv pip list
uv cache clean
uv cache dir
uv --version
```

## Resources

- **Official documentation**: https://docs.astral.sh/uv/
- **GitHub repository**: https://github.com/astral-sh/uv
- **Astral blog**: https://astral.sh/blog
- **Migration guides**: https://docs.astral.sh/uv/guides/
