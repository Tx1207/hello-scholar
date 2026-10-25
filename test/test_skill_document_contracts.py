#!/usr/bin/env python3
"""Checks durable data and ownership contracts exposed by current Skills."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SkillDocumentContractTests(unittest.TestCase):
    def test_spec_templates_keep_schema_one_and_acceptance_evidence(self) -> None:
        for name in ("spec-template.md", "spec-template.zh_CN.md"):
            text = (ROOT / "skills/manage-specs/assets" / name).read_text(
                encoding="utf-8"
            )
            self.assertIn("schema: 1", text)
            self.assertIn("kind: spec", text)
            self.assertIn("AC-01", text)
            self.assertIn("|", text)
        skill = (ROOT / "skills/manage-specs/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Create", skill)
        self.assertIn("Revise", skill)
        self.assertIn("Replace", skill)
        self.assertIn("only after the successor is implemented", skill)

    def test_new_record_templates_use_schema_two_without_plan_revision(self) -> None:
        for name in ("run-record-template.md", "run-record-template.zh_CN.md"):
            text = (ROOT / "skills/record-experiment/assets" / name).read_text(
                encoding="utf-8"
            )
            self.assertIn("schema: 2", text)
            self.assertIn("kind: record", text)
            self.assertNotIn("plan_revision:", text)
            self.assertIn("stdout", text)
            self.assertIn("stderr", text)
            exit_label = (
                "Exit code / signal"
                if name == "run-record-template.md"
                else "退出码 / signal"
            )
            self.assertIn(exit_label, text)
        reference = (
            ROOT / "skills/record-experiment/references/status-and-fields.md"
        ).read_text(encoding="utf-8")
        self.assertIn("historical schema 1 Record", reference)
        self.assertIn("terminal historical Records remain unchanged", reference)
        skill = (ROOT / "skills/record-experiment/SKILL.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("captured separately", skill)
        self.assertIn("references/examples.md", skill)
        self.assertIn("derived_from", skill)
        for name in ("run-record-template.md", "run-record-template.zh_CN.md"):
            text = (ROOT / "skills/record-experiment/assets" / name).read_text(
                encoding="utf-8"
            )
            self.assertIn("entry:", text)
            self.assertIn("derived_from:", text)

    def test_spec_audit_is_read_only_but_outer_fix_request_can_continue(self) -> None:
        text = (ROOT / "skills/review/SKILL.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("read-only by default", text)
        self.assertIn("review and repair", text)
        self.assertIn("`AC-NN`", text)
        self.assertIn("references/cross-agent-review.md", text)

    def test_docs_check_is_strictly_read_only_and_modes_can_combine(self) -> None:
        text = (ROOT / "skills/docs-maintenance/SKILL.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("Modes may be combined", text)
        self.assertIn("This operation is strictly read-only", text)
        self.assertIn("CLI alone may update", text)
        self.assertIn("assets/architecture-template.md", text)

    def test_synthesize_output_is_exempt_from_the_response_wrapper(self) -> None:
        skill = (ROOT / "skills/synthesize/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("without the hello-scholar response wrapper", skill)
        agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
        self.assertIn("deliverable is `synthesize` output", agents)
        chinese = (ROOT / "AGENTS-zh.md").read_text(encoding="utf-8")
        self.assertIn("`synthesize` 产出的文字", chinese)

    def test_design_turns_explain_changes_and_hand_off_execution(self) -> None:
        specs = (ROOT / "skills/manage-specs/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("ready-to-paste execution request", specs)
        self.assertIn("Revision Notes", specs)
        english = (ROOT / "skills/manage-specs/assets/spec-template.md").read_text(encoding="utf-8")
        chinese = (ROOT / "skills/manage-specs/assets/spec-template.zh_CN.md").read_text(encoding="utf-8")
        self.assertIn("## 6. Revision Notes", english)
        self.assertIn("## 6. 修订说明", chinese)
        review = (ROOT / "skills/review/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("map each finding", review)
        agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
        self.assertIn("the final message carries the substance on its own", agents)
        self.assertIn("before → after", agents)
        self.assertIn("before → after", specs)

    def test_grilling_deepens_requests_without_enlarging_them(self) -> None:
        english = (ROOT / "skills/grilling/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Deepen a request instead of enlarging it", english)
        self.assertIn("rewritten request in a fenced block", english)
        self.assertIn("deepening a request authorizes no work", english)
        chinese = (ROOT / "skills/grilling/SKILL.zh_CN.md").read_text(encoding="utf-8")
        self.assertIn("加深请求，而不是扩大请求", chinese)

    def test_large_artifacts_stay_out_of_run_directories(self) -> None:
        for name in ("AGENTS.md", "AGENTS-zh.md"):
            text = (ROOT / name).read_text(encoding="utf-8")
            self.assertIn("artifacts/<run-id>/", text)
        reference = (
            ROOT / "skills/record-experiment/references/status-and-fields.md"
        ).read_text(encoding="utf-8")
        self.assertIn("Do not copy them into the Run directory", reference)
        architecture = (
            ROOT / "skills/docs-maintenance/assets/architecture-template.md"
        ).read_text(encoding="utf-8")
        self.assertIn("artifact root", architecture)

    def test_release_code_exports_one_way_and_stops_before_publishing(self) -> None:
        skill = (ROOT / "skills/release-code/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("never developed in parallel", skill)
        self.assertIn("orphan branch", skill)
        self.assertIn("refs/heads/release:refs/heads/main", skill)
        self.assertIn("compare each result with the value reported in the paper", skill)
        self.assertIn("not every Run Record", skill)
        self.assertIn("requires the user's explicit authorization", skill)
        self.assertIn("references/release-checks.md", skill)
        self.assertIn("assets/readme-template.md", skill)
        for name in ("readme-template.md", "readme-template.zh_CN.md"):
            template = (ROOT / "skills/release-code/assets" / name).read_text(encoding="utf-8")
            self.assertIn("```bibtex", template)
            self.assertIn("± 0.002", template)

    def test_skills_agree_on_run_outputs_retries_and_releases(self) -> None:
        for name in ("AGENTS.md", "AGENTS-zh.md"):
            text = (ROOT / name).read_text(encoding="utf-8")
            self.assertIn("`runs/*/results/`", text)
            self.assertNotIn("experiment outputs/results/logs", text)
            self.assertNotIn("实验 outputs/results/logs", text)
        agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
        self.assertIn("small result summaries a Record cites under `runs/<run-id>/` may be tracked", agents)
        self.assertIn("`runs/*/record.md`", agents)
        self.assertIn("section 6, File and Run Artifact Locations", agents)
        record = (ROOT / "skills/record-experiment/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Start the research execution from a committed tree", record)
        self.assertIn("Conventional Commits", agents)
        self.assertIn("`exp` for experiment code and configs", agents)
        for name in ("AGENTS.md", "AGENTS-zh.md"):
            self.assertNotIn("runs/<run-id>/code/", (ROOT / name).read_text(encoding="utf-8"))
        self.assertIn("`runs/*/results/`, and `artifacts/`", record)
        release = (ROOT / "skills/release-code/SKILL.md").read_text(encoding="utf-8")
        self.assertIn("type `capability`", release)
        self.assertIn("new Run through `record-experiment`", release)
        self.assertIn("conda-pack", release)
        for name in ("remote-rules.md", "remote-rules.zh_CN.md"):
            rules = (ROOT / "skills/remote-run/assets" / name).read_text(encoding="utf-8")
            self.assertNotIn("model provider", rules)
            self.assertNotIn("模型厂商", rules)
            self.assertIn("scripts/remote/sync.sh pull", rules)
            self.assertIn("git rebase refs/remote-run/server", rules)
            self.assertIn("runs/<run-id>/results/", rules)
            self.assertIn("record-experiment", rules)
            self.assertNotIn("run.sh", rules)

    def test_handoff_stores_only_nonrecoverable_context(self) -> None:
        skill = (ROOT / "skills/handoff/SKILL.md").read_text(encoding="utf-8")
        template = (ROOT / "skills/handoff/assets/handoff-template.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("cannot reliably recover", skill)
        self.assertIn("Verification State", template)
        self.assertNotIn("suggested skills", template.lower())


if __name__ == "__main__":
    unittest.main()
