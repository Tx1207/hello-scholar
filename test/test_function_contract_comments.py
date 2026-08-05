#!/usr/bin/env python3
"""Static guards for semantic code-comment guidance."""

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
AGENTS_MD = REPO_ROOT / "AGENTS.md"
AGENTS_ZH = REPO_ROOT / "AGENTS-zh.md"


class CodeReviewCommentGuidanceTests(unittest.TestCase):
    def test_english_guidance_requires_semantic_comments(self) -> None:
        """Keep the reviewer-facing English guidance aligned with the agreed semantics."""
        guidance = AGENTS_MD.read_text(encoding="utf-8")

        self.assertIn("## 9. Code Review Comments", guidance)
        self.assertIn("constraints, boundaries, failure conditions, and design rationale", guidance)
        self.assertIn("key invariant", guidance)
        self.assertIn("external side effect", guidance)
        self.assertIn("which constraint it protects", guidance)
        self.assertIn("Treat disagreement among comments, code, and tests as a defect.", guidance)

    def test_comment_guidance_rejects_mechanical_contract_templates(self) -> None:
        """Prevent the retired mandatory comment template from returning."""
        guidance = AGENTS_MD.read_text(encoding="utf-8")

        self.assertNotIn("Function Contract Comments", guidance)
        self.assertNotIn("Every named function or method", guidance)
        self.assertNotIn("first body comment", guidance)
        self.assertNotIn("first-statement docstring", guidance)
        self.assertIn("rather than `Purpose`, `Input`, or `Output` templates", guidance)

    def test_chinese_guidance_remains_the_matching_source(self) -> None:
        """Keep the English rules equivalent to the approved Chinese source."""
        guidance = AGENTS_ZH.read_text(encoding="utf-8")

        self.assertIn("## 9. 代码审阅注释", guidance)
        self.assertIn("约束、边界、失败条件与设计原因", guidance)
        self.assertIn("关键不变量", guidance)
        self.assertIn("外部副作用", guidance)
        self.assertIn("它保护的约束", guidance)
        self.assertIn("注释、代码和测试表达不一致视为缺陷", guidance)
        self.assertIn("不以 `Purpose`、`Input`、`Output` 模板", guidance)


if __name__ == "__main__":
    unittest.main()
