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

        self.assertIn("## 9. Code Comments", guidance)
        self.assertIn("Comments are a guide for reviewers who did not implement the code", guidance)
        self.assertIn("business rules, state changes, I/O, or multiple stages", guidance)
        self.assertIn("caller-observable results or side effects", guidance)
        self.assertIn("constraints, design rationale, and failure impact", guidance)
        self.assertIn("Simple code needs no comments.", guidance)
        self.assertIn("Treat disagreement among comments, code, and tests as a defect.", guidance)

    def test_comment_guidance_rejects_mechanical_contract_templates(self) -> None:
        """Prevent the retired mandatory comment template from returning."""
        guidance = AGENTS_MD.read_text(encoding="utf-8")

        self.assertNotIn("Function Contract Comments", guidance)
        self.assertNotIn("Every named function or method", guidance)
        self.assertNotIn("first body comment", guidance)
        self.assertNotIn("first-statement docstring", guidance)

    def test_chinese_guidance_remains_the_matching_source(self) -> None:
        """Keep the English rules equivalent to the approved Chinese source."""
        guidance = AGENTS_ZH.read_text(encoding="utf-8")

        self.assertIn("## 9. 代码注释", guidance)
        self.assertIn("注释是写给未参与实现的审阅者的导读", guidance)
        self.assertIn("业务规则、状态变化、I/O 或多个阶段", guidance)
        self.assertIn("调用方可观察的结果或副作用", guidance)
        self.assertIn("约束、设计原因与失败影响", guidance)
        self.assertIn("简单代码无需注释", guidance)
        self.assertIn("注释、代码和测试不一致视为缺陷", guidance)


if __name__ == "__main__":
    unittest.main()
