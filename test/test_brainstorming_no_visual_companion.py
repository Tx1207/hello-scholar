"""Regression checks for the retired Brainstorming Visual Companion branch."""

from __future__ import annotations

import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
BRAINSTORMING_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "brainstorming"
MANAGE_SPECS_ASSETS = REPO_ROOT / "skills" / "hello-scholar" / "manage-specs" / "assets"
RETIRED_FILES = {
    "visual-companion.md",
    "scripts/frame-template.html",
    "scripts/helper.js",
    "scripts/server.cjs",
    "scripts/start-server.sh",
    "scripts/stop-server.sh",
}
PROTECTED_FILES = {
    "SKILL.md",
    "SKILL.zh_CN.md",
}
RETIRED_SPEC_FILES = {
    "assets/spec-template.md",
    "assets/spec-template.zh_CN.md",
    "spec-document-reviewer-prompt.md",
}
FORBIDDEN_TEXT = (
    "visual companion",
    "visual-companion.md",
    "start-server.sh",
    "stop-server.sh",
    "brainstorm/visual",
    "memory/brainstorm",
)


def skill_texts() -> tuple[str, str]:
    """Purpose: load both Brainstorming Skill variants; Input: repository Skill files; Output: English and Chinese text; Side effects: reads files."""
    return tuple(
        (BRAINSTORMING_DIR / name).read_text(encoding="utf-8")
        for name in ("SKILL.md", "SKILL.zh_CN.md")
    )


class NoBrainstormingVisualCompanionTests(unittest.TestCase):
    def test_retired_branch_files_are_absent_and_required_files_remain(self) -> None:
        for relative_path in RETIRED_FILES | RETIRED_SPEC_FILES:
            self.assertFalse((BRAINSTORMING_DIR / relative_path).exists())
        for relative_path in PROTECTED_FILES:
            self.assertTrue((BRAINSTORMING_DIR / relative_path).is_file())
        for template in ("spec-template.md", "spec-template.zh_CN.md"):
            self.assertTrue((MANAGE_SPECS_ASSETS / template).is_file())

    def test_skill_variants_contain_no_visual_branch_or_legacy_path(self) -> None:
        for text in skill_texts():
            lowered = text.lower()
            for forbidden in FORBIDDEN_TEXT:
                self.assertNotIn(forbidden, lowered)

    def test_graphviz_flows_directly_from_context_to_questions(self) -> None:
        for text in skill_texts():
            self.assertIn('"Explore project context" -> "Ask clarifying questions";', text)


if __name__ == "__main__":
    unittest.main()
