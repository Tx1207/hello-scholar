#!/usr/bin/env python3
"""Static contract checks for the docs-maintenance Skill and Architecture templates."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "hello-scholar" / "docs-maintenance"
SKILL_FILES = (SKILL_DIR / "SKILL.md", SKILL_DIR / "SKILL.zh_CN.md")
TEMPLATE_FILES = (
    SKILL_DIR / "assets" / "architecture-template.md",
    SKILL_DIR / "assets" / "architecture-template.zh_CN.md",
)
ALLOWED_INDEX_PATHS = (
    "hello-scholar/specs/INDEX.md",
    "Topic `INDEX.md`",
    "runs/INDEX.md",
)
ARCHITECTURE_FIELDS = ("schema", "kind", "status", "applies_to", "updated")
ENGLISH_SECTIONS = (
    "## 1. System Goal",
    "## 2. Project Structure",
    "## 3. Current Modules",
    "## 4. Current Technical Choices",
    "## 5. Key Runtime Flows",
    "## 6. File and Run Artifact Locations",
    "## 7. Current Constraints",
    "## 8. Technical Debt",
    "## 9. Design Sources",
)
CHINESE_SECTIONS = (
    "## 1. 系统目标",
    "## 2. 项目结构",
    "## 3. 当前模块",
    "## 4. 当前技术选择",
    "## 5. 关键运行流程",
    "## 6. 文件和运行产物位置",
    "## 7. 当前约束",
    "## 8. 技术债",
    "## 9. 设计来源",
)


def front_matter(text: str) -> tuple[dict[str, str], str]:
    """Purpose: parse simple YAML Front Matter; Input: Markdown text; Output: metadata and body; Errors: ValueError for malformed headers."""

    match = re.match(r"\A---\n(?P<header>.*?)\n---\n(?P<body>.*)\Z", text, re.DOTALL)
    if match is None:
        raise ValueError("expected YAML Front Matter")
    fields: dict[str, str] = {}
    for line in match.group("header").splitlines():
        key, separator, value = line.partition(":")
        if not key or not separator or key in fields:
            raise ValueError(f"invalid Front Matter line {line!r}")
        fields[key] = value.strip()
    return fields, match.group("body")


class DocsMaintenanceSkillTests(unittest.TestCase):
    def test_model_invoked_bilingual_skill_has_exactly_four_modes(self) -> None:
        """Purpose: bind the production Skill to four explicit maintenance branches; Input: bilingual Skill texts; Output: none; Errors: assertion failure for missing modes or unsafe triggers."""

        texts: list[str] = []
        for path in SKILL_FILES:
            self.assertTrue(path.is_file(), f"missing Skill file: {path}")
            text = path.read_text(encoding="utf-8")
            metadata, _ = front_matter(text)
            self.assertEqual("docs-maintenance", metadata.get("name"))
            self.assertNotIn("disable-model-invocation", metadata)
            self.assertTrue(metadata.get("description"), f"missing description: {path}")
            self.assertNotIn("TODO", text)
            self.assertNotIn("writing-skills", text)
            self.assertNotIn("project-structure", text)
            for mode in ("`check`", "`index`", "`architecture`", "`recover`"):
                self.assertIn(mode, text, f"{path} omits {mode}")
            texts.append(text)

        english, chinese = texts
        self.assertIn("check document health", front_matter(english)[0]["description"])
        self.assertIn("检查文档健康状态", front_matter(chinese)[0]["description"])
        self.assertIn("Choose exactly one mode", english)
        self.assertIn("只能选择", chinese)
        self.assertIn("Do not combine modes", english)
        self.assertIn("不得组合", chinese)

    def test_transaction_delta_excludes_preexisting_worktree_changes(self) -> None:
        """Purpose: require each maintenance mode to validate only its own transaction; Input: bilingual Skill texts; Output: none; Errors: assertion failure for whole-worktree diff checks."""

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("Git diff baseline", english)
        self.assertIn("Git diff 基线", chinese)
        self.assertIn("transaction delta", english)
        self.assertIn("本次事务增量", chinese)
        self.assertIn("newly changed path", english)
        self.assertIn("新变更位于范围外路径", chinese)
        self.assertIn("pre-existing changes remain out of scope", english)
        self.assertIn("既有变更不在范围内", chinese)

    def test_check_and_index_modes_bind_cli_and_write_boundaries(self) -> None:
        """Purpose: require separate read-only checking and CLI-owned Index synchronization; Input: bilingual Skill texts; Output: none; Errors: assertion failure for mixed modes or unsupported writes."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "hello-scholar docs check",
                "hello-scholar docs sync",
                "Git diff",
                "mtime",
                "INDEX.md",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")
            self.assertIn("docs check` only", text) if path.name == "SKILL.md" else self.assertIn("只运行 `hello-scholar docs check`", text)
            self.assertIn("docs sync` only", text) if path.name == "SKILL.md" else self.assertIn("只运行 `hello-scholar docs sync`", text)
            self.assertIn("hand-edit", text) if path.name == "SKILL.md" else self.assertIn("手工编辑", text)
            self.assertIn("Fast Path", text)

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("exit code", english)
        self.assertIn("退出码", chinese)
        self.assertIn("relative paths", english)
        self.assertIn("相对路径", chinese)
        for index_path in ALLOWED_INDEX_PATHS:
            self.assertIn(index_path, english)
        self.assertIn("仅 CLI 生成的", chinese)
        self.assertIn("不得运行 sync", chinese)
        self.assertIn("Do not run sync", english)
        self.assertIn("preserve the old Indexes", english)
        self.assertIn("保留旧 Index", chinese)

    def test_architecture_requires_hash_bound_proposal_and_one_file_write(self) -> None:
        """Purpose: preserve the Architecture approval transaction and current-facts boundary; Input: bilingual Skill texts and templates; Output: none; Errors: assertion failure for premature or unsupported Architecture writes."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "SHA-256",
                "Proposal",
                "hello-scholar/architecture.md",
                "Draft",
                "Rejected",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")
            self.assertIn("assets/architecture-template", text)
            self.assertIn("all nine sections", text) if path.name == "SKILL.md" else self.assertIn("全部九节", text)
            self.assertIn("only after approval", text) if path.name == "SKILL.md" else self.assertIn("只有批准当前 Hash 后才写入", text)

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        for required in ("Completed Spec/Plan/Tasks", "valid Records", "unmerged", "current date"):
            self.assertIn(required, english)
        for required in ("Completed Spec/Plan/Tasks", "有效 Record", "未合并", "当前日期"):
            self.assertIn(required, chinese)
        self.assertIn("Keep the transaction delta at zero", english)
        self.assertIn("本次事务增量必须为零", chinese)
        self.assertIn('"continue" without approval', english)
        self.assertIn("没有批准的“继续”", chinese)
        self.assertIn("important technical choice", english)
        self.assertIn("重要技术选择", chinese)
        self.assertIn("material change", english)
        self.assertIn("材料性变化", chinese)

    def test_recover_rebuilds_only_indexes_and_returns_human_review_draft(self) -> None:
        """Purpose: require recover to distinguish diagnostics from the chat-only Architecture draft; Input: bilingual Skill texts; Output: none; Errors: assertion failure for an unsafe recovery write."""

        for path in SKILL_FILES:
            text = path.read_text(encoding="utf-8")
            for required in (
                "Stale",
                "legacy-path",
                "Needs Human Review",
                "hello-scholar docs check",
                "hello-scholar docs sync",
            ):
                self.assertIn(required, text, f"{path} must include {required!r}")

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        for required in ("orphan", "unassociated", "Architecture draft"):
            self.assertIn(required, english)
        for required in ("孤立", "无关联", "Architecture 草稿"):
            self.assertIn(required, chinese)
        self.assertIn("chat-only review draft", english)
        self.assertIn("草稿只留在回复中", chinese)
        self.assertIn("separate `architecture` transaction", english)
        self.assertIn("独立的 `architecture` 事务", chinese)
        self.assertIn("formal Architecture", english)
        self.assertIn("正式 Architecture", chinese)
        self.assertIn("trustworthy Completed/Record facts", english)
        self.assertIn("可信的 Completed/Record 事实", chinese)
        self.assertIn("never in an `INDEX.md`", english)
        self.assertIn("不能放入 `INDEX.md`", chinese)
        self.assertIn('Do not treat "continue" as approval', english)
        self.assertIn("不得将“继续”视为批准", chinese)

    def test_templates_have_matching_front_matter_and_nine_section_shape(self) -> None:
        """Purpose: require the exact Architecture schema and aligned bilingual nine-section templates; Input: template files; Output: none; Errors: assertion failure for missing metadata or section contracts."""

        section_sets = (ENGLISH_SECTIONS, CHINESE_SECTIONS)
        for path, sections in zip(TEMPLATE_FILES, section_sets):
            self.assertTrue(path.is_file(), f"missing template: {path}")
            text = path.read_text(encoding="utf-8")
            fields, body = front_matter(text)
            self.assertEqual(set(ARCHITECTURE_FIELDS), set(fields), f"{path}: metadata fields")
            self.assertEqual("1", fields["schema"])
            self.assertEqual("architecture", fields["kind"])
            self.assertEqual("current", fields["status"])
            self.assertEqual("main", fields["applies_to"])
            self.assertEqual("YYYY-MM-DD", fields["updated"])
            self.assertIn("# Current Architecture", body)
            self.assertEqual(9, len(re.findall(r"^## [1-9]\. ", body, re.MULTILINE)))
            for section in sections:
                self.assertIn(section, body, f"{path}: missing {section}")
            self.assertNotIn("TODO", text)
            self.assertNotIn("TBD", text)

    def test_skill_uses_existing_docs_core_without_forbidden_entrypoints(self) -> None:
        """Purpose: prevent duplicate docs tooling and extra recovery artifacts; Input: bilingual Skill texts; Output: none; Errors: assertion failure for prohibited implementation guidance."""

        english, chinese = (path.read_text(encoding="utf-8") for path in SKILL_FILES)
        self.assertIn("CLI", english)
        self.assertIn("CLI", chinese)
        self.assertIn("generated Indexes", english)
        self.assertIn("生成的 Index", chinese)
        for phrase in (
            "docs migrate",
            "parser implementation",
            "hand-written Index procedure",
        ):
            self.assertIn(phrase, english, f"English Skill must name its boundary {phrase!r}")
        for phrase in (
            "docs migrate",
            "parser 实现",
            "手写 Index 流程",
        ):
            self.assertIn(phrase, chinese, f"Chinese Skill must name its boundary {phrase!r}")
        for phrase in ("architecture-recovery.md", "recovery-report.md"):
            self.assertIn(phrase, english)
            self.assertIn(phrase, chinese)


if __name__ == "__main__":
    unittest.main()
