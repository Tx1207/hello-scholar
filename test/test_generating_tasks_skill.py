#!/usr/bin/env python3
"""Static contract checks for the generating-tasks Skill and templates."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "generating-tasks"
TASK_LABELS = (
    "Spec Coverage",
    "Depends On",
    "Parallel",
    "Files",
    "Work",
    "Validation",
    "Completion",
)
TEMPLATE_METADATA = {
    "schema": "1",
    "kind": "tasks",
    "spec": "SPEC-000",
    "spec_revision": "1",
    "plan_revision": "1",
    "revision": "1",
    "approval": "pending-review",
    "approved_revision": "null",
    "status": "pending",
    "created": "YYYY-MM-DD",
    "updated": "YYYY-MM-DD",
}


def parse_template(path: Path) -> tuple[dict[str, str], str]:
    """Purpose: parse a static Tasks template; Input: template Markdown path; Output: Front Matter fields and body; Errors: ValueError for malformed Front Matter."""

    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(r"---\n(?P<header>.*?)\n---\n(?P<body>.*)", text, re.DOTALL)
    if match is None:
        raise ValueError(f"{path}: expected a complete Front Matter block")
    attributes: dict[str, str] = {}
    for line in match.group("header").splitlines():
        key, separator, value = line.partition(":")
        if not separator or not key or key in attributes:
            raise ValueError(f"{path}: invalid Front Matter line {line!r}")
        attributes[key] = value.strip()
    return attributes, match.group("body")


class GeneratingTasksSkillTests(unittest.TestCase):
    def test_skill_files_bind_decomposition_to_approved_plan_review(self) -> None:
        """Purpose: require the new Skill's ownership, clean validation, and hard gates; Input: production Skill texts; Output: none; Errors: assertion failure for missing contract instructions."""

        english_path = SKILL_DIR / "SKILL.md"
        chinese_path = SKILL_DIR / "SKILL.zh_CN.md"
        for path in (english_path, chinese_path):
            self.assertTrue(path.exists(), f"Missing generating-tasks file: {path}")

        english = english_path.read_text(encoding="utf-8")
        chinese = chinese_path.read_text(encoding="utf-8")
        for text in (english, chinese):
            self.assertIn("name: generating-tasks", text)
            self.assertIn("decomposition", text.lower())
            self.assertIn("spec.md", text)
            self.assertIn("plan.md", text)
            self.assertIn("docs check", text)
            self.assertIn("docs sync", text)
            self.assertIn("PYTHONDONTWRITEBYTECODE=1", text)
            self.assertIn("pending-review", text)
            self.assertIn("approved_revision", text)
            self.assertIn("status: pending", text)
            self.assertIn("Red-Green-Refactor", text)
            for label in TASK_LABELS:
                self.assertIn(label, text)
            self.assertNotIn("TODO", text)

        self.assertIn("approved Plan", english)
        self.assertIn("Approved Plan", chinese)
        self.assertIn("Read `spec.md` in full, then read `plan.md` in full.", english)
        self.assertIn("完整读取 `spec.md`，再完整读取 `plan.md`", chinese)
        self.assertIn("explicitly requires TDD", english)
        self.assertIn("明确要求 TDD", chinese)
        self.assertIn("user review", english.lower())
        self.assertIn("用户审核", chinese)

        for text in (english, chinese):
            self.assertIn("tracer task", text.lower())
            self.assertIn("horizontal slice", text.lower())
            self.assertIn("expand–migrate–contract", text.lower())
            self.assertIn("frontier", text.lower())
            self.assertIn("2–5 minute", text.lower())
            self.assertIn("PYTHONDONTWRITEBYTECODE=1 python3 -B", text)
            self.assertIn("approval: pending-review", text)
            self.assertIn("status: pending", text)
            self.assertIn("Spec Coverage", text)
            self.assertIn("Depends On", text)
            self.assertIn("Parallel", text)
            self.assertIn("Files", text)
            self.assertIn("Work", text)
            self.assertIn("Validation", text)
            self.assertIn("Completion", text)

        self.assertIn("Copy the chosen template as the starting skeleton", english)
        self.assertIn("`approval: pending-review` is the review state", english)
        self.assertIn("every top-level `TNNN` has", english)
        self.assertIn("column-zero canonical checkbox block", english)
        self.assertIn("A Task Map or titled section is not a Task substitute", english)
        self.assertIn("先把选定模板作为起始骨架复制", chinese)
        self.assertIn("`approval: pending-review` 是审核状态", chinese)
        self.assertIn("每个顶层 `TNNN` 都把", chinese)
        self.assertIn("列零的规范复选框块", chinese)
        self.assertIn("Task Map 或带标题的章节不能替代 Task", chinese)

    def test_templates_match_their_language(self) -> None:
        """Purpose: keep each language template aligned with its filename; Input: English and Chinese Tasks templates; Output: none; Errors: assertion failure for swapped or mixed template content."""

        english = (SKILL_DIR / "assets" / "tasks-template.md").read_text(
            encoding="utf-8"
        )
        chinese = (SKILL_DIR / "assets" / "tasks-template.zh_CN.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("# <Spec title> Tasks", english)
        self.assertIn("<plain-language goal>", english)
        self.assertNotIn("<Spec 标题>", english)
        self.assertIn("# <Spec 标题> Tasks", chinese)
        self.assertIn("<清晰的自然语言目标>", chinese)
        self.assertNotIn("<Spec title>", chinese)

    def test_templates_parse_to_pending_tasks_and_one_complete_task(self) -> None:
        """Purpose: require valid pending Tasks templates; Input: English and Chinese template paths; Output: none; Errors: assertion failure for metadata or standalone Task omissions."""

        templates = (
            SKILL_DIR / "assets" / "tasks-template.md",
            SKILL_DIR / "assets" / "tasks-template.zh_CN.md",
        )
        for path in templates:
            self.assertTrue(path.exists(), f"Missing generating-tasks template: {path}")
            attributes, body = parse_template(path)
            self.assertEqual(TEMPLATE_METADATA, attributes)
            self.assertEqual(
                1,
                len(re.findall(r"(?m)^- \[ \] T\d{3}: ", body)),
                f"{path}: template must demonstrate exactly one top-level Task",
            )
            for label in TASK_LABELS:
                self.assertIn(f"- {label}:", body)
            self.assertNotIn("Red-Green-Refactor", body)
            self.assertNotIn("test-driven-development", body)
            self.assertIn("pending-review", path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
