#!/usr/bin/env python3
"""Static contract checks for installed hello-scholar CLI usage in Skills."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_FILES = tuple(sorted((REPO_ROOT / "skills").glob("*/SKILL*.md")))
ABSOLUTE_CLI_PATTERNS = (
    re.compile(r"absolute[^\n.]{0,60}hello-scholar", re.IGNORECASE),
    re.compile(r"hello-scholar[^\n.]{0,60}absolute", re.IGNORECASE),
    re.compile(r"绝对(?:路径)?[^\n。]{0,60}(?:hello-scholar|CLI)"),
)


class SkillCliInvocationTests(unittest.TestCase):
    def test_production_skills_use_the_installed_hello_scholar_command(self) -> None:
        """Reject repository-relative Node entry points and absolute-path requirements."""
        self.assertTrue(SKILL_FILES, "no production Skill files found")
        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            with self.subTest(path=path.relative_to(REPO_ROOT)):
                self.assertNotIn("<hello-scholar-repo>", text)
                self.assertNotIn("bin/hello-scholar.js", text)
                for pattern in ABSOLUTE_CLI_PATTERNS:
                    self.assertIsNone(pattern.search(text), pattern.pattern)


if __name__ == "__main__":
    unittest.main()
