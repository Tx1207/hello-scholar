#!/usr/bin/env python3
"""Static contract checks for semantic revisions across Bundle document owners."""

from __future__ import annotations

from pathlib import Path
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = REPO_ROOT / "skills"
SKILL_PATHS = {
    name: (
        SKILL_ROOT / name / "SKILL.md",
        SKILL_ROOT / name / "SKILL.zh_CN.md",
    )
    for name in (
        "manage-specs",
        "brainstorming",
        "writing-plans",
        "generating-tasks",
    )
}
DISPOSITIONS = ("Keep", "Modify", "Remove", "Add", "Move")


def read_variants(name: str) -> tuple[str, str]:
    """Return the English and Chinese production text for one document owner."""

    return tuple(
        path.read_text(encoding="utf-8") for path in SKILL_PATHS[name]
    )


class DocumentRevisionContractTests(unittest.TestCase):
    def test_every_owner_treats_the_current_document_as_revision_baseline(self) -> None:
        """Require revisions to start from the complete current document, not a prompt or template."""

        for name in SKILL_PATHS:
            english, chinese = read_variants(name)
            with self.subTest(skill=name, language="English"):
                self.assertIn("Baseline", english)
                self.assertIn("Delta", english)
                self.assertIn("current", english.lower())
                self.assertIn("in full", english.lower())
            with self.subTest(skill=name, language="Chinese"):
                self.assertIn("Baseline", chinese)
                self.assertIn("Delta", chinese)
                self.assertIn("当前", chinese)
                self.assertIn("完整", chinese)

    def test_revision_delta_cannot_silently_delete_omitted_content(self) -> None:
        """Keep unaffected content by default and require authority for every removal."""

        for name in SKILL_PATHS:
            english, chinese = read_variants(name)
            with self.subTest(skill=name, language="English"):
                self.assertIn("Authority", english)
                self.assertIn("not mentioned", english.lower())
                self.assertIn("remov", english.lower())
            with self.subTest(skill=name, language="Chinese"):
                self.assertIn("Authority", chinese)
                self.assertIn("未提及", chinese)
                self.assertIn("删除", chinese)

    def test_spec_owners_reconcile_existing_specs(self) -> None:
        """Bind identity maintenance and approved-design reconciliation to their existing owners."""

        manage_english, manage_chinese = read_variants("manage-specs")
        brainstorm_english, brainstorm_chinese = read_variants("brainstorming")

        for disposition in DISPOSITIONS:
            self.assertIn(disposition, manage_english)
            self.assertIn(disposition, manage_chinese)
            self.assertIn(disposition, brainstorm_english)
            self.assertIn(disposition, brainstorm_chinese)

        for text in (manage_english, manage_chinese):
            self.assertIn("Update Existing Spec", text)
            self.assertIn("created", text)
            self.assertIn("Revision History", text)
        self.assertIn("current `spec.md` as the skeleton", brainstorm_english)
        self.assertIn("当前 `spec.md` 作为骨架", brainstorm_chinese)
        self.assertIn("templates are only for new Specs", brainstorm_english)
        self.assertIn("模板只用于新建 Spec", brainstorm_chinese)
        self.assertIn("acceptance", brainstorm_english.lower())
        self.assertIn("验收", brainstorm_chinese)
        self.assertIn("semantic conservation", brainstorm_english.lower())
        self.assertIn("语义守恒", brainstorm_chinese)

    def test_plan_owner_reconciles_existing_plans(self) -> None:
        """Preserve unaffected implementation strategy across all twelve Plan sections."""

        english, chinese = read_variants("writing-plans")
        for disposition in DISPOSITIONS:
            self.assertIn(disposition, english)
            self.assertIn(disposition, chinese)
        self.assertIn("current `plan.md` as the skeleton", english)
        self.assertIn("当前 `plan.md` 作为骨架", chinese)
        self.assertIn("templates are only for new Plans", english)
        self.assertIn("模板只用于新建 Plan", chinese)
        self.assertIn("all 12 sections", english)
        self.assertIn("全部 12 节", chinese)
        self.assertIn("unaffected", english.lower())
        self.assertIn("未受影响", chinese)
        self.assertIn("do not rewrite `tasks.md`", english)
        self.assertIn("不改写 `tasks.md`", chinese)
        self.assertIn("semantic conservation", english.lower())
        self.assertIn("语义守恒", chinese)

    def test_tasks_owner_preserves_task_identity(self) -> None:
        """Keep valid execution facts while replacing invalidated outcomes with fresh Task IDs."""

        english, chinese = read_variants("generating-tasks")
        for text in (english, chinese):
            self.assertIn("Baseline", text)
            self.assertIn("Authority", text)
            self.assertIn("Delta", text)
            self.assertIn("Git", text)
            self.assertIn("approval: pending-review", text)
            self.assertIn("approved_revision: null", text)
            self.assertIn("status: pending", text)
        self.assertIn("checkbox and evidence", english)
        self.assertIn("checkbox 和证据", chinese)
        self.assertIn("do not renumber", english.lower())
        self.assertIn("不重新编号", chinese)
        self.assertIn("do not reuse", english.lower())
        self.assertIn("不复用", chinese)
        self.assertIn("completed but invalidated", english.lower())
        self.assertIn("已完成但被推翻", chinese)
        self.assertIn("compensation", english.lower())
        self.assertIn("补偿", chinese)
        self.assertIn("rebuild the obligation ledger", english.lower())
        self.assertIn("重建义务账本", chinese)
        self.assertIn("DAG", english)
        self.assertIn("DAG", chinese)
        self.assertIn("field-level disposition map", english)
        self.assertIn("title, checkbox, evidence, `Spec Coverage`, `Files`, and phase placement", english)
        self.assertIn("edit only those fields", english)
        self.assertIn("Dependency repair authorizes only", english)
        self.assertIn("phase and section headings and their surrounding structural context", english)
        self.assertIn("an upstream phase sequence constrains the DAG but does not by itself authorize", english)
        self.assertIn("adding a Task does not authorize wrapping existing Tasks", english)
        self.assertIn("字段级处置图", chinese)
        self.assertIn("标题、checkbox、证据、`Spec Coverage`、`Files` 和 phase placement", chinese)
        self.assertIn("只修改这些字段", chinese)
        self.assertIn("依赖修复只授权", chinese)
        self.assertIn("phase heading、section heading 及其周边结构", chinese)
        self.assertIn("上游 phase 顺序只约束 DAG", chinese)
        self.assertIn("新增 Task 也不授权用新结构包裹既有 Task", chinese)

    def test_revision_review_reads_saved_artifact_and_closes_dispositions(self) -> None:
        """Require completion claims to come from the saved artifact, not intended edits."""

        brainstorm_english, brainstorm_chinese = read_variants("brainstorming")
        tasks_english, tasks_chinese = read_variants("generating-tasks")

        self.assertIn("Read back the saved Spec", brainstorm_english)
        self.assertIn("every `Remove`", brainstorm_english)
        self.assertIn("normative current sections", brainstorm_english)
        self.assertIn("values or formulas", brainstorm_english)
        self.assertIn("exact predicate or inequality", brainstorm_english)
        self.assertIn("source inputs, normalization, boundary rules, and scope", brainstorm_english)
        self.assertIn("case handling and token boundaries", brainstorm_english)
        self.assertIn("superseded value", brainstorm_english)
        self.assertIn("except concise `Revision History`", brainstorm_english)
        self.assertIn("normative factual claim", brainstorm_english)
        self.assertIn("restorable revision, build, or state", brainstorm_english)
        self.assertIn("exact revision received explicit whole-file acceptance", brainstorm_english)
        self.assertIn("no current metadata, heading, history entry, or response", brainstorm_english)
        self.assertIn("回读保存后的 Spec", brainstorm_chinese)
        self.assertIn("每项 `Remove`", brainstorm_chinese)
        self.assertIn("规范性当前章节", brainstorm_chinese)
        self.assertIn("数值或公式", brainstorm_chinese)
        self.assertIn("精确谓词或不等式", brainstorm_chinese)
        self.assertIn("来源输入、归一化、边界规则和作用范围", brainstorm_chinese)
        self.assertIn("大小写处理与 token boundary", brainstorm_chinese)
        self.assertIn("被替代值", brainstorm_chinese)
        self.assertIn("简洁 `Revision History` 除外", brainstorm_chinese)
        self.assertIn("规范性事实陈述", brainstorm_chinese)
        self.assertIn("可恢复的 revision、build 或 state", brainstorm_chinese)
        self.assertIn("精确 revision 已获得明确整份接受", brainstorm_chinese)
        self.assertIn("当前 metadata、标题、历史条目和回复", brainstorm_chinese)

        self.assertIn("Read back the saved `tasks.md`", tasks_english)
        self.assertIn("every disposition", tasks_english)
        self.assertIn("artifact and Baseline diff", tasks_english)
        self.assertIn("every authorized field edit", tasks_english)
        self.assertIn("every field, heading, surrounding structure, and phase placement classified `Keep` is unchanged", tasks_english)
        self.assertIn("Response claims", tasks_english)
        self.assertIn("回读保存后的 `tasks.md`", tasks_chinese)
        self.assertIn("每项处置", tasks_chinese)
        self.assertIn("artifact 和 Baseline diff", tasks_chinese)
        self.assertIn("每项获授权字段修改", tasks_chinese)
        self.assertIn("每个归为 `Keep` 的字段、heading、周边结构和 phase placement 均未改变", tasks_chinese)
        self.assertIn("回复中的完成声明", tasks_chinese)

    def test_revision_contract_stays_owner_local(self) -> None:
        """Prevent a second revision owner, schema, or template contract from appearing."""

        self.assertFalse((SKILL_ROOT / "revising-documents").exists())
        for name, paths in SKILL_PATHS.items():
            for path in paths:
                text = path.read_text(encoding="utf-8")
                with self.subTest(skill=name, path=path.name):
                    self.assertNotIn("revision_status:", text)
                    self.assertNotIn("historically-invalidated", text)


if __name__ == "__main__":
    unittest.main()
