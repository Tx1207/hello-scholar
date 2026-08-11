#!/usr/bin/env python3
"""Static checks for the hello-scholar skill router."""

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "using-helloscholar"

ROUTER_FORWARD_TEST_PROMPT = f"""Use the skill router at {SKILL_DIR}.

Read its `SKILL.md` first. Then answer this task without editing files:

A user asks: "I am about to launch the full baseline Eval on a remote GPU and retain predictions for release acceptance: `python eval.py --config configs/baseline.yaml --seed 0`; what hello-scholar skill should I check before launching?"

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

    def test_experiment_routing_records_only_clear_large_runs(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("## Experiment Routing", english)
        self.assertIn("## 实验路由", chinese)
        for term in (
            "Small",
            "local",
            "smoke",
            "no retained evidence",
            "run directly",
            "formal",
            "baseline",
            "release",
            "full training",
            "GPU",
            "remote",
            "retained evidence",
            "record-experiment",
            "do not ask",
        ):
            self.assertIn(term, english)
        for term in (
            "小型",
            "本地",
            "smoke",
            "不保留证据",
            "直接运行",
            "正式",
            "baseline",
            "release",
            "完整训练",
            "GPU",
            "远程",
            "保留证据",
            "record-experiment",
            "不询问",
        ):
            self.assertIn(term, chinese)
        self.assertIn("command name", english)
        self.assertIn("命令名", chinese)
        for text in (english, chinese):
            for name in ("eval", "benchmark", "experiment"):
                self.assertIn(f"`{name}`", text)

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
        self.assertIn("same-session compaction", english)
        self.assertIn("同一会话压缩后", chinese)
        self.assertIn("`approved_revision` must equal `revision`", english)
        self.assertIn("approved_revision` 必须等于 `revision", chinese)
        self.assertIn("current request explicitly authorizes implementation", english)
        self.assertIn("当前请求明确授权实施", chinese)
        self.assertIn("update `tasks.md` once", english)
        self.assertIn("一次性更新 `tasks.md`", chinese)
        self.assertIn("run `hello-scholar docs sync` once", english)
        self.assertIn("运行一次 `hello-scholar docs sync`", chinese)
        english_continuation = english.split("## Task Continuation", 1)[1].split(
            "## Architecture Reminder", 1
        )[0]
        chinese_continuation = chinese.split("## Task 续做", 1)[1].split(
            "## Architecture 提醒", 1
        )[0]
        self.assertNotIn("hello-scholar docs check", english_continuation)
        self.assertNotIn("hello-scholar docs check", chinese_continuation)

    def test_routers_resolve_bundle_from_index_lifecycle(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        for text in (english, chinese):
            for required in (
                "hello-scholar/specs/INDEX.md",
                "accepted / Current / approved / pending|in-progress / incomplete",
                "cancelled",
            ):
                self.assertIn(required, text)

        for required in (
            "named Bundle only selects the target",
            "one candidate resumes",
            "many wait for a choice",
            "none stops",
            "Report and stop",
            "switch changes only the current execution context",
            "Do not guess by time or file order",
        ):
            self.assertIn(required, english)

        for required in (
            "用户点名只确定目标，不绕过生命周期门",
            "唯一候选恢复",
            "多个候选等待选择",
            "没有候选则停止",
            "任一门不满足时报告并停止",
            "切换只改变本轮执行上下文",
            "不按时间或文件顺序猜测",
        ):
            self.assertIn(required, chinese)

    def test_router_reports_missing_architecture_once_without_blocking(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        for text in (english, chinese):
            for required in (
                "architecture-missing",
                "hello-scholar docs check",
                "hello-scholar docs sync",
                "docs-maintenance",
                "architecture",
            ):
                self.assertIn(required, text)

        for required in (
            "first observed",
            "once in the current conversation",
            "does not block the current work",
            "Continue the current flow",
            "Later occurrences need no reminder",
            "Do not run another command or create a file for this reminder",
            "explicitly asks to create it",
        ):
            self.assertIn(required, english)

        for required in (
            "首次从",
            "观察到",
            "本次对话只提醒一次",
            "不阻塞当前工作",
            "继续当前流程",
            "后续同类 notice 无需提醒",
            "不为提醒额外运行命令或创建文件",
            "明确要求创建",
        ):
            self.assertIn(required, chinese)

    def test_skill_priority_lists_takeoff_and_landing_as_process_skills(self) -> None:
        english = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        chinese = (SKILL_DIR / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("brainstorming, debugging, takeoff, landing", english)
        self.assertIn("brainstorming、debugging、takeoff、landing", chinese)


if __name__ == "__main__":
    unittest.main()
