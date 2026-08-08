#!/usr/bin/env python3
"""Static checks for the hello-scholar skill router."""

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "using-helloscholar"

ROUTER_FORWARD_TEST_PROMPT = f"""Use the skill router at {SKILL_DIR}.

Read its `SKILL.md` first. Then answer this task without editing files:

A user asks: "I am about to run `python eval.py --config configs/baseline.yaml --seed 0`; what hello-scholar skill should I check before launching?"

Return a concise answer that names the applicable skill and explains whether the router applies only to superpowers skills or all hello-scholar skill groups.
"""


def validate_router_forward_test_response(testcase: unittest.TestCase, response_text: str) -> None:
    testcase.assertIn("record-experiment", response_text)
    testcase.assertRegex(response_text, r"(?i)all hello-scholar skill groups|所有.*技能组|whole|entire")
    testcase.assertRegex(response_text, r"(?i)not only|not just|not limited to|不只|不是只|不限于")


class UsingHelloScholarSkillTests(unittest.TestCase):
    def test_skill_metadata_uses_helloscholar_name(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("name: using-helloscholar", english)
        self.assertIn("name: using-helloscholar", chinese)
        self.assertNotIn("name: using-superpowers", english)
        self.assertNotIn("name: using-superpowers", chinese)

    def test_skill_description_mentions_all_skill_groups(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("all skill groups", english)
        self.assertIn("所有技能组", chinese)
        self.assertIn("hello-scholar", english)
        self.assertIn("hello-scholar", chinese)

    def test_platform_adaptation_links_tool_mapping_references(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        for text in (english, chinese):
            self.assertIn("references/copilot-tools.md", text)
            self.assertIn("references/codex-tools.md", text)
            self.assertIn("GEMINI.md", text)

    def test_router_forward_test_prompt_checks_non_superpowers_skill(self) -> None:
        self.assertIn(str(SKILL_DIR), ROUTER_FORWARD_TEST_PROMPT)
        self.assertIn("python eval.py", ROUTER_FORWARD_TEST_PROMPT)
        self.assertIn("what hello-scholar skill should I check", ROUTER_FORWARD_TEST_PROMPT)
        self.assertIn("all hello-scholar skill groups", ROUTER_FORWARD_TEST_PROMPT)

    def test_router_forward_test_response_validator_accepts_pass(self) -> None:
        validate_router_forward_test_response(
            self,
            """
            The applicable skill is record-experiment. The router scans the whole
            hello-scholar skill library, not only superpowers skills.
            """,
        )

    def test_task_progress_resumes_execution_instead_of_convergence(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("progress, completion status, remaining work, or continuation", english)
        self.assertIn("进度、完成情况、剩余工作或继续实施", chinese)
        for text in (english, chinese):
            self.assertIn("tasks.md", text)
            self.assertIn("TodoWrite", text)
            self.assertIn("converge-to-spec", text)
            self.assertIn("Depends On", text)
        self.assertIn("first unblocked unchecked Task", english)
        self.assertIn("第一个未阻塞且未勾选的 Task", chinese)
        self.assertIn("After context compaction", english)
        self.assertIn("上下文压缩后", chinese)
        self.assertIn("`approved_revision` equal to `revision`", english)
        self.assertIn("approved_revision` 等于 `revision", chinese)
        self.assertIn("current request explicitly authorizes implementation", english)
        self.assertIn("当前请求明确授权实施", chinese)
        self.assertIn("update `tasks.md` once", english)
        self.assertIn("一次性更新 `tasks.md`", chinese)
        self.assertIn("run `hello-scholar docs sync` once", english)
        self.assertIn("运行一次 `hello-scholar docs sync`", chinese)
        self.assertNotIn("hello-scholar docs check", english)
        self.assertNotIn("hello-scholar docs check", chinese)

    def test_skill_priority_lists_takeoff_and_landing_as_process_skills(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("brainstorming, debugging, takeoff, landing", english)
        self.assertIn("brainstorming、debugging、takeoff、landing", chinese)


if __name__ == "__main__":
    unittest.main()
