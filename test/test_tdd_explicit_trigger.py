#!/usr/bin/env python3
"""Static contract checks for the explicit TDD entry gate."""

from __future__ import annotations

import hashlib
import re
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "test-driven-development"
SKILL_PATHS = {
    "english": SKILL_DIR / "SKILL.md",
    "chinese": SKILL_DIR / "SKILL.zh_CN.md",
}
PROTECTED_REFERENCE_HASHES = {
    "testing-anti-patterns.md": "bde453bc258f06543987477c837939afaa774ea2acbd9f308d702fc452bc4283",
    "references/evidence-pattern-gallery.md": "94cc63e772b9cfc4ca5b6a3c62cde5a35b1faf52fe59150d2dce1bd6c9d3c041",
    "references/evidence-pattern-gallery.zh_CN.md": "4726b810706e080bcf1795c6bddebc21daff7091380dd877574fa74f83d37884",
}


def skill_texts() -> dict[str, str]:
    """Load both TDD Skill variants."""
    return {
        language: path.read_text(encoding="utf-8")
        for language, path in SKILL_PATHS.items()
    }


def description(text: str) -> str:
    """Extract the model-facing description from a Skill file."""
    match = re.search(r"^description:\s*(.+)$", text, re.MULTILINE)
    if match is None:
        raise AssertionError("Skill Front Matter must contain description")
    return match.group(1).strip()


class TddExplicitTriggerTests(unittest.TestCase):
    def test_descriptions_expose_only_explicit_tdd_entry_points(self) -> None:
        texts = skill_texts()
        english = description(texts["english"])
        chinese = description(texts["chinese"])

        self.assertIn("TDD", english)
        self.assertIn("test-first", english)
        self.assertIn("Red-Green-Refactor", english)
        self.assertIn("Approved Task", english)
        self.assertIn("TDD Process", english)
        self.assertIn("TDD", chinese)
        self.assertIn("测试优先", chinese)
        self.assertIn("Red-Green-Refactor", chinese)
        self.assertIn("Approved Task", chinese)
        self.assertIn("TDD Process", chinese)

        for metadata in (english.lower(), chinese.lower()):
            for generic_trigger in (
                "feature",
                "bug",
                "behavior change",
                "功能",
                "重构",
                "行为变更",
                "验证",
            ):
                self.assertNotIn(generic_trigger, metadata)
        for text in texts.values():
            self.assertNotIn("disable-model-invocation", text)

    def test_entry_gate_exits_for_ordinary_work_and_validation_only(self) -> None:
        for language, text in skill_texts().items():
            with self.subTest(language=language):
                self.assertNotIn("## When to Use", text)
                self.assertNotIn("Always:", text)
                self.assertNotIn("始终使用", text)
                gate = re.search(
                    r"## (?:Explicit Entry Gate|显式入口门)(.*?)(?=\n## )",
                    text,
                    re.DOTALL,
                )
                self.assertIsNotNone(gate, "Missing explicit entry gate")
                assert gate is not None
                gate_text = gate.group(1)
                self.assertIn("$test-driven-development", gate_text)
                self.assertIn("TDD", gate_text)
                self.assertIn("Red-Green-Refactor", gate_text)
                self.assertIn("Approved Task", gate_text)
                self.assertIn("TDD Process", gate_text)
                self.assertIn("Validation", gate_text)
                self.assertIn(
                    "exit" if language == "english" else "退出",
                    gate_text.lower() if language == "english" else gate_text,
                )
                self.assertIn("AGENTS", gate_text)
                iron_law = "## The Iron Law" if language == "english" else "## 铁律"
                self.assertLess(text.index(gate.group(0)), text.index(iron_law))

    def test_confirmed_seam_precedes_red_evidence(self) -> None:
        expected_by_language = {
            "english": (
                "## Confirm the Seam",
                "Before RED",
                "public interface or observable behavior",
                "one bounded question",
                "unconfirmed internal collaborator or private method",
                "one confirmed seam and one observable behavior",
                "### RED - Write Failing Evidence",
            ),
            "chinese": (
                "## 确认测试边界（Seam）",
                "在 RED 之前",
                "公共接口或可观察行为",
                "一个有界问题",
                "未经确认的内部协作者或私有方法",
                "一个已确认的测试边界和一个可观察行为",
                "### RED - 编写失败证据",
            ),
        }
        for language, text in skill_texts().items():
            with self.subTest(language=language):
                for required in expected_by_language[language]:
                    self.assertIn(required, text)
                self.assertLess(
                    text.index(expected_by_language[language][0]),
                    text.index(expected_by_language[language][-1]),
                )

    def test_explicit_entry_preserves_nonoptional_red_green_refactor(self) -> None:
        required_by_language = {
            "english": (
                "## The Iron Law",
                "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST",
                "## Red-Green-Refactor",
                "### RED - Write Failing Evidence",
                "### Verify RED - Watch It Fail",
                "### GREEN - Minimal Code",
                "### Verify GREEN - Watch It Pass",
                "### REFACTOR - Clean Up",
                "Tests after are not TDD.",
            ),
            "chinese": (
                "## 铁律",
                "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST",
                "## Red-Green-Refactor",
                "### RED - 编写失败证据",
                "### 验证 RED - 看它失败",
                "### GREEN - 最小代码",
                "### 验证 GREEN - 看它通过",
                "### REFACTOR - 清理",
                "事后测试不是 TDD。",
            ),
        }
        for language, text in skill_texts().items():
            with self.subTest(language=language):
                for required in required_by_language[language]:
                    self.assertIn(required, text)
                self.assertNotIn("optional", text.lower())
                self.assertNotIn("if convenient", text.lower())
                self.assertNotRegex(text.lower(), r"(?:may|can)\s+(?:use|write|add)\s+tests?\s+after")

    def test_evidence_patterns_and_disclosed_references_remain_available(self) -> None:
        expected = {
            "english": (
                "behavior-unit-test",
                "contract-integration-test",
                "prompt-eval-case",
                "rag-eval-case",
                "agent-trajectory-test",
                "research-benchmark",
                "skill-pressure-test",
                "macro-eval",
                "@testing-anti-patterns.md",
                "references/evidence-pattern-gallery.md",
            ),
            "chinese": (
                "behavior-unit-test",
                "contract-integration-test",
                "prompt-eval-case",
                "rag-eval-case",
                "agent-trajectory-test",
                "research-benchmark",
                "skill-pressure-test",
                "macro-eval",
                "@testing-anti-patterns.md",
                "references/evidence-pattern-gallery.zh_CN.md",
            ),
        }
        for language, text in skill_texts().items():
            with self.subTest(language=language):
                for required in expected[language]:
                    self.assertIn(required, text)

    def test_supporting_references_are_byte_stable(self) -> None:
        for relative_path, expected_hash in PROTECTED_REFERENCE_HASHES.items():
            with self.subTest(relative_path=relative_path):
                actual_hash = hashlib.sha256(
                    (SKILL_DIR / relative_path).read_bytes()
                ).hexdigest()
                self.assertEqual(expected_hash, actual_hash)


if __name__ == "__main__":
    unittest.main()
