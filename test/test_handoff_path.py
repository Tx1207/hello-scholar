#!/usr/bin/env python3
"""Static contract checks for the Handoff root-path migration."""

from __future__ import annotations

import hashlib
from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "productivity-skills" / "handoff"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
NEW_PATH = "hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md"
OLD_PATH = "hello-scholar/memory/handoffs/"
TEMPLATE_HASHES = {
    "assets/handoff-template.md": "98ce21f050f99a9afe6ba63f9c9f1cb73c0019c518adab30a1c7a88f9ba74d7f",
    "assets/handoff-template.zh_CN.md": "6a1de147dd63444e2482eb20b3e3cfc2dd8b362f7e3bde9616b05f09e8f9d2e9",
}


class HandoffPathTests(unittest.TestCase):
    def test_new_handoffs_use_only_the_root_handoffs_path(self) -> None:
        """Purpose: require one current Handoff destination; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies a legacy or ambiguous write path."""

        for path in SKILL_FILES:
            self.assertTrue(path.is_file(), f"missing Handoff Skill: {path}")
            text = path.read_text(encoding="utf-8")
            self.assertIn(NEW_PATH, text)
            self.assertNotIn(OLD_PATH, text)
            self.assertIn("handoff", text.lower())
            self.assertNotIn("disable-model-invocation", text)
            self.assertIn("explicitly asks", text) if path.name == "SKILL.md" else self.assertIn("用户明确要求", text)
            self.assertIn("not belong to the Spec Bundle", text) if path.name == "SKILL.md" else self.assertIn("不属于 Spec Bundle", text)
            self.assertIn("Index", text)
            self.assertIn("memory", text)
            self.assertIn("do not infer", text.lower()) if path.name == "SKILL.md" else self.assertIn("不要根据任务提示语言推断", text)

    def test_saved_handoff_reports_path_and_continuation(self) -> None:
        """Purpose: require a concise user-facing Handoff outcome; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies a missing saved path or next-session focus."""

        english = SKILL_FILES[0].read_text(encoding="utf-8")
        chinese = SKILL_FILES[1].read_text(encoding="utf-8")
        for term in (
            "After a successful save",
            "exact Handoff path",
            "what the next session can continue",
            "Reference the document rather than reproducing its contents",
        ):
            self.assertIn(term, english)
        for term in (
            "成功保存后",
            "准确的 Handoff 路径",
            "下一次会话可以接续什么",
            "引用该文档，不复述其内容",
        ):
            self.assertIn(term, chinese)

    def test_templates_remain_byte_stable(self) -> None:
        """Purpose: preserve Handoff content and template ownership; Input: template bytes; Output: none; Errors: assertion failure identifies an unauthorized template change."""

        for relative_path, expected_hash in TEMPLATE_HASHES.items():
            with self.subTest(relative_path=relative_path):
                actual_hash = hashlib.sha256((SKILL_DIR / relative_path).read_bytes()).hexdigest()
                self.assertEqual(expected_hash, actual_hash)


if __name__ == "__main__":
    unittest.main()
