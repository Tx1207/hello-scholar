#!/usr/bin/env python3
"""Static contract checks for the manage-specs Skill and Spec templates."""

from __future__ import annotations

from pathlib import Path
import subprocess
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "hello-scholar" / "manage-specs"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
TEMPLATE_FILES = (
    SKILL_DIR / "assets" / "spec-template.md",
    SKILL_DIR / "assets" / "spec-template.zh_CN.md",
)
CLASSIFICATIONS = (
    "Update Existing Spec",
    "Create Independent Spec",
    "Create Successor Spec",
    "Need Human Classification",
)
METADATA_FIELDS = (
    "schema",
    "kind",
    "id",
    "title",
    "topic",
    "type",
    "status",
    "revision",
    "summary",
    "created",
    "updated",
    "supersedes",
    "superseded_by",
)
ENGLISH_SECTIONS = (
    "## 1. Value and Current Decision",
    "## 2. Problem and Current Facts",
    "## 3. Goals and Non-goals",
    "## 4. Target Design",
    "## 5. Interfaces, Data, and Invariants",
    "## 6. Implementation Boundaries",
    "## 7. Acceptance and Validation",
)
CHINESE_SECTIONS = (
    "## 1. 价值与当前决定",
    "## 2. 问题与当前事实",
    "## 3. 目标与非目标",
    "## 4. 目标设计",
    "## 5. 接口、数据与不变量",
    "## 6. 实施边界",
    "## 7. 验收与验证",
)


class ManageSpecsSkillTests(unittest.TestCase):
    def test_skill_variants_bind_the_four_classifications_and_write_boundaries(self) -> None:
        """Purpose: require the classification owner, confirmation gates, and limited Spec transaction; Input: both production Skill texts; Output: none; Errors: assertion failure identifies a missing behavior boundary."""
        texts = []
        for path in SKILL_FILES:
            self.assertTrue(path.is_file(), f"missing Skill file: {path}")
            texts.append(path.read_text(encoding="utf-8"))

        for text in texts:
            self.assertIn("name: manage-specs", text)
            self.assertIn("classification", text.lower())
            for classification in CLASSIFICATIONS:
                self.assertIn(classification, text)
            self.assertIn("docs sync", text)
            self.assertIn("docs check", text)
            self.assertIn("SPEC-", text)
            self.assertIn("draft", text)
            self.assertIn("accepted", text)
            self.assertIn("supersedes", text)
            self.assertIn("superseded_by", text)
            self.assertIn("Revision History", text)
            self.assertIn("Plan", text)
            self.assertIn("Tasks", text)
            self.assertNotIn("hello-scholar/memory/", text)
            self.assertNotIn("TODO", text)

        self.assertIn("explicitly confirms", texts[0])
        self.assertIn("maximum", texts[0].lower())
        self.assertIn("用户明确确认", texts[1])
        self.assertIn("全局最大", texts[1])
        self.assertIn("acyclic", texts[0])
        self.assertIn("无环", texts[1])

    def test_templates_have_parseable_spec_front_matter_and_core_sections(self) -> None:
        """Purpose: require canonical Spec metadata and all seven core sections; Input: bilingual template files; Output: none; Errors: assertion failure identifies an invalid or incomplete template."""
        for path, sections in zip(TEMPLATE_FILES, (ENGLISH_SECTIONS, CHINESE_SECTIONS)):
            self.assertTrue(path.is_file(), f"missing template: {path}")
            text = path.read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---\n"), f"{path}: missing Front Matter")
            header, separator, body = text[4:].partition("\n---\n")
            self.assertTrue(separator, f"{path}: unclosed Front Matter")
            fields = {}
            for line in header.splitlines():
                key, colon, value = line.partition(":")
                self.assertTrue(colon, f"{path}: malformed metadata line {line!r}")
                self.assertNotIn(key, fields, f"{path}: duplicate metadata {key}")
                fields[key] = value.strip()
            self.assertEqual(set(METADATA_FIELDS), set(fields), f"{path}: metadata fields")
            self.assertEqual("1", fields["schema"])
            self.assertEqual("spec", fields["kind"])
            self.assertEqual("SPEC-000", fields["id"])
            self.assertEqual("draft", fields["status"])
            self.assertEqual("1", fields["revision"])
            self.assertEqual("[]", fields["supersedes"])
            self.assertEqual("null", fields["superseded_by"])
            for section in sections:
                self.assertIn(section, body, f"{path}: missing {section}")
            self.assertNotIn("TBD", text)
            self.assertNotIn("TODO", text)

    def test_templates_are_accepted_by_the_repository_front_matter_parser(self) -> None:
        """Purpose: exercise the repository's Front Matter parser against both templates; Input: parser module and template paths; Output: none; Errors: subprocess failure exposes parser incompatibility."""
        program = """
const fs = require('node:fs');
const { parseFrontMatter } = require(process.argv[1]);
for (const path of process.argv.slice(2)) {
  const parsed = parseFrontMatter(fs.readFileSync(path, 'utf8'), path);
  if (parsed.attributes.kind !== 'spec') process.exit(2);
}
"""
        result = subprocess.run(
            [
                "node",
                "-e",
                program,
                str(REPO_ROOT / "src" / "frontmatter.js"),
                *(str(path) for path in TEMPLATE_FILES),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(0, result.returncode, result.stderr)


if __name__ == "__main__":
    unittest.main()
