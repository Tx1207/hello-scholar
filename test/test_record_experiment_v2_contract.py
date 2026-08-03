#!/usr/bin/env python3
"""Static contract checks for record-experiment's root Run migration."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "hello-scholar" / "record-experiment"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
FIELD_GUIDE = SKILL_DIR / "references" / "status-and-fields.md"
EXAMPLES = SKILL_DIR / "references" / "examples.md"
TEMPLATES = (
    SKILL_DIR / "assets" / "run-record-template.md",
    SKILL_DIR / "assets" / "run-record-template.zh_CN.md",
)
INDEX_TEMPLATES = (
    SKILL_DIR / "assets" / "index-template.md",
    SKILL_DIR / "assets" / "index-template.zh_CN.md",
)

REQUIRED_FRONT_MATTER = (
    "schema",
    "kind",
    "run_id",
    "title",
    "status",
    "spec",
    "spec_revision",
    "plan_revision",
    "started",
    "completed",
    "decision",
    "summary",
)
REQUIRED_STATUSES = (
    "planned",
    "running",
    "completed",
    "failed",
    "interrupted",
    "cancelled",
)
ENGLISH_SECTIONS = (
    "## 1. Purpose",
    "## 2. Hypothesis",
    "## 3. Experimental Variables",
    "## 4. Controls",
    "## 5. Execution Information",
    "## 6. Artifact Locations",
    "## 7. Execution Events",
    "## 8. Key Results",
    "## 9. Observations",
    "## 10. Conclusion",
    "## 11. Decision",
    "## 12. Next Actions",
)
CHINESE_SECTIONS = (
    "## 1. 目的",
    "## 2. 假设",
    "## 3. 实验变量",
    "## 4. 控制条件",
    "## 5. 执行信息",
    "## 6. 产物位置",
    "## 7. 执行事件",
    "## 8. 关键结果",
    "## 9. 观察",
    "## 10. 结论",
    "## 11. 决定",
    "## 12. 后续行动",
)


class RecordExperimentV2ContractTests(unittest.TestCase):
    def test_new_writes_use_one_root_record_and_generated_index(self) -> None:
        """Purpose: require one canonical persistent Run document; Input: bilingual Skill texts and Index assets; Output: none; Errors: assertion failure identifies a legacy or manually owned Index path."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            self.assertIn("runs/<run-id>/record.md", text)
            self.assertIn("runs/INDEX.md", text)
            self.assertNotIn("hello-scholar/memory/experiment-records", text)
            self.assertNotIn("hello-scholar/runs/", text)
            self.assertNotIn("runs/<run_id>.md", text)
            for forbidden_name in ("run.json", "README.md", "report.md", "summary.md", "final-report.md"):
                self.assertIn(forbidden_name, text)
            for artifact_directory in ("outputs/", "results/", "logs/", "checkpoints/"):
                self.assertIn(artifact_directory, text)

        english = SKILL_FILES[0].read_text(encoding="utf-8")
        chinese = SKILL_FILES[1].read_text(encoding="utf-8")
        self.assertIn("do not directly edit `runs/index.md`", english.lower())
        self.assertIn("不直接编辑 `runs/INDEX.md`", chinese)
        self.assertIn("docs check", english)
        self.assertIn("docs sync", english)
        self.assertLess(english.index("docs check"), english.index("docs sync"))
        self.assertIn("docs check", chinese)
        self.assertIn("docs sync", chinese)
        self.assertLess(chinese.index("docs check"), chinese.index("docs sync"))
        for path in INDEX_TEMPLATES:
            self.assertFalse(path.exists(), f"obsolete manual Index template remains: {path}")

    def test_templates_match_canonical_record_schema(self) -> None:
        """Purpose: bind templates to the validated Record schema; Input: bilingual templates; Output: none; Errors: assertion failure identifies a missing Front Matter field or body section."""

        for path, sections in zip(TEMPLATES, (ENGLISH_SECTIONS, CHINESE_SECTIONS)):
            text = path.read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---\n"), f"missing Front Matter: {path}")
            front_matter = text.split("---\n", 2)[1]
            for field in REQUIRED_FRONT_MATTER:
                self.assertRegex(front_matter, rf"(?m)^{re.escape(field)}:")
            self.assertIn("schema: 1", front_matter)
            self.assertIn("kind: record", front_matter)
            self.assertIn("status: planned", front_matter)
            self.assertIn("spec: null", front_matter)
            self.assertIn("spec_revision: null", front_matter)
            self.assertIn("plan_revision: null", front_matter)
            self.assertIn("started: null", front_matter)
            self.assertIn("completed: null", front_matter)
            self.assertIn("decision: pending", front_matter)
            self.assertEqual(sections, tuple(re.findall(r"(?m)^## \d+\. .+$", text)))

    def test_lifecycle_and_evidence_rules_are_current(self) -> None:
        """Purpose: preserve reproducible evidence while replacing retired lifecycle values; Input: Skill and field-guide text; Output: none; Errors: assertion failure identifies a missing lifecycle or terminal-evidence rule."""

        material = "\n".join(
            [path.read_text(encoding="utf-8") for path in SKILL_FILES]
            + [FIELD_GUIDE.read_text(encoding="utf-8")]
        )
        for status in REQUIRED_STATUSES:
            self.assertIn(status, material)
        self.assertIn("started: null", material)
        self.assertIn("completed: null", material)
        self.assertIn("all be set or all be null", material)
        self.assertIn("exact command", material.lower())
        self.assertIn("CWD", material)
        self.assertIn("Unknown", material)
        self.assertIn("negative result", material.lower())
        self.assertIn("completed", material)
        self.assertIn("failed", material)

    def test_formal_and_exploration_timing_are_co_located(self) -> None:
        """Purpose: protect formal prelaunch evidence while permitting bounded isolated exploration; Input: bilingual Skill texts; Output: none; Errors: assertion failure identifies an unconditional gate or unsafe exploration bypass."""

        english = SKILL_FILES[0].read_text(encoding="utf-8")
        chinese = SKILL_FILES[1].read_text(encoding="utf-8")
        for term in (
            "Formal prelaunch record",
            "Qualified exploration backfill",
            "Full record",
            "Append event",
            "No record",
            "production-data",
            "irreversible",
            "public API",
            "persistent format",
            "time and cost cap",
            "session close",
            "dependent Spec",
            "dependent experiment",
            "external sharing",
        ):
            self.assertIn(term, english)
        for term in (
            "正式事前记录",
            "探索限时补录",
            "完整记录",
            "追加事件",
            "不记录",
            "生产数据",
            "不可逆",
            "公共 API",
            "持久格式",
            "时间和成本上限",
            "关闭会话",
            "依赖结果的 Spec",
            "依赖实验",
            "对外分享",
        ):
            self.assertIn(term, chinese)
        self.assertIn("does not create a Worktree automatically", english)
        self.assertIn("不因进入探索路径自动创建 Worktree", chinese)

    def test_identity_collisions_and_sparse_updates_preserve_evidence(self) -> None:
        """Purpose: prevent Run overwrite and monitoring churn; Input: Skill and example text; Output: none; Errors: assertion failure identifies unsafe identity reuse or lost terminal evidence."""

        material = "\n".join(
            [path.read_text(encoding="utf-8") for path in SKILL_FILES]
            + [EXAMPLES.read_text(encoding="utf-8")]
        )
        for term in ("same identity", "-2", "-3", "first unused", "do not overwrite", "Append event"):
            self.assertIn(term, material)
        self.assertIn("same identity", SKILL_FILES[0].read_text(encoding="utf-8"))
        self.assertIn("同一身份", SKILL_FILES[1].read_text(encoding="utf-8"))
        self.assertIn("Repeated loss", SKILL_FILES[0].read_text(encoding="utf-8"))
        self.assertIn("反复查 loss", SKILL_FILES[1].read_text(encoding="utf-8"))
        self.assertIn("CUDA OOM", EXAMPLES.read_text(encoding="utf-8"))
        self.assertIn("valid negative result", EXAMPLES.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
