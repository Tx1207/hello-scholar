---
name: readme-updater
description: Updates README.md with latest project information by analyzing recent code changes and documentation gaps.
tags: [Documentation, README, Git, Development]
---

# README Updater

Update README.md file with latest project information based on recent code changes.

## Instructions

1. **Analyze Current State**
   - Read existing README.md
   - Check recent code changes (git log)
   - Identify documentation gaps

2. **Determine Updates Needed**
   Check for:
   - New features added
   - Configuration changes
   - Dependencies updated
   - Installation instructions
   - Usage examples
   - API changes

3. **Propose README Updates**
   Show sections that need updating:
   ```markdown
   Proposed changes:
   - [ ] Update Installation section (new dependencies)
   - [ ] Add usage example for feature X
   - [ ] Update API documentation
   - [ ] Fix broken links
   ```

4. **Update README**
   - Apply proposed changes
   - Maintain markdown formatting
   - Keep language consistent
   - Preserve structure

5. **Commit and Push**
   - Use `docs(readme):` commit type
   - Example commit: `docs(readme): update README documentation`

## Update Modes

- `--full` - Complete README rewrite
- `--quick` - Only update critical sections (installation, usage)
- Specific section name - Update that section only

## README Structure Template

When updating README, follow this structure:

```markdown
# Project Name

Short description of the project.

## Installation

### Requirements
- Python >= 3.8
- uv or pip

### Steps
uv sync

## Usage

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

## Integration

After updating README, this skill automatically triggers the git-push workflow with `docs(readme):` commit type.
