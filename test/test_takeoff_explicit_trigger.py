#!/usr/bin/env python3
"""Static contract checks for Takeoff's explicit-intent entry gate."""

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
ENGLISH_PATH = REPO_ROOT / "skills" / "takeoff" / "SKILL.md"
CHINESE_PATH = REPO_ROOT / "skills" / "takeoff" / "SKILL.zh_CN.md"


def read_description(path: Path) -> str:
    """Purpose: extract a skill description; Input: SKILL.md path; Output: normalized frontmatter description; Errors: malformed frontmatter."""
    text = path.read_text(encoding="utf-8")
    frontmatter, separator, _ = text.partition("\n---\n")
    if not frontmatter.startswith("---\n") or not separator:
        raise AssertionError(f"{path} has no YAML frontmatter")

    lines = frontmatter.splitlines()
    try:
        start = lines.index("description: |") + 1
    except ValueError as error:
        raise AssertionError(f"{path} has no block description") from error

    description_lines = []
    for line in lines[start:]:
        if line and not line.startswith((" ", "\t")):
            break
        description_lines.append(line.strip())
    return " ".join(description_lines)


class TakeoffExplicitTriggerTests(unittest.TestCase):
    def setUp(self) -> None:
        """Purpose: load the bilingual Takeoff sources; Input: repository files; Output: source text and descriptions."""
        self.english = ENGLISH_PATH.read_text(encoding="utf-8")
        self.chinese = CHINESE_PATH.read_text(encoding="utf-8")
        self.english_description = read_description(ENGLISH_PATH)
        self.chinese_description = read_description(CHINESE_PATH)

    def test_english_description_requires_current_turn_explicit_intent(self) -> None:
        """Purpose: keep English invocation narrow; Input: English description; Output: explicit-intent assertions."""
        self.assertIn("current-turn explicit Takeoff request", self.english_description)
        for trigger in (
            "`takeoff`",
            "起飞",
            "geju",
            "打开格局",
            "rejudge the target model",
            "stand one level higher",
            "local compatibility",
        ):
            with self.subTest(trigger=trigger):
                self.assertIn(trigger, self.english_description)

        for broad_trigger in (
            "Use when the user wants",
            "think bigger",
            "open the design space",
            "challenge a conservative",
            "too incremental / too safe",
            "play it bigger",
            "what if there were no legacy",
        ):
            with self.subTest(broad_trigger=broad_trigger):
                self.assertNotIn(broad_trigger, self.english_description)
        self.assertNotIn("disable-model-invocation", self.english)

    def test_chinese_description_requires_current_turn_explicit_intent(self) -> None:
        """Purpose: keep Chinese invocation equally narrow; Input: Chinese description; Output: explicit-intent assertions."""
        self.assertIn("只在用户本轮明确", self.chinese_description)
        for trigger in (
            "Takeoff / 起飞 / geju / 打开格局",
            "重新判断目标模型",
            "站高一层",
            "别被局部兼容绑架",
        ):
            with self.subTest(trigger=trigger):
                self.assertIn(trigger, self.chinese_description)

        self.assertNotIn("当用户想", self.chinese_description)
        self.assertNotIn("即使没点名也要主动触发", self.chinese_description)
        self.assertNotIn("disable-model-invocation", self.chinese)

    def test_entry_check_separates_explicit_requests_from_project_words(self) -> None:
        """Purpose: require an attributable intent gate; Input: bilingual skill bodies; Output: entry and ordinary-analysis assertions."""
        english_requirements = (
            "## Entry Check",
            "quote the user's current-turn language",
            "explicitly asks to expand the target",
            "project material",
            "`conservative`",
            "compatibility",
            "architecture",
            "proposal comparison",
            "refactor cost",
            "continue the user's original analysis and verification",
            "or change phase",
            "Only after this check passes",
        )
        chinese_requirements = (
            "## 入口核对",
            "引用用户本轮",
            "明确要求放大目标",
            "项目材料",
            "`conservative`",
            "兼容",
            "架构",
            "方案比较",
            "重构成本",
            "继续原任务的普通分析和验证",
            "不改变阶段",
            "只有核对通过才读取",
        )
        for requirement in english_requirements:
            with self.subTest(language="English", requirement=requirement):
                self.assertIn(requirement, self.english)
        for requirement in chinese_requirements:
            with self.subTest(language="Chinese", requirement=requirement):
                self.assertIn(requirement, self.chinese)

    def test_valid_takeoff_preserves_direction_value_and_asks_before_landing(self) -> None:
        """Purpose: preserve Takeoff's output and phase boundary; Input: bilingual skill bodies; Output: retained-contract assertions."""
        english_requirements = (
            "大胆假设，小心求证",
            "**Thesis**",
            "**Confidence**",
            "**Frame-Opening Move**",
            "**First Proof Point**",
            "**Falsifier**",
            "**Payoff Ledger",
            "Give tradeoffs, not steps",
            "not a recommended execution slice",
            "ask whether to route to `landing`",
            "does not switch phases automatically",
        )
        chinese_requirements = (
            "大胆假设，小心求证",
            "**Thesis**",
            "**Confidence**",
            "**Frame-Opening Move**",
            "**First Proof Point**",
            "**Falsifier**",
            "**Payoff Ledger",
            "给取舍，不给步骤",
            "不是推荐执行切片",
            "询问是否转给 `landing`",
            "不自动切换阶段",
        )
        for requirement in english_requirements:
            with self.subTest(language="English", requirement=requirement):
                self.assertIn(requirement, self.english)
        for requirement in chinese_requirements:
            with self.subTest(language="Chinese", requirement=requirement):
                self.assertIn(requirement, self.chinese)


if __name__ == "__main__":
    unittest.main()
