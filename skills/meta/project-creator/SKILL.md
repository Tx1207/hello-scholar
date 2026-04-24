---
name: project-creator
description: 使用模板、uv 包管理和 Git 初始化创建一个新项目，并可选配置 GitHub 远程仓库。
tags: [Project, Template, Git, uv, Initialization]
---

# Project Creator

基于模板创建新项目，包括 uv 初始化、Git 设置，以及可选的 GitHub 远程仓库创建。

## 步骤

1. **获取模板文件**
   - 从 GitHub 仓库获取（默认：`gaoruizhang/template`）
   - 或从本地模板目录获取（`~/Code/template`）
   - 排除 `.git`、`.idea`、`.DS_Store`、`__pycache__`、`*.pyc`

2. **替换项目名**
   - 更新 `README.md` 标题
   - 更新 `pyproject.toml` 中的 project name 字段

3. **初始化 uv 项目**
   - 运行 `uv init --no-readme`（因为 README 已来自模板）
   - 运行 `uv sync` 生成 `uv.lock`

4. **配置 Git 仓库**
   - 在 `master` 分支上初始化 git repo
   - 以项目结构创建初始 commit
   - 创建初始版本 tag（`v0.1.0`）
   - 从 master 创建 `develop` 分支

5. **可选：创建 GitHub 远程仓库**
   - 使用 `gh repo create` 创建私有远程仓库
   - Push `master`、`develop` 分支和初始 tag
   - 展示仓库 URL

## 参数

- **project_name**（必填）- 新项目名称
- **path**（可选）- 项目路径，默认为 `~/Code/`
- **template_repo**（可选）- `owner/repo` 格式或完整 URL 的 GitHub 模板仓库（默认：`gaoruizhang/template`）
- **local**（可选）- 使用本地模板 `~/Code/template`，而不是 GitHub

## Git Workflow 参考

项目创建后：
- `master` - 生产分支（不允许直接 push）
- `develop` - 开发分支
- `feature/xxx` - 功能分支（从 develop 创建）
- `bugfix/xxx` - 缺陷修复分支（从 develop 创建）

## uv 快速参考

```bash
uv run python script.py          # 运行脚本（无需激活 venv）
uv add <package>                 # 添加依赖
uv add --dev pytest black ruff   # 添加开发依赖
uv lock --check                  # 检查 lockfile 是否最新
uv sync --frozen                 # 在 CI 中使用（精确版本）
```
