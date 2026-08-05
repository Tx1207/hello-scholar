#!/usr/bin/env python3
"""Static contract checks for explicit worktree-skill authorization."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "using-git-worktrees"
ENGLISH_PATH = SKILL_DIR / "SKILL.md"
CHINESE_PATH = SKILL_DIR / "SKILL.zh_CN.md"


def frontmatter_description(text: str) -> str:
    """Purpose: read one Skill description; Input: complete Skill text; Output: description value; Errors: ValueError for malformed Front Matter."""

    match = re.match(r"\A---\n(?P<header>.*?)\n---\n", text, re.DOTALL)
    if match is None:
        raise ValueError("Skill is missing a complete Front Matter block")
    for line in match.group("header").splitlines():
        key, separator, value = line.partition(":")
        if key == "description" and separator:
            return value.strip().strip('"')
    raise ValueError("Skill Front Matter is missing description")


class WorktreeExplicitTriggerTests(unittest.TestCase):
    def setUp(self) -> None:
        """Purpose: load both localized Worktree Skills; Input: repository Skill paths; Output: instance text fields; Errors: filesystem errors for missing files."""

        self.english = ENGLISH_PATH.read_text(encoding="utf-8")
        self.chinese = CHINESE_PATH.read_text(encoding="utf-8")
        self.all_text = f"{self.english}\n{self.chinese}"
        self.english_description = frontmatter_description(self.english)
        self.chinese_description = frontmatter_description(self.chinese)

    def test_frontmatter_has_only_narrow_explicit_triggers(self) -> None:
        """Purpose: reject automatic Plan entry; Input: localized Front Matter; Output: none; Errors: assertion failure for broad or incomplete triggering."""

        self.assertNotIn("before executing implementation plans", self.all_text.lower())
        self.assertNotIn("执行实现计划前", self.all_text)
        self.assertNotIn("disable-model-invocation", self.all_text)

        for phrase in (
            "user explicitly requests a Git worktree",
            "Approved Task explicitly requires a Worktree Process",
            "user explicitly approves an Agent's concrete isolation-risk recommendation",
        ):
            self.assertIn(phrase, self.english_description)
        for phrase in (
            "用户明确要求 Git worktree",
            "Approved Task 明确要求 Worktree Process",
            "用户明确批准 Agent 提出的具体隔离风险建议",
        ):
            self.assertIn(phrase, self.chinese_description)

    def test_entry_gate_requires_authorization_before_git_commands(self) -> None:
        """Purpose: preserve the three authorization paths; Input: localized Skill bodies; Output: none; Errors: assertion failure for an automatic or repeated-consent path."""

        for phrase in (
            "## Entry Gate",
            "Explicit user request",
            "Approved Task requirement",
            "Approved risk recommendation",
            "return to the current Task flow without running Git commands from this skill",
            "An ordinary Plan, Task, Feature, or Validation label is not authorization.",
            "An explicit user request, an Approved Task requirement, and an approved risk recommendation already provide creation consent.",
            "For a concrete risk recommendation that has not yet been approved",
        ):
            self.assertIn(phrase, self.english)

        for phrase in (
            "## 入口门",
            "用户明确请求",
            "Approved Task 要求",
            "已批准的风险建议",
            "返回当前 Task 流程，不运行后续 Git 命令。",
            "普通 Plan、Task、Feature 和 Validation 工作留在当前 Task 流程中。",
            "用户明确请求、Approved Task 要求和已批准的风险建议都已经提供创建同意。",
            "对于尚未获批的具体风险建议",
        ):
            self.assertIn(phrase, self.chinese)

    def test_legacy_global_fallback_is_not_available(self) -> None:
        """Purpose: prevent revived legacy worktree paths; Input: localized Skill bodies; Output: none; Errors: assertion failure if a retired path returns."""

        self.assertNotIn("~/.config/superpowers/worktrees", self.all_text)
        self.assertNotIn("legacy global directory", self.english)
        self.assertNotIn("legacy 全局目录", self.chinese)

    def test_safety_gates_survive_the_narrower_entry(self) -> None:
        """Purpose: retain isolation, native-tool, ignore, and baseline guards; Input: localized Skill bodies; Output: none; Errors: assertion failure for a removed safety boundary."""

        for text in (self.english, self.chinese):
            self.assertIn("Detect existing isolation first", text)
            self.assertIn("git rev-parse --show-superproject-working-tree", text)
            self.assertIn("GIT_DIR != GIT_COMMON", text)
            self.assertIn("linked worktree", text)
            self.assertIn("detached HEAD", text)
            self.assertIn("Worktree Tool", text)
            self.assertIn("Git Worktree Fallback", text)
            self.assertLess(text.index("Worktree Tool"), text.index("Git Worktree Fallback"))
            self.assertIn("git check-ignore -q", text)
            self.assertIn(".gitignore", text)
            self.assertIn("git worktree add", text)
            self.assertIn("npm test / cargo test / pytest / go test ./...", text)
            self.assertIn("baseline tests fail", text)
            self.assertNotIn("git worktree remove", text)

        self.assertIn("Do not claim the workspace is ready", self.english)
        self.assertIn("不要声称工作区已就绪", self.chinese)
        self.assertIn("Cleanup requires separate explicit authorization and real provenance", self.english)
        self.assertIn("清理需要单独的明确授权，以及工作区和分支的真实 provenance", self.chinese)

        self.assertIn("extra project change", self.english)
        self.assertIn("wait for explicit authorization", self.english)
        self.assertIn("额外的项目变更", self.chinese)
        self.assertIn("等待明确授权", self.chinese)


if __name__ == "__main__":
    unittest.main()
