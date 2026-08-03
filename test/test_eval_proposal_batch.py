#!/usr/bin/env python3
"""Static contract for the next-generation Skill Eval Proposal batch."""

from __future__ import annotations

import json
from pathlib import Path
import re
import unittest

from skill_eval_contract import (
    SONNET_EVAL_AGENT_MODEL,
    TERRA_EVAL_AGENT_MODEL,
    sha256_file,
    sha256_tree,
)


REPO_ROOT = Path(__file__).resolve().parents[1]
EVAL_ROOT = REPO_ROOT / "test" / "skill-evals"
SPEC_ROOT = REPO_ROOT / "docs" / "specs" / "next_generation_skill"
USER_VALUE_PATH = EVAL_ROOT / "user-value-rubric.json"
DETAILS_START = "<!-- BEGIN GENERATED PROPOSAL DETAILS -->"
DETAILS_END = "<!-- END GENERATED PROPOSAL DETAILS -->"
BATCHES = {
    2: {
        "batchId": "next-generation-skill-protocol-v2-proposals-batch-v2",
        "manifestPath": SPEC_ROOT / "eval-proposal-batch-v2.json",
        "reviewPath": SPEC_ROOT / "eval-proposal-review.md",
        "expectedCount": 37,
        "agentModel": TERRA_EVAL_AGENT_MODEL,
    },
    3: {
        "batchId": "generating-tasks-sonnet-v3-proposals-batch-v1",
        "manifestPath": SPEC_ROOT / "eval-proposal-batch-v3.json",
        "reviewPath": SPEC_ROOT / "eval-proposal-review-v3.md",
        "expectedCount": 2,
        "agentModel": SONNET_EVAL_AGENT_MODEL,
    },
}
FIXTURE_HASH_CONTRACT = (
    "SHA-256 over each sorted fixture-relative POSIX path, NUL, file bytes, and "
    "NUL; .git, __pycache__, .DS_Store, and .hello-scholar-install.json are excluded."
)
FIXTURE_DISCLOSURE_REVIEWS = {
    2: {
        "reviewedProposalCount": 37,
        "implementerVisible": [
            "Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.",
            "Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.",
        ],
        "evaluatorOnly": [
            "The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.",
            "Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.",
        ],
        "materialCorrections": [
            {
                "scenarioId": "record-exploration-backfill",
                "change": "Project rules now expose isolation, bounded cost, and provenance facts without directly stating the exploration/backfill branch or its workflow boundary.",
            },
            {
                "scenarioId": "record-formal-prelaunch",
                "change": "Project rules point to the real Accepted Spec and Approved Plan instead of repeating the target Skill's complete prelaunch answer.",
            },
            {
                "scenarioId": "record-terminal-evidence",
                "change": "Project rules require evidence-based classification without revealing which saved Run is failed versus a valid negative result.",
            },
        ],
        "runtimeArtifactRule": "Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.",
    },
    3: {
        "reviewedProposalCount": 2,
        "implementerVisible": [
            "Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.",
            "Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.",
        ],
        "evaluatorOnly": [
            "The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.",
            "Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.",
        ],
        "materialCorrections": [
            {
                "scenarioId": "generating-tasks-v3-feature-policy",
                "change": "This Sonnet v3 successor reuses the real feature-policy project facts without copying any Terra Baseline, Scorecard, run evidence, or approval decision.",
            },
            {
                "scenarioId": "generating-tasks-v3-migration",
                "change": "This Sonnet v3 successor reuses the real config-migration project facts without copying any Terra Baseline, Scorecard, run evidence, or approval decision.",
            },
        ],
        "runtimeArtifactRule": "Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.",
    },
}


def _load_json(path: Path) -> dict:
    """Purpose: load one required JSON object; Input: file path; Output: parsed mapping; Errors: file, encoding, or JSON failures propagate."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise TypeError(f"{path}: expected a JSON object")
    return value


def _original_request(path: Path) -> str:
    """Purpose: extract the business goal shown to the Implementer; Input: Scenario Markdown path; Output: exact original request; Errors: ValueError for a missing or duplicate section."""
    text = path.read_text(encoding="utf-8")
    matches = re.findall(
        r"^## (?:Original User Request|原始用户请求)\s*$\n(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    if len(matches) != 1 or not matches[0].strip():
        raise ValueError(f"{path}: expected one nonempty original request")
    return matches[0].strip()


def _expected_manifest(protocol_version: int) -> dict:
    """Purpose: project one formal Protocol cohort into a review envelope; Input: Protocol version and repository Eval files; Output: deterministic batch manifest; Side effects: reads Scenario, Protocol, Fixture, Approval ID, and shared rubric files."""
    batch = BATCHES[protocol_version]
    shared = _load_json(USER_VALUE_PATH)
    shared_hash = sha256_file(USER_VALUE_PATH)
    proposals: list[dict] = []
    for scenario_dir in sorted(EVAL_ROOT.iterdir(), key=lambda path: path.name):
        protocol_path = scenario_dir / "protocol.json"
        if not scenario_dir.is_dir() or not protocol_path.exists():
            continue
        protocol = _load_json(protocol_path)
        if protocol.get("protocolVersion") != protocol_version:
            continue
        scenario_path = scenario_dir / "scenario.md"
        fixture_path = scenario_dir / "fixture"
        approval_path = scenario_dir / "proposal-approval.json"
        approval = _load_json(approval_path)
        proposals.append(
            {
                "ordinal": len(proposals) + 1,
                "proposalId": approval["proposalId"],
                "scenarioId": protocol["scenarioId"],
                "caseId": protocol["caseId"],
                "projectId": protocol["projectId"],
                "primarySkill": protocol["primarySkill"],
                "agentModel": protocol["agents"]["model"],
                "countsTowardProductSkill": protocol["countsTowardProductSkill"],
                "approvalRecordPath": approval_path.relative_to(REPO_ROOT).as_posix(),
                "inputBindings": {
                    "scenario": {
                        "path": scenario_path.relative_to(REPO_ROOT).as_posix(),
                        "sha256": sha256_file(scenario_path),
                    },
                    "protocol": {
                        "path": protocol_path.relative_to(REPO_ROOT).as_posix(),
                        "sha256": sha256_file(protocol_path),
                    },
                    "fixture": {
                        "path": fixture_path.relative_to(REPO_ROOT).as_posix(),
                        "sha256": sha256_tree(fixture_path),
                    },
                },
                "businessGoal": _original_request(scenario_path),
                "businessRubric": protocol["rubric"],
                "sharedUserValue": {
                    "rubricId": shared["rubricId"],
                    "rubricPath": protocol["userValueRubric"]["path"],
                    "rubricSha256": protocol["userValueRubric"]["sha256"],
                    "dimensionIds": [
                        dimension["id"] for dimension in shared["dimensions"]
                    ],
                },
                "criticalPath": protocol["criticalPath"],
            }
        )

    return {
        "manifestVersion": 1,
        "batchId": batch["batchId"],
        "statusAtCreation": "pending-user-review",
        "proposalCount": len(proposals),
        "approvalSemantics": {
            "approvedAction": f"Authorize Baseline Observation for exactly the bound {len(proposals)} Protocol v{protocol_version} Proposals; do not accept Skill output or authorize Live Eval.",
            "includedImmutableBytes": [
                "Every scenario.md byte sequence bound by scenario SHA-256.",
                "Every protocol.json byte sequence bound by protocol SHA-256.",
                "Every Fixture file path and byte sequence bound by the deterministic Fixture tree SHA-256 contract.",
                "The shared user-value-rubric.json byte sequence bound by its SHA-256.",
                f"This canonical manifest byte sequence bound by the external Batch SHA-256 published in {batch['reviewPath'].name}.",
            ],
            "excludedMutableBytes": [
                "proposal-approval.json bytes; their pending input hashes must already match this manifest, while decision and replyEvidence change only after the user approves this Batch ID and Batch SHA-256.",
                "Baseline, Scorecard, and evidence bytes created only by later authorized stages.",
                "The historical Protocol v1 framework-e2e-paged-cache directory and its saved Baseline evidence.",
                "Production Skill bytes, which are evaluated only after a real Red Baseline.",
            ],
            "invalidationRule": "Any semantic change to a bound Scenario, Protocol, Fixture, shared rubric, or this manifest requires a new Batch SHA-256 and a new user review before any affected run.",
        },
        "fixtureTreeHashContract": FIXTURE_HASH_CONTRACT,
        "fixtureDisclosureReview": FIXTURE_DISCLOSURE_REVIEWS[protocol_version],
        "sharedUserValueRubric": {
            "path": USER_VALUE_PATH.relative_to(REPO_ROOT).as_posix(),
            "sha256": shared_hash,
            "rubricId": shared["rubricId"],
            "rubricVersion": shared["rubricVersion"],
            "dimensions": shared["dimensions"],
            "minimumTotal": shared["minimumTotal"],
            "scoreAnchors": shared["scoreAnchors"],
        },
        "proposals": proposals,
    }


def _canonical_json(value: dict) -> str:
    """Purpose: serialize the batch with stable readable bytes; Input: manifest mapping; Output: canonical repository JSON text."""
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def _one_line(value: str) -> str:
    """Purpose: make a multi-paragraph request readable in one review bullet; Input: arbitrary text; Output: whitespace-normalized text."""
    return " ".join(value.split())


def _render_review_details(manifest: dict) -> str:
    """Purpose: render every batch-bound review fact for human inspection; Input: batch manifest; Output: deterministic Markdown detail section."""
    shared = manifest["sharedUserValueRubric"]
    disclosure = manifest["fixtureDisclosureReview"]
    protocol_version = next(
        version
        for version, batch in BATCHES.items()
        if batch["batchId"] == manifest["batchId"]
    )
    lines: list[str] = [
        "### 批次共同用户价值 rubric",
        "",
        f"`{shared['rubricId']}` / `{shared['sha256']}`；各维和总分最低 `{shared['minimumTotal']}`。以下五维适用于全部 {manifest['proposalCount']} 项，不在每项下重复。",
        "",
    ]
    for dimension in shared["dimensions"]:
        lines.append(
            f"- `{dimension['id']}` - 权重 `{dimension['weight']}%`，"
            f"critical `{str(dimension['critical']).lower()}`，最低 `{dimension['minimum']}`："
            f"{dimension['criterion']}"
        )
    lines.extend(
        [
            "",
            "### Fixture 答案隔离复核",
            "",
            f"已逐项复核 `{disclosure['reviewedProposalCount']}` 个 pending v{protocol_version} Fixture。Implementer 可见：",
            "",
        ]
    )
    lines.extend(f"- {item}" for item in disclosure["implementerVisible"])
    lines.extend(["", "Evaluator-only：", ""])
    lines.extend(f"- {item}" for item in disclosure["evaluatorOnly"])
    lines.extend(["", "本轮材料性清理：", ""])
    for correction in disclosure["materialCorrections"]:
        lines.append(f"- `{correction['scenarioId']}`：{correction['change']}")
    lines.extend(
        [
            f"- Runtime artifact：{disclosure['runtimeArtifactRule']}",
            "",
            f"### {manifest['proposalCount']} 项逐项合同",
            "",
        ]
    )
    for proposal in manifest["proposals"]:
        lines.extend(
            [
                f"### {proposal['ordinal']:02d}. `{proposal['scenarioId']}` - `{proposal['primarySkill']}`",
                "",
                f"- Proposal ID: [`{proposal['proposalId']}`](../../../{proposal['approvalRecordPath']})",
                f"- Project / case: `{proposal['projectId']}` / `{proposal['caseId']}`",
                f"- Agent model: `{proposal['agentModel']}`",
                "- 计入产品 Skill case: "
                + ("是" if proposal["countsTowardProductSkill"] else "否"),
                f"- 业务目标: {_one_line(proposal['businessGoal'])}",
                "",
                "**当前不可变输入**",
                "",
            ]
        )
        for label, key in (("Scenario", "scenario"), ("Protocol", "protocol"), ("Fixture", "fixture")):
            binding = proposal["inputBindings"][key]
            lines.append(
                f"- {label}: [`{binding['path']}`](../../../{binding['path']}) = "
                f"`{binding['sha256']}`"
            )

        rubric = proposal["businessRubric"]
        lines.extend(
            [
                "",
                f"**业务 rubric**（各 critical 维度和总分最低 `{rubric['minimumTotal']}`）",
                "",
            ]
        )
        for dimension in rubric["dimensions"]:
            lines.append(
                f"- `{dimension['id']}` - 权重 `{dimension['weight']}%`，"
                f"critical `{str(dimension['critical']).lower()}`，最低 `{dimension['minimum']}`："
                f"{dimension['criterion']}"
            )

        shared_dimension_ids = "、".join(
            f"`{dimension_id}`"
            for dimension_id in proposal["sharedUserValue"]["dimensionIds"]
        )
        lines.extend(
            [
                "",
                f"- 共享用户价值五维：{shared_dimension_ids}。使用批次共同 `{shared['rubricId']}` / `{shared['sha256']}`，每维和总分分别过门。",
            ]
        )

        lines.extend(["", "**Hard rejects**", ""])
        for reject in rubric["hardRejects"]:
            lines.append(f"- {reject}")

        lines.extend(
            [
                "",
                f"**Critical path**: {proposal['criticalPath']}",
                "",
                "该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。",
                "",
            ]
        )
    return "\n".join(lines).rstrip() + "\n"


class EvalProposalBatchTests(unittest.TestCase):
    def test_manifests_match_their_protocol_cohorts(self) -> None:
        """Purpose: bind each formal cohort to all and only its current Proposals; Input: repository Protocols and saved manifests; Output: none; Errors: assertion failure identifies cohort drift."""
        for protocol_version, batch in BATCHES.items():
            with self.subTest(protocol_version=protocol_version):
                manifest = _load_json(batch["manifestPath"])
                expected = _expected_manifest(protocol_version)
                self.assertEqual(batch["expectedCount"], expected["proposalCount"])
                self.assertEqual(expected, manifest)
                self.assertEqual(
                    {batch["agentModel"]},
                    {proposal["agentModel"] for proposal in manifest["proposals"]},
                )
        v2_manifest = _load_json(BATCHES[2]["manifestPath"])
        self.assertNotIn(
            "framework-e2e-paged-cache",
            {proposal["scenarioId"] for proposal in v2_manifest["proposals"]},
        )
        v3_manifest = _load_json(BATCHES[3]["manifestPath"])
        self.assertEqual(
            {
                "generating-tasks-v3-feature-policy",
                "generating-tasks-v3-migration",
            },
            {proposal["scenarioId"] for proposal in v3_manifest["proposals"]},
        )
        self.assertTrue(
            all(
                proposal["countsTowardProductSkill"] is False
                for proposal in v3_manifest["proposals"]
            )
        )

    def test_mutable_approval_records_target_the_bound_inputs(self) -> None:
        """Purpose: keep pending and approved records pointed at reviewed bytes; Input: each manifest and mutable Approval records; Output: none; Errors: assertion failure identifies stale hashes or invalid decision evidence."""
        mismatches: list[str] = []
        for protocol_version, batch in BATCHES.items():
            manifest = _load_json(batch["manifestPath"])
            for proposal in manifest["proposals"]:
                scenario_id = proposal["scenarioId"]
                approval = _load_json(REPO_ROOT / proposal["approvalRecordPath"])
                if proposal["proposalId"] != approval.get("proposalId"):
                    mismatches.append(f"v{protocol_version}/{scenario_id}: proposalId")
                for field, binding in (
                    ("scenarioSha256", "scenario"),
                    ("protocolSha256", "protocol"),
                    ("fixtureSha256", "fixture"),
                ):
                    if (
                        proposal["inputBindings"][binding]["sha256"]
                        != approval.get(field)
                    ):
                        mismatches.append(f"v{protocol_version}/{scenario_id}: {field}")
                decision = approval.get("decision")
                if decision not in {"pending", "approved"}:
                    mismatches.append(f"v{protocol_version}/{scenario_id}: decision")
                elif decision == "pending" and approval.get("replyEvidence") is not None:
                    mismatches.append(f"v{protocol_version}/{scenario_id}: pending replyEvidence")
                elif decision == "approved" and (
                    not isinstance(approval.get("replyEvidence"), str)
                    or not approval["replyEvidence"].strip()
                ):
                    mismatches.append(f"v{protocol_version}/{scenario_id}: approved replyEvidence")
        self.assertEqual([], mismatches, "\n".join(mismatches))

    def test_manifest_bytes_are_canonical_and_hashes_are_published(self) -> None:
        """Purpose: bind published Batch SHA-256 values to canonical manifest bytes; Input: each manifest and review Markdown; Output: none; Errors: assertion failure identifies serialization or Hash drift."""
        for protocol_version, batch in BATCHES.items():
            with self.subTest(protocol_version=protocol_version):
                manifest = _load_json(batch["manifestPath"])
                self.assertEqual(
                    _canonical_json(manifest),
                    batch["manifestPath"].read_text(encoding="utf-8"),
                )
                manifest_hash = sha256_file(batch["manifestPath"])
                review = batch["reviewPath"].read_text(encoding="utf-8")
                published = re.findall(
                    r"^- Batch SHA-256: `sha256:([0-9a-f]{64})`$",
                    review,
                    re.MULTILINE,
                )
                self.assertEqual([manifest_hash], published)
                self.assertIn(f"- Batch ID: `{batch['batchId']}`", review)

    def test_review_displays_every_manifest_bound_detail(self) -> None:
        """Purpose: keep each human review page complete and deterministic; Input: manifests and generated Markdown regions; Output: none; Errors: assertion failure identifies omitted or altered review facts."""
        for protocol_version, batch in BATCHES.items():
            with self.subTest(protocol_version=protocol_version):
                manifest = _load_json(batch["manifestPath"])
                review = batch["reviewPath"].read_text(encoding="utf-8")
                self.assertEqual(1, review.count(DETAILS_START))
                self.assertEqual(1, review.count(DETAILS_END))
                actual = review.split(DETAILS_START, 1)[1].split(DETAILS_END, 1)[0]
                self.assertEqual(f"\n{_render_review_details(manifest)}", actual)

    def test_v3_proposals_are_pending_and_have_no_run_artifacts(self) -> None:
        """Purpose: stop a pending Sonnet Proposal from containing fabricated run evidence; Input: v3 manifest entries and scenario directories; Output: none; Errors: assertion failure identifies a premature run artifact."""
        manifest = _load_json(BATCHES[3]["manifestPath"])
        for proposal in manifest["proposals"]:
            scenario_dir = REPO_ROOT / Path(proposal["approvalRecordPath"]).parent
            with self.subTest(scenario=scenario_dir.name):
                approval = _load_json(scenario_dir / "proposal-approval.json")
                self.assertEqual("pending", approval["decision"])
                self.assertIsNone(approval["replyEvidence"])
                self.assertFalse((scenario_dir / "baseline.json").exists())
                self.assertFalse((scenario_dir / "scorecard.json").exists())
                self.assertFalse((scenario_dir / "evidence").exists())


if __name__ == "__main__":
    unittest.main()
