#!/usr/bin/env python3
"""Static contract checks for the converge-to-spec production Skill."""

from __future__ import annotations

import json
from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "converge-to-spec"
SCENARIO_ROOT = REPO_ROOT / "test" / "skill-evals"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
DEVIATIONS = ("Missing", "Partial", "Contradictory", "Unrequested")
TASK_FIELDS = (
    "Spec Coverage",
    "Depends On",
    "Parallel",
    "Files",
    "Work",
    "Validation",
    "Completion",
)


def frontmatter(text: str) -> dict[str, str]:
    """Purpose: parse a simple Skill header; Input: Skill text; Output: metadata map; Errors: ValueError for malformed headers."""

    match = re.match(r"\A---\n(?P<header>.*?)\n---\n", text, re.DOTALL)
    if match is None:
        raise ValueError("expected YAML Front Matter")
    attributes: dict[str, str] = {}
    for line in match.group("header").splitlines():
        key, separator, value = line.partition(":")
        if not key or not separator or key in attributes:
            raise ValueError(f"invalid Front Matter line {line!r}")
        attributes[key] = value.strip()
    return attributes


class ConvergeToSpecSkillTests(unittest.TestCase):
    def test_model_invoked_bilingual_skill_has_convergence_boundaries(self) -> None:
        """Purpose: require concise model-invoked bilingual Skills with a read-only audit default; Input: production Skill texts; Output: none; Errors: assertion failure for missing or overbroad contract."""

        texts: list[str] = []
        for path in SKILL_FILES:
            self.assertTrue(path.exists(), f"Missing converge-to-spec Skill: {path}")
            text = path.read_text(encoding="utf-8")
            metadata = frontmatter(text)
            self.assertEqual("converge-to-spec", metadata.get("name"))
            self.assertNotIn("disable-model-invocation", metadata)
            self.assertTrue(metadata.get("description"), f"Missing description: {path}")
            self.assertNotIn("execute", metadata["description"].lower())
            self.assertNotIn("fix", metadata["description"].lower())
            self.assertNotIn("TODO", text)
            self.assertNotIn("verification-before-completion", text)
            self.assertNotIn("writing-skills", text)
            texts.append(text)

        english, chinese = texts
        self.assertIn("Traceability", frontmatter(english)["description"])
        self.assertIn("收敛", frontmatter(chinese)["description"])
        self.assertIn("user asks", english)
        self.assertIn("用户明确要求", chinese)
        self.assertIn("Default to an empty write set", english)
        self.assertIn("默认允许写入集合为空", chinese)
        self.assertIn("Ordinary local work", english)
        self.assertIn("普通局部工作", chinese)

    def test_transaction_delta_excludes_preexisting_worktree_changes(self) -> None:
        """Purpose: require convergence writes to compare against a recorded baseline; Input: bilingual Skill texts; Output: none; Errors: assertion failure for a whole-worktree-only write check."""

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("Git diff baseline", english)
        self.assertIn("Git diff 基线", chinese)
        self.assertIn("transaction delta", english)
        self.assertIn("本次事务增量", chinese)
        self.assertIn("pre-existing changes remain out of scope", english)
        self.assertIn("既有变更不在范围内", chinese)
        self.assertIn("Against the recorded baseline", english)
        self.assertIn("相对已记录基线", chinese)

    def test_read_order_stale_stop_and_deviation_audit_are_explicit(self) -> None:
        """Purpose: bind both languages to Bundle evidence order, stale stop, four deviations, and cleanup audit; Input: production Skill texts; Output: none; Errors: assertion failure for omitted convergence evidence."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "Architecture",
                "spec.md",
                "plan.md",
                "tasks.md",
                "Git diff/status",
                "runs/<run-id>/record.md",
                "hello-scholar docs check",
                "accepted",
                "approved",
                "Missing",
                "Stale",
                "Spec AC",
                "file:line",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")
            for deviation in DEVIATIONS:
                self.assertIn(deviation, text, f"{path} omits {deviation}")

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        read_order_english = next(
            line
            for line in english.splitlines()
            if line.startswith("2. Read only target-Bundle facts")
        )
        read_order_chinese = next(
            line
            for line in chinese.splitlines()
            if line.startswith("2. 只按以下顺序读取目标 Bundle")
        )
        self.assertLess(read_order_english.index("Architecture"), read_order_english.index("spec.md"))
        self.assertLess(read_order_english.index("spec.md"), read_order_english.index("plan.md"))
        self.assertLess(read_order_english.index("plan.md"), read_order_english.index("tasks.md"))
        self.assertLess(read_order_chinese.index("Architecture"), read_order_chinese.index("spec.md"))
        self.assertLess(read_order_chinese.index("spec.md"), read_order_chinese.index("plan.md"))
        self.assertLess(read_order_chinese.index("plan.md"), read_order_chinese.index("tasks.md"))
        self.assertIn("stop a Ready conclusion", english)
        self.assertIn("不得给出 Ready 结论", chinese)
        self.assertIn("severity", english)
        self.assertIn("严重程度", chinese)
        self.assertIn("repair direction", english)
        self.assertIn("修复方向", chinese)
        self.assertIn("green tests", english)
        self.assertIn("测试全绿", chinese)
        for cleanup_surface in (
            "obsolete implementations",
            "callers",
            "configuration",
            "tests",
            "feature flags",
            "compatibility layers",
            "unused dependencies/files",
            "unselected candidate implementations",
        ):
            self.assertIn(cleanup_surface, english)
        for cleanup_surface in (
            "旧实现",
            "调用方",
            "配置",
            "测试",
            "Feature Flag",
            "临时兼容层",
            "未使用依赖/文件",
            "未选候选实现",
        ):
            self.assertIn(cleanup_surface, chinese)

    def test_ready_gate_preserves_fresh_evidence_and_conditional_architecture(self) -> None:
        """Purpose: require five Bundle completion conditions without duplicating AGENTS fresh-evidence ownership; Input: production Skill texts; Output: none; Errors: assertion failure for an unsafe Ready claim."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "Ready for completion evidence",
                "Not Ready",
                "Validation",
                "Completion",
                "Benchmark",
                "Eval",
                "runs/<run-id>/record.md",
                "docs-maintenance architecture",
                "PYTHONDONTWRITEBYTECODE=1 python3 -B",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("training", english)
        self.assertIn("训练", chinese)
        self.assertIn("terminal status", english)
        self.assertIn("终态", chinese)
        self.assertIn("migration", english)
        self.assertIn("迁移", chinese)
        self.assertIn("cleanup", english)
        self.assertIn("清理", chinese)
        self.assertIn("Do not require a Record for ordinary unit tests", english)
        self.assertIn("普通单元测试不强制 Record", chinese)
        self.assertIn("historical summaries", english)
        self.assertIn("历史摘要", chinese)
        self.assertIn("must actually run and read", english)
        self.assertIn("必须实际运行并读完", chinese)
        self.assertIn("Wait for user confirmation", english)
        self.assertIn("等待用户确认", chinese)
        self.assertIn("not a readiness prerequisite", english)
        self.assertIn("不是就绪前置门", chinese)

    def test_authorized_branch_only_appends_reviewable_tasks(self) -> None:
        """Purpose: constrain the sole write branch to a reviewed Tasks amendment; Input: production Skill texts; Output: none; Errors: assertion failure for unauthorized repair scope."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "Convergence",
                "TNNN",
                "revision",
                "approval: pending-review",
                "approved_revision: null",
                "status: pending",
                "docs sync",
                "docs check",
                "Red-Green-Refactor",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")
            for field in TASK_FIELDS:
                self.assertIn(field, text, f"{path} must require {field!r}")

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("user explicitly asks", english)
        self.assertIn("用户明确要求", chinese)
        self.assertIn("directly implementable", english)
        self.assertIn("可直接实施", chinese)
        self.assertIn("only `tasks.md` and CLI-generated Indexes", english)
        self.assertIn("只包含 `tasks.md` 和 CLI 生成的 Index", chinese)
        self.assertIn("all appended Tasks are reviewable and unchecked", english)
        self.assertIn("所有追加 Task 都可审核且未勾选", chinese)
        self.assertIn("Do not modify code, tests, Spec, Plan, Record, Architecture", english)
        self.assertIn("不修改代码、测试、Spec、Plan、Record、Architecture", chinese)
        self.assertIn("rather than creating an audit artifact", english)
        self.assertIn("不创建审计产物", chinese)

    def test_t021_scenarios_exercise_both_convergence_branches(self) -> None:
        """Purpose: bind the Skill's static contract to both approved T021 scenarios; Input: T021 Scenario and Protocol assets; Output: none; Errors: assertion failure for a missing branch or incorrect target Skill."""

        cases = {
            "converge-to-spec": "node-access-policy-service",
            "converge-completion-gate": "py-batch-reporting-pipeline",
        }
        for case_id, project_id in cases.items():
            case_dir = SCENARIO_ROOT / case_id
            scenario = (case_dir / "scenario.md").read_text(encoding="utf-8")
            protocol = json.loads((case_dir / "protocol.json").read_text(encoding="utf-8"))
            self.assertEqual(project_id, protocol["projectId"])
            self.assertEqual(["converge-to-spec"], protocol["targetSkills"])
            self.assertEqual(
                "skills/hello-scholar/converge-to-spec",
                protocol["skillSources"]["converge-to-spec"],
            )
            self.assertEqual("enter", protocol["skillExpectations"]["converge-to-spec"]["branch"])
            self.assertIn("read-only", scenario)

        semantic_scenario = (SCENARIO_ROOT / "converge-to-spec" / "scenario.md").read_text(
            encoding="utf-8"
        )
        completion_scenario = (
            SCENARIO_ROOT / "converge-completion-gate" / "scenario.md"
        ).read_text(encoding="utf-8")
        for deviation in DEVIATIONS:
            self.assertIn(deviation, semantic_scenario)
        for required in (
            "cleanup debt",
            "appends complete Convergence Tasks",
            "revision: 5",
            "approval: pending-review",
            "approved_revision: null",
            "status: pending",
        ):
            self.assertIn(required, semantic_scenario)
        for required in (
            "Ready",
            "Not Ready",
            "revision 3",
            "past implementation summary",
            "formal Benchmark/Eval",
            "migration cleanup",
            "fresh verification",
            "byte-identical",
        ):
            self.assertIn(required, completion_scenario)


if __name__ == "__main__":
    unittest.main()
