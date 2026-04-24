---
name: readme-updater
description: 通过分析最近代码变更和文档缺口，更新 README.md 以反映最新项目信息。
tags: [Documentation, README, Git, Development]
---

# README 更新器

根据最近的代码变更，更新 `README.md` 中的项目最新信息。

## 操作说明

1. **分析当前状态**
   - 阅读现有 `README.md`
   - 检查最近代码变更（`git log`）
   - 识别文档缺口

2. **判断需要更新的内容**
   检查：
   - 新增功能
   - 配置变化
   - 依赖更新
   - 安装说明
   - 使用示例
   - API 变化

3. **提出 README 更新建议**
   展示需要更新的 sections：
   ```markdown
   Proposed changes:
   - [ ] Update Installation section (new dependencies)
   - [ ] Add usage example for feature X
   - [ ] Update API documentation
   - [ ] Fix broken links
   ```

4. **更新 README**
   - 应用建议修改
   - 保持 markdown 格式
   - 保持语言风格一致
   - 保留结构稳定

5. **Commit 并 Push**
   - 使用 `docs(readme):` commit type
   - 示例：`docs(readme): update README documentation`

## 更新模式

- `--full` - 完整重写 README
- `--quick` - 只更新关键部分（installation、usage）
- 指定 section 名称 - 只更新该部分

## README 结构模板

更新 README 时，遵循以下结构：

```markdown
# Project Name

Short description of the project.

## Installation

### Requirements
- Python >= 3.8
- uv or pip

### Steps
uv sync

## 用法

### Basic Usage
# Example code

### Configuration
Describe config file location and format.

## API Documentation

Main interface descriptions.

## Development

### Running Tests
pytest

### Code Standards
- Follow PEP 8
- Use mypy for type checking
- Use ruff for linting

## Contributing

Pull requests welcome.

## License

MIT License
```

## 集成

更新 README 后，该 skill 会自动触发 `git-push` workflow，并使用 `docs(readme):` commit type。
