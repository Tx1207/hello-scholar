# 技术栈识别

## Python
查找 `pyproject.toml`、`uv.lock`、`requirements.txt` 或 `pytest.ini`。
如果仓库由 `uv` 管理，优先使用 `uv` 命令。

## Node.js / TypeScript
查找 `package.json`、`pnpm-lock.yaml`、`tsconfig.json`。
沿用仓库当前已经在使用的包管理器。

## 混合仓库
只运行与本次改动区域相关的检查；如果变更范围很明确，不要强行把每种语言的工具都跑一遍。
