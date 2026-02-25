---
name: project-creator
description: Creates a new project from a template with uv package management and Git initialization, including GitHub remote setup.
tags: [Project, Template, Git, uv, Initialization]
---

# Project Creator

Create a new project from a template, including uv initialization, Git setup, and optional GitHub remote repository creation.

## Steps

1. **Obtain Template Files**
   - From GitHub repository (default: `gaoruizhang/template`)
   - Or from local template directory (`~/Code/template`)
   - Exclude `.git`, `.idea`, `.DS_Store`, `__pycache__`, `*.pyc`

2. **Replace Project Name**
   - Update README.md title with project name
   - Update `pyproject.toml` project name field

3. **Initialize uv Project**
   - Run `uv init --no-readme` (README already from template)
   - Run `uv sync` to generate `uv.lock`

4. **Configure Git Repository**
   - Initialize git repo on `master` branch
   - Create initial commit with project structure
   - Create initial version tag (`v0.1.0`)
   - Create `develop` branch from master

5. **Optional: Create GitHub Remote**
   - Use `gh repo create` to create a private remote repository
   - Push master, develop branches and initial tag
   - Display repository URL

## Parameters

- **project_name** (required) - Name of the new project
- **path** (optional) - Project path, defaults to `~/Code/`
- **template_repo** (optional) - GitHub template repo in `owner/repo` format or full URL (default: `gaoruizhang/template`)
- **local** (optional) - Use local template at `~/Code/template` instead of GitHub

## Git Workflow Reference

After project creation:
- `master` - Production branch (no direct pushes)
- `develop` - Development branch
- `feature/xxx` - Feature branches (created from develop)
- `bugfix/xxx` - Bug fix branches (created from develop)

## uv Quick Reference

```bash
uv run python script.py          # Run script (no venv activation needed)
uv add <package>                  # Add dependency
uv add --dev pytest black ruff    # Add dev dependencies
uv lock --check                   # Check if lockfile is up to date
uv sync --frozen                  # Use in CI (exact versions)
```
