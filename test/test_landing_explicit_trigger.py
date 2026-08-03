#!/usr/bin/env python3
"""Static contract checks for Landing's narrow explicit entry gate."""

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
ENGLISH = REPO_ROOT / "skills" / "hai-skills" / "landing" / "SKILL.md"
CHINESE = REPO_ROOT / "skills" / "hai-skills" / "landing" / "SKILL.zh_CN.md"


def description(text: str) -> str:
    match = re.search(r"(?ms)^---\s*\n.*?^description:\s*\|\n(.*?)^---", text)
    if not match:
        raise AssertionError("missing block-style frontmatter description")
    return "\n".join(line.strip() for line in match.group(1).splitlines())


class LandingExplicitTriggerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.english = ENGLISH.read_text(encoding="utf-8")
        self.chinese = CHINESE.read_text(encoding="utf-8")
        self.english_description = description(self.english)
        self.chinese_description = description(self.chinese)

    def test_descriptions_have_only_explicit_landing_intents(self) -> None:
        for text in (self.english_description, self.chinese_description):
            self.assertNotIn("Automatically use", text)
            self.assertNotIn("自动触发", text)
            self.assertNotIn("Post-takeoff triggers", text)
            self.assertNotIn("takeoff/geju 后触发词", text)

        self.assertIn("landing", self.english_description.lower())
        self.assertIn("落地", self.chinese_description)
        for text in (self.english_description.lower(), self.chinese_description):
            self.assertNotIn("mvp", text)
            self.assertNotIn("risk", text)
            self.assertNotIn("风险", text)
            self.assertNotIn("next step", text)
            self.assertNotIn("下一步", text)

    def test_entry_requires_this_turn_authorization(self) -> None:
        self.assertIn("only when the user explicitly expresses Landing intent in this turn", self.english)
        self.assertIn("本轮用户明确提出 Landing 意图时才进入", self.chinese)
        self.assertIn("Existing `takeoff` context is input, not authorization", self.english)
        self.assertIn("已有 `takeoff` 上下文只是输入，不是授权", self.chinese)
        self.assertIn("quote the user's triggering words from this turn", self.english)
        self.assertIn("引用本轮用户授权进入的原话", self.chinese)
        self.assertIn("do not read the workflow below", self.english)
        self.assertIn("不要读取后续工作流", self.chinese)

    def test_explicit_intent_still_requires_recoverable_direction(self) -> None:
        self.assertIn("explicit intent does not permit guessing the thesis", self.english)
        self.assertIn("明确请求不允许猜测 thesis", self.chinese)
        self.assertIn("bold thesis / old model / main reality question", self.english)
        self.assertIn("bold thesis / 旧模型 / 主要现实疑问", self.chinese)

    def test_value_and_exit_contracts_remain_intact(self) -> None:
        for text in (self.english, self.chinese):
            for required in (
                "Must Keep",
                "Rewrite and Keep",
                "Defer",
                "Delete",
                "Cost",
                "Risk",
                "Stage Boundary",
                "Verification",
                "Stop Rule",
                "references/anti-patterns.md",
                "Target Shape Statement",
            ):
                self.assertIn(required, text)

        for label in (
            "Landing Judgment",
            "Value Ranking",
            "Ambition Kept",
            "Must Rewrite",
            "User Decision Points",
            "Reality Check",
            "Feasible Plan",
            "Stage Boundary",
            "Verification",
            "Stop Rule",
            "Next Move",
        ):
            self.assertIn(label, self.english)
        for label in (
            "落地审判",
            "价值排序",
            "保留的野心",
            "必须改写的部分",
            "用户裁决点",
            "现实检查",
            "落地版方案",
            "阶段边界",
            "验证",
            "止损规则",
            "下一步",
        ):
            self.assertIn(label, self.chinese)


if __name__ == "__main__":
    unittest.main()
