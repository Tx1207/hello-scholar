#!/usr/bin/env python3
"""Static contract checks for the bilingual grilling Skill."""

from __future__ import annotations

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "grilling"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")


class GrillingSkillTests(unittest.TestCase):
    def test_question_cards_have_bilingual_titles_options_and_recommendations(self) -> None:
        """Require the selected card layout without wrapper-level status icons."""
        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)

        for text in (english, chinese):
            self.assertIn("#### Q1｜", text)
            for option in ("A", "B", "C"):
                self.assertIn(f"- {option}｜", text)
            self.assertNotIn("❓ **Q1**", text)
            self.assertNotIn("➡️", text)
            self.assertNotIn("**Q1** -", text)

        self.assertIn("Recommendation: **A**:", english)
        self.assertIn("推荐：**A**:", chinese)

    def test_design_tree_round_and_frontier_process_remains_bilingual(self) -> None:
        """Keep the dependency tree while requiring one question per round."""
        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)

        for term in ("design tree", "rounds", "frontier", "choose exactly one question", "Ask only one question"):
            self.assertIn(term, english)
        for term in ("设计树", "轮次", "前沿", "选择恰好一个问题", "任何一轮都只提出一个问题"):
            self.assertIn(term, chinese)

        self.assertNotIn("Ask the whole frontier", english)
        self.assertNotIn("问完整个前沿", chinese)


if __name__ == "__main__":
    unittest.main()
