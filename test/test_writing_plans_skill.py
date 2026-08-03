#!/usr/bin/env python3
"""Static contract checks for the high-level writing-plans Skill."""

from __future__ import annotations

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "writing-plans"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
TEMPLATE_FILES = (
    SKILL_DIR / "assets" / "plan-template.md",
    SKILL_DIR / "assets" / "plan-template.zh_CN.md",
)
RETIRED_REVIEWER_PROMPT = SKILL_DIR / "plan-document-reviewer-prompt.md"
PLAN_METADATA = {
    "schema": "1",
    "kind": "plan",
    "spec": "SPEC-000",
    "spec_revision": "1",
    "revision": "1",
    "status": "draft",
    "title": None,
    "summary": None,
    "created": "YYYY-MM-DD",
    "updated": "YYYY-MM-DD",
}
PLAN_SECTIONS = tuple(f"## {number}. {title}" for number, title in (
    (1, "Implementation Goal"),
    (2, "Scope"),
    (3, "Technical Strategy"),
    (4, "Affected Modules"),
    (5, "File Change Boundaries"),
    (6, "Interface Changes"),
    (7, "Implementation Phases"),
    (8, "Test and Experiment Strategy"),
    (9, "Migration Sequence"),
    (10, "Cleanup"),
    (11, "Rollback"),
    (12, "Tasks Generation Rules"),
))
FORBIDDEN_SKILL_TEXT = (
    "subagent-driven-development",
    "executing-plans",
    "hello-scholar/memory/plans",
    "## implementation tasks",
    "## execution handoff",
)


def parse_template(path: Path) -> tuple[dict[str, str], str]:
    """Purpose: parse a Plan template Front Matter block; Input: template path; Output: metadata fields and body; Errors: ValueError for malformed Front Matter."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing opening Front Matter")
    header, separator, body = text[4:].partition("\n---\n")
    if not separator:
        raise ValueError(f"{path}: missing closing Front Matter")
    fields: dict[str, str] = {}
    for line in header.splitlines():
        key, colon, value = line.partition(":")
        if not colon or not key or key in fields:
            raise ValueError(f"{path}: malformed metadata line {line!r}")
        fields[key] = value.strip()
    return fields, body


class WritingPlansSkillTests(unittest.TestCase):
    def test_skill_variants_write_only_high_level_bundle_plans(self) -> None:
        """Purpose: require Accepted Spec entry, Plan review, and Tasks handoff; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies a legacy execution or task-level contract."""
        for path in SKILL_FILES:
            self.assertTrue(path.is_file(), f"missing Skill file: {path}")
            text = path.read_text(encoding="utf-8")
            lowered = text.lower()
            self.assertIn("name: writing-plans", text)
            self.assertIn("spec.md", text)
            self.assertIn("status: accepted", text)
            self.assertIn("plan.md", text)
            self.assertIn("generating-tasks", text)
            self.assertIn("docs check", text)
            self.assertIn("docs sync", text)
            self.assertIn("status: draft", text)
            approval_instruction = (
                "status: approved"
                if path.name == "SKILL.md"
                else "`status` 设为 `approved`"
            )
            self.assertIn(approval_instruction, text)
            self.assertIn("migration", lowered)
            self.assertIn("cleanup", lowered)
            self.assertIn("rollback", lowered)
            for forbidden in FORBIDDEN_SKILL_TEXT:
                self.assertNotIn(forbidden, lowered, f"{path}: legacy contract {forbidden}")
            self.assertNotIn("- [ ]", text)

    def test_retired_reviewer_prompt_is_absent(self) -> None:
        """Purpose: remove the uncalled Plan reviewer workflow; Input: retired prompt path; Output: none; Errors: assertion failure identifies retained dead workflow."""
        self.assertFalse(RETIRED_REVIEWER_PROMPT.exists())

    def test_templates_define_the_plan_schema_and_twelve_sections(self) -> None:
        """Purpose: require a parseable high-level Plan template; Input: bilingual template paths; Output: none; Errors: assertion failure identifies schema drift or Task-level content."""
        for path in TEMPLATE_FILES:
            self.assertTrue(path.is_file(), f"missing template: {path}")
            fields, body = parse_template(path)
            self.assertEqual(set(PLAN_METADATA), set(fields))
            for key, value in PLAN_METADATA.items():
                if value is not None:
                    self.assertEqual(value, fields[key])
                else:
                    self.assertTrue(fields[key])
            for section in PLAN_SECTIONS:
                self.assertIn(section, body, f"{path}: missing {section}")
            self.assertIn("generating-tasks", body)
            self.assertNotIn("- [ ]", body)
            self.assertNotIn("## Implementation Tasks", body)
            self.assertNotIn("TODO", body)

    def test_generating_tasks_is_the_explicit_follow_up_owner(self) -> None:
        """Purpose: prevent task-level constraints from disappearing during Plan narrowing; Input: Plan Skill and generating-tasks Skill; Output: none; Errors: assertion failure identifies an absent handoff target."""
        task_skill = (
            REPO_ROOT / "skills" / "superpowers-skills" / "generating-tasks" / "SKILL.md"
        )
        self.assertTrue(task_skill.is_file())
        text = task_skill.read_text(encoding="utf-8")
        self.assertIn("tracer task", text.lower())
        self.assertIn("Spec Coverage", text)
        self.assertIn("Validation", text)
        self.assertIn("Completion", text)


if __name__ == "__main__":
    unittest.main()
