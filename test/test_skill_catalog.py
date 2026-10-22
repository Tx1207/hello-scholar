#!/usr/bin/env python3
"""Static catalog checks for the current hello-scholar Skill distribution."""

from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
CURRENT = {
    "manage-specs",
    "record-experiment",
    "review",
    "docs-maintenance",
    "handoff",
    "grilling",
    "ponytail",
    "synthesize",
    "release-code",
    "remote-run",
}
RETIRED = {
    "converge-to-spec",
    "crash-audit",
    "landing",
    "takeoff",
    "brainstorming",
    "writing-plans",
    "generating-tasks",
    "using-helloscholar",
    "test-driven-development",
    "using-git-worktrees",
    "writing-great-skills",
}


def frontmatter_name(text: str) -> str:
    """Return the required Skill name from a complete frontmatter block."""
    match = re.match(r"\A---\n(?P<header>.*?)\n---\n", text, re.DOTALL)
    if match is None:
        raise AssertionError("missing Skill frontmatter")
    for line in match.group("header").splitlines():
        key, separator, value = line.partition(":")
        if key == "name" and separator:
            return value.strip()
    raise AssertionError("missing Skill name")


class SkillCatalogTests(unittest.TestCase):
    def test_catalog_contains_exactly_ten_default_skills(self) -> None:
        discovered = {
            path.parent.name for path in SKILLS.glob("*/SKILL.md") if path.is_file()
        }
        self.assertEqual(CURRENT, discovered)
        self.assertTrue(RETIRED.isdisjoint(discovered))

    def test_every_installed_skill_has_a_chinese_mirror_with_the_same_identity(self) -> None:
        for name in CURRENT:
            english_path = SKILLS / name / "SKILL.md"
            chinese_path = SKILLS / name / "SKILL.zh_CN.md"
            self.assertTrue(chinese_path.is_file(), name)
            english = english_path.read_text(encoding="utf-8")
            chinese = chinese_path.read_text(encoding="utf-8")
            self.assertEqual(name, frontmatter_name(english))
            self.assertEqual(name, frontmatter_name(chinese))
            self.assertIn("description:", english)
            self.assertIn("description:", chinese)

    def test_every_user_facing_markdown_resource_has_a_chinese_mirror(self) -> None:
        resources = list(SKILLS.glob("*/assets/*.md"))
        resources.extend(SKILLS.glob("*/references/*.md"))
        for resource in resources:
            if resource.name.endswith(".zh_CN.md"):
                continue
            mirror = resource.with_name(f"{resource.stem}.zh_CN.md")
            self.assertTrue(mirror.is_file(), str(resource.relative_to(ROOT)))

    def test_entrypoint_resources_are_available_in_an_independent_install(self) -> None:
        for name in CURRENT:
            skill_root = (SKILLS / name).resolve()
            for entry in skill_root.glob("SKILL*.md"):
                for target in re.findall(r"\[[^\]]+\]\(([^)]+)\)", entry.read_text(encoding="utf-8")):
                    parsed = urlsplit(target)
                    if parsed.scheme or not parsed.path:
                        continue
                    resource = (entry.parent / unquote(parsed.path)).resolve()
                    with self.subTest(skill=name, target=target):
                        self.assertTrue(resource.is_relative_to(skill_root))
                        self.assertTrue(resource.is_file())


if __name__ == "__main__":
    unittest.main()
