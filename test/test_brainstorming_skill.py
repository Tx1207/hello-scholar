#!/usr/bin/env python3
"""Static contract checks for Brainstorming's Spec Bundle integration."""

from __future__ import annotations

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
BRAINSTORMING_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "brainstorming"
MANAGE_SPECS_DIR = REPO_ROOT / "skills" / "hello-scholar" / "manage-specs"
SKILL_FILES = (BRAINSTORMING_DIR / "SKILL.md", BRAINSTORMING_DIR / "SKILL.zh_CN.md")
ENGLISH_CORE_SECTIONS = (
    "Value and Current Decision",
    "Problem and Current Facts",
    "Goals and Non-goals",
    "Target Design",
    "Interfaces, Data, and Invariants",
    "Implementation Boundaries",
    "Acceptance and Validation",
)
CHINESE_CORE_SECTIONS = (
    "价值与当前决定",
    "问题与当前事实",
    "目标与非目标",
    "目标设计",
    "接口、数据与不变量",
    "实施边界",
    "验收与验证",
)
CLASSIFICATIONS = (
    "Update Existing Spec",
    "Create Independent Spec",
    "Create Successor Spec",
    "Need Human Classification",
)


class BrainstormingSkillTests(unittest.TestCase):
    def test_model_invocation_is_narrow_but_design_dialogue_is_preserved(self) -> None:
        """Purpose: limit automatic entry to material design work; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies an overbroad trigger or missing design gate."""

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        for path, text in zip(SKILL_FILES, (english, chinese)):
            self.assertTrue(path.is_file(), f"missing Brainstorming Skill: {path}")
            self.assertIn("name: brainstorming", text)
            self.assertNotIn("disable-model-invocation", text)
            self.assertNotIn("hello-scholar/memory/", text)
            self.assertNotIn("visual companion", text.lower())
            self.assertNotIn("spec-document-reviewer", text)
            self.assertNotIn("commit", text.lower())

        for required in (
            "new capability",
            "external behavior/interface/module change",
            "material tradeoffs",
            "routine implementation",
            "existing-code experiments",
            "one question at a time",
            "2–3 approaches",
            "user approval",
        ):
            self.assertIn(required, english.lower())
        for required in (
            "新能力",
            "外部行为、接口或模块变化",
            "材料性权衡",
            "常规实施",
            "已有代码实验",
            "一次一个问题",
            "2–3 种可行方案",
            "用户批准",
        ):
            self.assertIn(required, chinese)

    def test_manage_specs_owns_identity_and_bundle_write(self) -> None:
        """Purpose: bind Brainstorming to the sole Spec identity owner; Input: bilingual Skill texts and owner templates; Output: none; Errors: assertion failure identifies duplicated identity logic or an obsolete write path."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            self.assertIn("$manage-specs", text)
            self.assertIn("hello-scholar/specs/<topic-id>/SPEC-NNN-<design-name>/spec.md", text)
            self.assertIn("docs check", text)
            self.assertIn("docs sync", text)
            self.assertIn("repository language preference", text) if path.name == "SKILL.md" else self.assertIn("仓库语言偏好", text)
            self.assertIn("user-readable", text) if path.name == "SKILL.md" else self.assertIn("用户可读", text)
            self.assertIn("do not infer", text.lower()) if path.name == "SKILL.md" else self.assertIn("不要根据任务提示语言推断", text)
            for classification in CLASSIFICATIONS:
                self.assertIn(classification, text)

        for section in ENGLISH_CORE_SECTIONS:
            self.assertIn(section, SKILL_FILES[0].read_text(encoding="utf-8"))
        for section in CHINESE_CORE_SECTIONS:
            self.assertIn(section, SKILL_FILES[1].read_text(encoding="utf-8"))

        self.assertTrue((MANAGE_SPECS_DIR / "assets" / "spec-template.md").is_file())
        self.assertTrue((MANAGE_SPECS_DIR / "assets" / "spec-template.zh_CN.md").is_file())
        for obsolete_path in (
            "spec-document-reviewer-prompt.md",
            "assets/spec-template.md",
            "assets/spec-template.zh_CN.md",
        ):
            self.assertFalse((BRAINSTORMING_DIR / obsolete_path).exists())

    def test_review_gate_and_three_terminal_routes_are_explicit(self) -> None:
        """Purpose: keep design approval separate from identity confirmation and later work; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies premature implementation or a missing terminal route."""

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        for text in (english, chinese):
            self.assertIn("status: draft", text)
            self.assertIn("status: accepted", text)
            self.assertIn("record-experiment", text)
            self.assertIn("writing-plans", text)
            self.assertIn("design-only", text)
            self.assertIn("Plan", text)
            self.assertIn("Tasks", text)

        self.assertIn("whole-file", english)
        self.assertIn("整份文件", chinese)
        self.assertIn("source code", english)
        self.assertIn("源码", chinese)
        self.assertIn("do not implement", english)
        self.assertIn("不实施", chinese)
        self.assertIn("Only after the Spec is accepted", english)
        self.assertIn("只有在 Spec accepted 后", chinese)


if __name__ == "__main__":
    unittest.main()
