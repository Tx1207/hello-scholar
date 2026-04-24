# Skill 完整性检查

## 最小本地检查

```bash
# 检查 SKILL.md 中引用的资源
rg -n "references/|examples/|scripts/|assets/" SKILL.md

# 查看 skill 文件清单
find . -maxdepth 2 -type f | sort

# 检查明显的编辑器 / cache 噪声
find . -type d -name "__pycache__" -o -name ".DS_Store"
```

## 常见失败模式

- `SKILL.md` 提到了从未创建的 references。
- 迁移后的 skill 仍引用旧的 agent 或 plugin 名称。
- 目录里混入日志或 session artifacts。
- frontmatter 的 `name` 和目录 slug 不一致。
- skill 声称有 script 路径，但实际上没有可运行脚本。
