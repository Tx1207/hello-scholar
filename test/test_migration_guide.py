"""Static contract checks for the reviewed document-model-v2 migration guide."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
GUIDE = REPO_ROOT / "docs" / "migration" / "document-model-v2.md"
LEGACY_PATHS = (
    "hello-scholar/memory/specs/YYYY-MM-DD-*.md",
    "hello-scholar/memory/plans/*.md",
    "hello-scholar/memory/experiment-records/runs/<run-id>.md",
    "hello-scholar/memory/handoffs/*.md",
    "hello-scholar/memory/brainstorm/visual/",
)
MAPPING_COLUMNS = (
    "Source Path(s)",
    "Kind",
    "Topic/Run",
    "Proposed Target",
    "Operation",
    "Merge/Revision Decision",
    "Evidence",
    "Uncertainty",
    "User Decision",
)
CURRENT_OWNERS = (
    "manage-specs",
    "writing-plans",
    "generating-tasks",
    "record-experiment",
    "handoff",
)


def fenced_code_blocks(text: str) -> tuple[str, ...]:
    """Purpose: extract Markdown fenced code content; Input: guide text; Output: code blocks in source order."""
    return tuple(re.findall(r"```[^\n]*\n(.*?)```", text, re.DOTALL))


class MigrationGuideTests(unittest.TestCase):
    def test_phase_a_is_read_only_and_produces_a_reviewable_mapping(self) -> None:
        """Purpose: require an inventory-only first phase; Input: migration guide; Output: none; Errors: assertion failure identifies an unsafe or incomplete proposal contract."""
        self.assertTrue(GUIDE.is_file(), f"missing migration guide: {GUIDE}")
        text = GUIDE.read_text(encoding="utf-8")

        for phrase in (
            "## 阶段 A：Inventory 与 Mapping Proposal，只读",
            "Proposal ID",
            "源 Git commit/工作树状态",
            "生成时间",
            "只输出映射表，不写文件",
            "User Decision",
            "pending",
            "没有逐项或明确整表批准，不进入阶段 B",
        ):
            self.assertIn(phrase, text)
        for path in LEGACY_PATHS:
            self.assertIn(path, text)
        for column in MAPPING_COLUMNS:
            self.assertIn(column, text)
        for operation in (
            "merge",
            "copy",
            "move",
            "keep",
            "delete-after-approved-copy",
            "delete",
        ):
            self.assertIn(f"`{operation}`", text)

    def test_phase_b_executes_only_currently_approved_rows_through_owners(self) -> None:
        """Purpose: require exact row approval and current owner handoffs; Input: migration guide; Output: none; Errors: assertion failure identifies bypassed approval or stale schema reuse."""
        text = GUIDE.read_text(encoding="utf-8")

        for phrase in (
            "## 阶段 B：Approved Migration，只执行批准映射",
            "完整映射表和本轮允许操作",
            "未批准、被修改或仍 `pending` 的行保持只读",
            "找不到当前 owner/模板、Hash 已变化，或 Proposal 未批准必要的身份、路径或生命周期映射时停止对应行",
            "draft -> accepted",
            "draft -> approved",
            "pending-review -> approved",
            "delete-after-approved-copy",
            "不在新旧路径双写，不创建兼容 alias",
            "docs check",
            "docs sync",
        ):
            self.assertIn(phrase, text)
        for owner in CURRENT_OWNERS:
            self.assertIn(f"`{owner}`", text)
        for phrase in (
            "先 Spec 身份/Bundle，再生成或改写 draft Plan",
            "Plan 经用户按当前内容批准后，才生成 pending-review Tasks",
            "随后处理 Record 和 Handoff，最后生成 Index",
            "Visual Companion 产物",
            "不自动迁移，也不因产品代码已删除而自动删除用户产物",
        ):
            self.assertIn(phrase, text)

    def test_guide_requires_canonical_targets_before_completion(self) -> None:
        """Purpose: require canonical paths and notice verification for completed migrations; Input: migration guide; Output: none; Errors: assertion failure identifies a legacy-path migration gap."""
        text = GUIDE.read_text(encoding="utf-8")

        for phrase in (
            "## v2 Canonical 目录结构与迁移目标",
            "一个项目通常按以下结构组织",
            "Mapping Proposal 的 `Proposed Target` 必须相对于 `<project-root>` 填写",
            "`hello-scholar/memory/...` 只保存 legacy source",
            "`runs/<run-id>/record.md`",
            "### Canonical path 验收",
            "`legacy-path` notice 已消失",
            "`docs check` 没有 errors 不能单独证明迁移完成",
        ):
            self.assertIn(phrase, text)

    def test_guide_requires_evidence_based_legacy_record_status_mapping(self) -> None:
        """Purpose: prevent legacy Record enum names from blocking a reviewed semantic migration; Input: migration guide; Output: none; Errors: assertion failure identifies missing status preservation or mapping approval."""
        text = GUIDE.read_text(encoding="utf-8")

        for phrase in (
            "Lifecycle / Status Mapping",
            "旧状态名不在当前 enum 中自动保留源文件",
            "历史 `abandoned`、`invalid`、`superseded`",
            "它们不能直接成为 v2 `status`",
            "不得以文件创建时间、迁移时间或推测值补造 terminal 时间",
            "只有缺少开始、结束或终止原因等必要证据",
            "旧状态名不在当前 owner enum 中本身不是 owner 冲突",
        ):
            self.assertIn(phrase, text)

    def test_guide_excludes_automatic_migration_entry_points(self) -> None:
        """Purpose: forbid automated migration machinery; Input: guide and repository paths; Output: none; Errors: assertion failure identifies an executable migration surface."""
        text = GUIDE.read_text(encoding="utf-8")
        for phrase in (
            "不存在 `docs migrate`",
            "不新增命令、脚本或自动工作流",
            "不自动移动、合并或删除",
            "回滚",
            "敏感信息脱敏",
        ):
            self.assertIn(phrase, text)
        for block in fenced_code_blocks(text):
            self.assertNotIn("docs migrate", block.lower())
        self.assertEqual([], list((REPO_ROOT / "src").glob("migrate*.js")))
        scripts_dir = REPO_ROOT / "scripts"
        if scripts_dir.exists():
            self.assertEqual([], list(scripts_dir.glob("migrate*")))


if __name__ == "__main__":
    unittest.main()
