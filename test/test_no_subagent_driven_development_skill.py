"""Regression checks for the retired subagent-driven-development Skill."""

from __future__ import annotations

import re
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
RETIRED_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "subagent-driven-development"
EXPECTED_RETIRED_FILES = {
    "SKILL.md",
    "SKILL.zh_CN.md",
    "implementer-prompt.md",
    "spec-reviewer-prompt.md",
    "code-quality-reviewer-prompt.md",
}
EVAL_WORKFLOW = REPO_ROOT / "test" / "skill-evals" / "WORKFLOW.md"


def discovered_skill_names() -> set[str]:
    """Purpose: enumerate source Skill identities; Input: repository Skill packages; Output: discovered Front Matter names; Side effects: reads SKILL.md files."""
    names: set[str] = set()
    for skill_md in (REPO_ROOT / "skills").glob("*/*/SKILL.md"):
        text = skill_md.read_text(encoding="utf-8")
        match = re.search(r"^name:\s*([^\n]+)$", text, re.MULTILINE)
        if match:
            names.add(match.group(1).strip())
    return names


class NoSubagentDrivenDevelopmentSkillTests(unittest.TestCase):
    def test_retired_package_and_discovery_name_are_absent(self) -> None:
        self.assertFalse(RETIRED_DIR.exists())
        for relative_path in EXPECTED_RETIRED_FILES:
            self.assertFalse((RETIRED_DIR / relative_path).exists())
        self.assertNotIn("subagent-driven-development", discovered_skill_names())

    def test_eval_workflow_retains_isolated_implementer_and_reviewer(self) -> None:
        workflow = EVAL_WORKFLOW.read_text(encoding="utf-8")
        for phrase in (
            "全新 Implementer subagent",
            "独立 Reviewer subagent",
            "Implementer 与 Reviewer 都必须是全新 Sonnet subagent",
            "两个角色的 Agent ID 必须不同",
        ):
            self.assertIn(phrase, workflow)


if __name__ == "__main__":
    unittest.main()
