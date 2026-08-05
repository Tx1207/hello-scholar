#!/usr/bin/env python3
"""Static coverage checks for bilingual Skill source files."""

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = REPO_ROOT / "skills"


class SkillTranslationCoverageTests(unittest.TestCase):
    def test_every_product_skill_has_a_chinese_translation(self) -> None:
        """Ensure every discovered source Skill is usable with the Chinese language preference."""
        source_skills = sorted(SKILLS_ROOT.glob("*/SKILL.md"))
        self.assertTrue(source_skills, "Expected at least one source Skill")

        missing = [
            str(skill_path.parent.relative_to(REPO_ROOT) / "SKILL.zh_CN.md")
            for skill_path in source_skills
            if not skill_path.with_name("SKILL.zh_CN.md").is_file()
        ]
        self.assertEqual([], missing, f"Missing Chinese Skill translations: {missing}")

    def test_writing_great_skills_has_its_chinese_glossary(self) -> None:
        """Keep the Chinese Skill's disclosed definitions available in Chinese."""
        skill_path = SKILLS_ROOT / "writing-great-skills" / "SKILL.zh_CN.md"
        glossary_path = SKILLS_ROOT / "writing-great-skills" / "GLOSSARY.zh_CN.md"

        self.assertTrue(glossary_path.is_file())
        self.assertIn("](GLOSSARY.zh_CN.md)", skill_path.read_text(encoding="utf-8"))
        self.assertIn("## Predictability", glossary_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
