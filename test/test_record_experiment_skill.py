#!/usr/bin/env python3
"""Forward-test harness for record-experiment's canonical root Run contract.

Run the static and harness self-tests:

    python3 -m unittest discover -s test

The SCENARIOS prompts are for fresh-agent forward tests. Each test fixture writes
only under a temporary workspace and validates root Run artifacts directly.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import tempfile
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = REPO_ROOT / "skills" / "record-experiment"
SKILL_MD = SKILL_DIR / "SKILL.md"
SKILL_ZH = SKILL_DIR / "SKILL.zh_CN.md"
FIELD_GUIDE = SKILL_DIR / "references" / "status-and-fields.md"
EXAMPLES = SKILL_DIR / "references" / "examples.md"
RUN_TEMPLATE = SKILL_DIR / "assets" / "run-record-template.md"
RUN_TEMPLATE_ZH = SKILL_DIR / "assets" / "run-record-template.zh_CN.md"
RUNS_ROOT = Path("runs")

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
TERMINAL_STATUSES = {"completed", "failed", "interrupted", "cancelled"}
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
FORBIDDEN_RUN_DOCUMENTS = (
    "run.json",
    "README.md",
    "report.md",
    "summary.md",
    "final-report.md",
)


@dataclass(frozen=True)
class Scenario:
    scenario_id: str
    title: str
    prompt: str
    expect_records: bool = True
    required_text: tuple[str, ...] = ()
    expected_status: str | None = None
    expected_decision: str | None = None
    require_unknown: bool = False
    require_dashboard: bool = False
    expect_not_launched: bool = False
    min_run_records: int = 1
    required_regex: tuple[str, ...] = ()


APPEND_EVENT_EXAMPLES = (
    "Is the tmux training run still alive?",
    "Open TensorBoard for the current run.",
    "Show me the latest loss from the existing log.",
    "Do we have intermediate checkpoints?",
)


def prompt(body: str) -> str:
    """Purpose: build one isolated forward-test prompt; Input: scenario request; Output: complete agent prompt."""
    return (
        "Use the record-experiment skill at "
        f"{SKILL_DIR}.\n\n"
        "Use this temporary workspace as the repository root for any files you "
        "create: {workspace}\n"
        "For this forward test, treat the repository language preference as English.\n"
        "Do not write experiment artifacts outside that workspace.\n\n"
        f"{body.strip()}\n"
    )


SCENARIOS: dict[str, Scenario] = {
    "prelaunch_hard_gate": Scenario(
        "prelaunch_hard_gate",
        "Create a root Record before an eval launch",
        prompt(
            """
            I need you to run an evaluation command:
            python eval.py --config configs/baseline.yaml --seed 0 --split test

            There is no existing Run Record. Prepare whatever is needed and then
            tell me what you would run.
            """
        ),
        required_text=("python eval.py", "configs/baseline.yaml", "--seed 0"),
        expected_status="planned",
        expect_not_launched=True,
    ),
    "user_urgency_pressure": Scenario(
        "user_urgency_pressure",
        "Urgency does not bypass a formal record",
        prompt(
            """
            Don't spend time writing records now. Just start this immediately and
            we can document it after:
            python train.py --config configs/ablation.yaml --seed 42
            """
        ),
        required_text=("python train.py", "configs/ablation.yaml", "--seed 42"),
        expected_status="planned",
        expect_not_launched=True,
    ),
    "dashboard_still_needs_local_record": Scenario(
        "dashboard_still_needs_local_record",
        "A dashboard does not replace a local root Record",
        prompt(
            """
            This run is already tracked in W&B:
            https://wandb.ai/example/project/runs/abc123

            Please summarize the experiment state and continue tracking the
            actual run locally. Command was:
            python eval.py --config configs/router.yaml --seed 1
            """
        ),
        required_text=("python eval.py", "configs/router.yaml", "wandb.ai"),
        expected_status="planned",
        require_dashboard=True,
    ),
    "checkpoint_model_inference_prelaunch": Scenario(
        "checkpoint_model_inference_prelaunch",
        "Checkpoint inference creates a formal experiment identity",
        prompt(
            """
            Use the final checkpoint to run predictions on this held-out shard:

            python scripts/infer.py --checkpoint checkpoints/final.pt \
              --input data/holdout.jsonl --out outputs/predictions.jsonl \
              --device cuda:0 --dtype bf16 --batch-size 8

            Prepare the persistent Run Record before launch.
            """
        ),
        required_text=(
            "python scripts/infer.py",
            "--checkpoint",
            "--device cuda:0",
            "outputs/predictions.jsonl",
        ),
        expected_status="planned",
        expect_not_launched=True,
    ),
    "derived_report_requires_upstream_record": Scenario(
        "derived_report_requires_upstream_record",
        "A durable report preserves upstream Run provenance",
        prompt(
            """
            I have `outputs/model_a_predictions.jsonl` and
            `outputs/model_b_predictions.jsonl`, but no local record says how
            they were produced. Create a durable HTML comparison report at
            `outputs/prediction_comparison_report.html` and preserve upstream
            Run provenance even if some upstream facts are unknown.
            """
        ),
        required_text=(
            "model_a_predictions.jsonl",
            "model_b_predictions.jsonl",
            "prediction_comparison_report.html",
            "Upstream Run ID",
            "Input artifacts",
            "Derived artifacts",
        ),
        expected_status="planned",
        require_unknown=True,
        min_run_records=2,
        required_regex=(
            r"(?im)^- Upstream Run ID: (?!N/A\b|None\b|Unknown\b|$).+",
            r"(?im)^- Input artifacts:.*jsonl",
            r"(?im)^- Derived artifacts:.*html",
        ),
    ),
    "retroactive_record_unknowns": Scenario(
        "retroactive_record_unknowns",
        "Missing contextual facts remain Unknown during backfill",
        prompt(
            """
            I already started this earlier:
            python train.py --config configs/main.yaml --seed 7

            Please create the experiment record now. I do not remember the
            exact CWD, Git commit, or result path.
            """
        ),
        required_text=("python train.py", "configs/main.yaml", "--seed 7"),
        expected_status="running",
        require_unknown=True,
    ),
    "failed_run_record": Scenario(
        "failed_run_record",
        "Failed Runs retain their evidence",
        prompt(
            """
            The run crashed with CUDA OOM after validation step 1.
            Command:
            python train.py --config configs/large.yaml --seed 3
            Log: logs/large_s3.log
            Please update the experiment records.
            """
        ),
        required_text=("CUDA OOM", "logs/large_s3.log", "python train.py"),
        expected_status="failed",
        expected_decision="retry-smaller-batch",
    ),
    "negative_result_record": Scenario(
        "negative_result_record",
        "A valid underperforming result is completed, not failed",
        prompt(
            """
            This valid eval finished below baseline: baseline accuracy 82.0,
            current accuracy 81.2, result file
            results/dropout_ablation_s42.json. Command:
            python eval.py --config configs/dropout.yaml --seed 42
            Please record the result.
            """
        ),
        required_text=("accuracy 81.2", "results/dropout_ablation_s42.json"),
        expected_status="completed",
        expected_decision="do-not-adopt",
    ),
    "out_of_scope_no_record": Scenario(
        "out_of_scope_no_record",
        "Literature notes do not create a Run",
        prompt(
            """
            Please write a short literature note summarizing why contrastive
            learning is useful for retrieval. No experiment is being launched,
            monitored, stopped, rerun, recovered, or summarized.
            """
        ),
        expect_records=False,
    ),
    "field_format_consistency": Scenario(
        "field_format_consistency",
        "Planned Records use canonical Front Matter and body sections",
        prompt(
            """
            Create a planned Run Record for:
            python eval.py --config configs/baseline.yaml --seed 0 --split test

            Use the skill's template style.
            """
        ),
        required_text=("python eval.py", "configs/baseline.yaml", "--seed 0"),
        expected_status="planned",
        expect_not_launched=True,
    ),
}


def runs_dir(workspace: Path) -> Path:
    """Purpose: resolve the canonical root Run directory; Input: temporary project root; Output: absolute runs path."""
    return workspace / RUNS_ROOT


def run_record_paths(workspace: Path) -> list[Path]:
    """Purpose: locate direct canonical Run Records; Input: temporary project root; Output: sorted record paths."""
    root = runs_dir(workspace)
    if not root.exists():
        return []
    return sorted(path for path in root.glob("*/record.md") if path.is_file())


def read_all_run_records(workspace: Path) -> str:
    """Purpose: combine canonical Run text for assertions; Input: temporary project root; Output: joined Record content."""
    return "\n\n".join(path.read_text(encoding="utf-8") for path in run_record_paths(workspace))


def front_matter(text: str) -> dict[str, str]:
    """Purpose: parse simple Record Front Matter; Input: Markdown Record text; Output: field-value map; Errors: malformed delimiters or fields."""
    parts = text.split("---\n", 2)
    if len(parts) != 3 or parts[0] != "":
        raise AssertionError("Record must start with Front Matter")
    values: dict[str, str] = {}
    for raw_line in parts[1].splitlines():
        key, separator, value = raw_line.partition(":")
        if not separator:
            raise AssertionError(f"Invalid Front Matter line: {raw_line}")
        values[key] = value.strip()
    return values


def assert_canonical_record(testcase: unittest.TestCase, workspace: Path, path: Path) -> dict[str, str]:
    """Purpose: validate one root Record fixture; Input: testcase, workspace, and Record path; Output: Front Matter values; Errors: noncanonical path, schema, lifecycle, or body."""
    relative_path = path.relative_to(workspace)
    testcase.assertEqual(3, len(relative_path.parts), f"Unexpected Record path: {relative_path}")
    testcase.assertEqual("runs", relative_path.parts[0])
    testcase.assertEqual("record.md", relative_path.parts[2])

    text = path.read_text(encoding="utf-8")
    attributes = front_matter(text)
    for field in REQUIRED_FRONT_MATTER:
        testcase.assertIn(field, attributes)
    testcase.assertEqual("1", attributes["schema"])
    testcase.assertEqual("record", attributes["kind"])
    testcase.assertEqual(relative_path.parts[1], attributes["run_id"])
    testcase.assertIn(attributes["status"], {"planned", "running", *TERMINAL_STATUSES})

    association = (attributes["spec"], attributes["spec_revision"], attributes["plan_revision"])
    testcase.assertTrue(
        all(value == "null" for value in association) or all(value != "null" for value in association),
        "Record association must be complete or all null",
    )
    if attributes["status"] == "planned":
        testcase.assertEqual("null", attributes["started"])
        testcase.assertEqual("null", attributes["completed"])
    elif attributes["status"] == "running":
        testcase.assertRegex(attributes["started"], r"T.*(?:Z|[+-]\d\d:\d\d)$")
        testcase.assertEqual("null", attributes["completed"])
    else:
        testcase.assertRegex(attributes["started"], r"T.*(?:Z|[+-]\d\d:\d\d)$")
        testcase.assertRegex(attributes["completed"], r"T.*(?:Z|[+-]\d\d:\d\d)$")

    sections = tuple(re.findall(r"(?m)^## \d+\. .+$", text))
    testcase.assertEqual(ENGLISH_SECTIONS, sections)
    for forbidden_name in FORBIDDEN_RUN_DOCUMENTS:
        testcase.assertFalse((path.parent / forbidden_name).exists(), f"Secondary Run document: {forbidden_name}")
    return attributes


def assert_records_exist(testcase: unittest.TestCase, workspace: Path, min_records: int = 1) -> str:
    """Purpose: require valid canonical Run fixtures; Input: testcase, workspace, and minimum count; Output: combined Record text; Errors: missing or invalid Record."""
    records = run_record_paths(workspace)
    testcase.assertGreaterEqual(len(records), min_records, f"Expected at least {min_records} Run Record(s)")
    for record in records:
        assert_canonical_record(testcase, workspace, record)
    return read_all_run_records(workspace)


def assert_no_records_exist(testcase: unittest.TestCase, workspace: Path) -> None:
    """Purpose: verify a no-record scenario leaves no Run Record; Input: testcase and workspace; Output: none; Errors: unexpected canonical Record."""
    testcase.assertEqual([], run_record_paths(workspace))


def assert_contains_all(testcase: unittest.TestCase, text: str, terms: tuple[str, ...]) -> None:
    """Purpose: require scenario evidence terms; Input: testcase, text, and terms; Output: none; Errors: missing expected term."""
    for term in terms:
        testcase.assertIn(term, text)


def skill_description(path: Path) -> str:
    """Purpose: extract model invocation description; Input: Skill path; Output: description text; Errors: missing Front Matter description."""
    text = path.read_text(encoding="utf-8")
    match = re.search(r"(?ms)^---\s*\n.*?^description:\s*(.*?)\n---", text)
    if not match:
        raise AssertionError(f"Missing frontmatter description in {path}")
    return match.group(1)


def assert_not_launched(testcase: unittest.TestCase, workspace: Path, attributes: dict[str, str]) -> None:
    """Purpose: verify a formal prelaunch fixture remains unstarted; Input: testcase, workspace, and Record metadata; Output: none; Errors: launched lifecycle or extra artifacts."""
    testcase.assertEqual("planned", attributes["status"])
    testcase.assertEqual("null", attributes["started"])
    testcase.assertEqual("null", attributes["completed"])
    unexpected = [
        path.relative_to(workspace).as_posix()
        for path in workspace.rglob("*")
        if path.is_file() and not path.is_relative_to(runs_dir(workspace))
    ]
    testcase.assertEqual([], unexpected, f"Unexpected launch artifacts: {unexpected}")


def write_run_record(
    workspace: Path,
    run_id: str,
    command: str,
    *,
    status: str = "planned",
    decision: str = "pending",
    dashboard: str = "N/A",
    extra_notes: str = "",
    evidence: str = "",
    input_artifacts: str = "N/A",
    upstream_run_id: str = "N/A",
    derived_artifacts: str = "N/A",
) -> Path:
    """Purpose: write a valid canonical Record fixture; Input: workspace, identity, command, and evidence fields; Output: Record path; Side effects: creates one Run directory and Record file."""
    target_directory = runs_dir(workspace) / run_id
    target_directory.mkdir(parents=True, exist_ok=True)
    if status == "planned":
        started = "null"
        completed = "null"
        summary = "Run is planned and has not started."
    elif status == "running":
        started = "2026-08-03T12:00:00Z"
        completed = "null"
        summary = "Run is active and awaits terminal evidence."
    else:
        started = "2026-08-03T12:00:00Z"
        completed = "2026-08-03T12:05:00Z"
        summary = f"Run ended with status {status}."

    record = f"""---
schema: 1
kind: record
run_id: {run_id}
title: {run_id} fixture
status: {status}
spec: null
spec_revision: null
plan_revision: null
started: {started}
completed: {completed}
decision: {decision}
summary: {summary}
---
# {run_id} fixture

## 1. Purpose

- Purpose: test scenario {evidence}

## 2. Hypothesis

- Hypothesis: the configured command produces recoverable evidence.

## 3. Experimental Variables

- Variables: fixture configuration and seed.

## 4. Controls

- Controls: fixed test split and command.

## 5. Execution Information

- Exact command: {command}
- CWD: {"Unknown; backfilled after launch" if extra_notes else "/tmp/project"}
- Script / entry point: eval.py
- Config: configs/baseline.yaml
- CLI overrides: --seed 0
- Seed: 0
- Data version / split: test
- Preprocessing: N/A
- Input artifacts: {input_artifacts}
- Upstream Run ID: {upstream_run_id}
- Derived artifacts: {derived_artifacts}
- Model / checkpoint: N/A
- Evaluation / generation settings: N/A
- Git branch: main
- Git commit: {"Unknown; unavailable during backfill" if extra_notes else "abc1234"}
- Git working-tree state: clean
- Backend: local
- Machine / GPU: local CPU
- Python / environment: python 3.11
- Expected signal: metric file appears
- Failure signal: crash or missing result
- Stop rule: stop after result file appears

## 6. Artifact Locations

- Intended log path: logs/test.log
- Intended result path: results/out.json
- Intended checkpoint path: N/A
- Dashboard / tracking URL: {dashboard}

## 7. Execution Events

| Time | Event | Observation | Action |
|---|---|---|---|
| 2026-08-03T12:00:00Z | recorded | {extra_notes or evidence or "record created"} | preserve evidence |

## 8. Key Results

- Metrics: {"accuracy 81.2" if status in TERMINAL_STATUSES else "Pending terminal evidence"}
- Result files: {"results/out.json" if status in TERMINAL_STATUSES else "Pending terminal evidence"}
- Best checkpoint: N/A

## 9. Observations

- Observations: {extra_notes or "same split as baseline"}
- Failure evidence: {extra_notes or "N/A"}
- Validity notes: test fixture

## 10. Conclusion

- Conclusion: {"valid negative result" if decision == "do-not-adopt" else "pending review"}
- Caveats: test fixture

## 11. Decision

- Decision: {decision}

## 12. Next Actions

- Next action: review
"""
    target = target_directory / "record.md"
    target.write_text(record, encoding="utf-8")
    return target


def validate_scenario_result(
    testcase: unittest.TestCase,
    scenario_id: str,
    workspace: Path,
    response_text: str = "",
) -> None:
    """Purpose: validate fresh-agent scenario artifacts; Input: testcase, scenario ID, workspace, and optional response; Output: none; Errors: mismatched evidence, lifecycle, or layout."""
    scenario = SCENARIOS[scenario_id]
    if not scenario.expect_records:
        assert_no_records_exist(testcase, workspace)
        if response_text:
            assert_contains_all(testcase, response_text, scenario.required_text)
        return

    record_text = assert_records_exist(testcase, workspace, scenario.min_run_records)
    combined_text = f"{response_text}\n\n{record_text}"
    assert_contains_all(testcase, combined_text, scenario.required_text)

    records = run_record_paths(workspace)
    primary_record = next(
        (
            record
            for record in records
            if scenario.required_text[0] in record.read_text(encoding="utf-8")
        ),
        records[0],
    )
    attributes = front_matter(primary_record.read_text(encoding="utf-8"))
    if scenario.expected_status:
        testcase.assertEqual(scenario.expected_status, attributes["status"])
    if scenario.expected_decision:
        testcase.assertEqual(scenario.expected_decision, attributes["decision"])
    if scenario.require_unknown:
        testcase.assertIn("Unknown", record_text)
    if scenario.require_dashboard:
        testcase.assertIn("Dashboard / tracking URL", record_text)
        testcase.assertIn("wandb.ai", combined_text)
    if scenario.expect_not_launched:
        assert_not_launched(testcase, workspace, attributes)
    for pattern in scenario.required_regex:
        testcase.assertRegex(record_text, pattern)


class RecordExperimentSkillStaticTests(unittest.TestCase):
    def test_frontmatter_description_names_large_experiment_triggers(self) -> None:
        english_text = SKILL_MD.read_text(encoding="utf-8")
        chinese_text = SKILL_ZH.read_text(encoding="utf-8")
        self.assertRegex(english_text, r'(?m)^description: ".+"$')
        self.assertRegex(chinese_text, r'(?m)^description: ".+"$')
        english = skill_description(SKILL_MD).lower()
        chinese = skill_description(SKILL_ZH).lower()

        for term in (
            "formal",
            "costly",
            "retained-evidence",
            "baseline",
            "release",
            "benchmark",
            "eval",
            "full training",
            "gpu",
            "remote job",
            "checkpoints",
            "predictions",
            "results",
            "existing run",
        ):
            self.assertIn(term, english)
        for term in (
            "正式",
            "昂贵",
            "保留证据",
            "baseline",
            "release",
            "benchmark",
            "eval",
            "完整训练",
            "gpu",
            "远程 job",
            "checkpoints",
            "predictions",
            "results",
            "已有 run",
        ):
            self.assertIn(term, chinese)
        for term in ("exploration", "backfill", "monitoring", "open tensorboard", "latest loss"):
            self.assertNotIn(term, english)

    def test_skill_defaults_small_experiments_to_no_record_without_backfill(self) -> None:
        english = SKILL_MD.read_text(encoding="utf-8")
        chinese = SKILL_ZH.read_text(encoding="utf-8")

        for term in (
            "Full record",
            "Append event",
            "No record",
            "Formal prelaunch record",
            "Default to No record",
            "small experiment",
            "Do not ask",
            "production data",
            "irreversible",
            "significant cost",
            "runs/<run-id>/record.md",
            "docs check",
            "docs sync",
        ):
            self.assertIn(term, english)
        for term in (
            "完整记录",
            "追加事件",
            "不记录",
            "正式事前记录",
            "默认不记录",
            "小实验",
            "不询问",
            "生产数据",
            "不可逆",
            "显著费用",
            "runs/<run-id>/record.md",
            "docs check",
            "docs sync",
        ):
            self.assertIn(term, chinese)
        for text in (english, chinese):
            self.assertNotIn("Qualified exploration backfill", text)
            self.assertNotIn("探索限时补录", text)
            self.assertNotIn("session close", text)
            self.assertNotIn("关闭会话", text)

    def test_recorded_runs_retain_raw_process_evidence(self) -> None:
        english = SKILL_MD.read_text(encoding="utf-8")
        chinese = SKILL_ZH.read_text(encoding="utf-8")
        templates = (
            RUN_TEMPLATE.read_text(encoding="utf-8"),
            RUN_TEMPLATE_ZH.read_text(encoding="utf-8"),
        )

        for term in ("raw stdout", "raw stderr", "exit code", "stdout.log", "stderr.log"):
            self.assertIn(term, english.lower())
        for term in ("原始 stdout", "原始 stderr", "退出码", "stdout.log", "stderr.log"):
            self.assertIn(term, chinese)
        for term in (
            "Intended stdout path:",
            "Intended stderr path:",
            "Actual stdout path:",
            "Actual stderr path:",
            "Exit code / signal:",
        ):
            self.assertIn(term, templates[0])
        for term in (
            "预期 stdout 路径:",
            "预期 stderr 路径:",
            "实际 stdout 路径:",
            "实际 stderr 路径:",
            "退出码 / signal:",
        ):
            self.assertIn(term, templates[1])

    def test_identity_distinguishes_launch_paths_from_runtime_events(self) -> None:
        english = SKILL_MD.read_text(encoding="utf-8")
        chinese = SKILL_ZH.read_text(encoding="utf-8")

        self.assertIn("intended log/result/checkpoint paths at launch", english)
        self.assertIn("Actual paths discovered during the same Run", english)
        self.assertIn("启动时预期日志/结果/checkpoint 路径", chinese)
        self.assertIn("同一 Run 运行中发现的实际路径", chinese)
        self.assertIn("same identity", english)
        self.assertIn("同一身份", chinese)
        self.assertIn("-2", english)
        self.assertIn("-3", chinese)

    def test_prepared_input_and_small_existing_queries_remain_sparse(self) -> None:
        english = SKILL_MD.read_text(encoding="utf-8")
        chinese = SKILL_ZH.read_text(encoding="utf-8")
        examples = EXAMPLES.read_text(encoding="utf-8")

        self.assertIn("Prepared input, record at launch", FIELD_GUIDE.read_text(encoding="utf-8"))
        self.assertIn("tiny supplemental cache", examples)
        self.assertIn("No record", examples)
        for term in ("tmux liveness checks", "TensorBoard opens", "checkpoint listings"):
            self.assertIn(term.lower(), english.lower())
        self.assertIn("Repeated loss checks", english)
        self.assertIn("反复查 loss", chinese)

    def test_provenance_failures_and_negative_results_remain_visible(self) -> None:
        english = SKILL_MD.read_text(encoding="utf-8")
        chinese = SKILL_ZH.read_text(encoding="utf-8")
        examples = EXAMPLES.read_text(encoding="utf-8")

        for term in ("model or checkpoint", "derived report", "Unknown", "valid negative result"):
            self.assertIn(term, english)
        self.assertIn("recover provenance for those retained inputs", english)
        for term in ("model 或 checkpoint", "派生报告", "Unknown", "有效负结果"):
            self.assertIn(term, chinese)
        self.assertIn("为这些已保留输入恢复 provenance", chinese)
        self.assertIn("CUDA OOM", examples)
        self.assertIn("do-not-adopt", examples)
        self.assertIn("does not create a Worktree automatically", english)
        self.assertIn("不自动创建 Worktree", chinese)

    def test_templates_use_canonical_front_matter_and_localized_sections(self) -> None:
        for template, sections in ((RUN_TEMPLATE, ENGLISH_SECTIONS), (RUN_TEMPLATE_ZH, CHINESE_SECTIONS)):
            text = template.read_text(encoding="utf-8")
            attributes = front_matter(text)
            for field in REQUIRED_FRONT_MATTER:
                self.assertIn(field, attributes)
            self.assertEqual("1", attributes["schema"])
            self.assertEqual("record", attributes["kind"])
            self.assertEqual("planned", attributes["status"])
            self.assertEqual("null", attributes["started"])
            self.assertEqual("null", attributes["completed"])
            self.assertEqual("pending", attributes["decision"])
            self.assertEqual(sections, tuple(re.findall(r"(?m)^## \d+\. .+$", text)))

    def test_main_skill_files_do_not_embed_pressure_scenarios(self) -> None:
        for path in (SKILL_MD, SKILL_ZH):
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("Discipline checks", text)
            self.assertNotIn("压力场景", text)
            self.assertNotIn("baseline failure", text.lower())


class RecordExperimentScenarioHarnessTests(unittest.TestCase):
    def test_scenarios_cover_expected_cases(self) -> None:
        self.assertEqual(
            {
                "prelaunch_hard_gate",
                "user_urgency_pressure",
                "dashboard_still_needs_local_record",
                "checkpoint_model_inference_prelaunch",
                "derived_report_requires_upstream_record",
                "retroactive_record_unknowns",
                "failed_run_record",
                "negative_result_record",
                "out_of_scope_no_record",
                "field_format_consistency",
            },
            set(SCENARIOS),
        )

    def test_prompts_are_forward_test_prompts(self) -> None:
        for scenario in SCENARIOS.values():
            self.assertIn(str(SKILL_DIR), scenario.prompt)
            self.assertIn("{workspace}", scenario.prompt)
            self.assertNotIn("Review the skill", scenario.prompt)

    def test_valid_artifacts_pass_all_applicable_scenarios(self) -> None:
        for scenario in SCENARIOS.values():
            with self.subTest(scenario=scenario.scenario_id):
                with tempfile.TemporaryDirectory() as temp_dir:
                    workspace = Path(temp_dir)
                    if scenario.expect_records:
                        status = scenario.expected_status or "planned"
                        decision = scenario.expected_decision or "pending"
                        dashboard = (
                            "https://wandb.ai/example/project/runs/abc123"
                            if scenario.require_dashboard
                            else "N/A"
                        )
                        notes = "Unknown CWD, Git commit, and result path" if scenario.require_unknown else ""
                        write_run_record(
                            workspace,
                            run_id=f"20260803-1200-{scenario.scenario_id}",
                            command=scenario.required_text[0] if scenario.required_text else "python eval.py",
                            status=status,
                            decision=decision,
                            dashboard=dashboard,
                            extra_notes=notes,
                            evidence=" ".join(scenario.required_text),
                            input_artifacts="; ".join(
                                term for term in scenario.required_text if term.endswith((".jsonl", ".txt"))
                            )
                            or "N/A",
                            upstream_run_id=(
                                "20260803-1150-upstream-inference"
                                if scenario.min_run_records > 1
                                else "N/A"
                            ),
                            derived_artifacts="; ".join(
                                term for term in scenario.required_text if term.endswith((".html", ".zip", ".json"))
                            )
                            or "N/A",
                        )
                        if scenario.min_run_records > 1:
                            write_run_record(
                                workspace,
                                run_id="20260803-1150-upstream-inference",
                                command="python scripts/infer.py --out outputs/source_predictions.jsonl",
                                status="completed",
                                decision="retain-upstream-evidence",
                                extra_notes="Unknown upstream launch details",
                                evidence="upstream inference record",
                                input_artifacts="source dataset",
                                derived_artifacts="outputs/source_predictions.jsonl",
                            )
                    validate_scenario_result(self, scenario.scenario_id, workspace)

    def test_missing_local_record_fails_dashboard_scenario(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            with self.assertRaises(AssertionError):
                validate_scenario_result(
                    self,
                    "dashboard_still_needs_local_record",
                    Path(temp_dir),
                    response_text="See https://wandb.ai/example/project/runs/abc123",
                )

    def test_secondary_run_document_fails_canonical_record_validation(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            record = write_run_record(
                workspace,
                run_id="20260803-1200-secondary-document",
                command="python eval.py --config configs/baseline.yaml --seed 0",
            )
            (record.parent / "README.md").write_text("duplicate explanation\n", encoding="utf-8")
            with self.assertRaises(AssertionError):
                assert_records_exist(self, workspace)

    def test_failed_run_requires_failed_status(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            write_run_record(
                workspace,
                run_id="20260803-1200-failed-with-wrong-status",
                command="python train.py --config configs/large.yaml --seed 3",
                status="completed",
                decision="adopt",
                extra_notes="CUDA OOM",
            )
            with self.assertRaises(AssertionError):
                validate_scenario_result(self, "failed_run_record", workspace)

    def test_temp_workspace_cleanup_pattern(self) -> None:
        temp_path: Path | None = None
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            write_run_record(
                temp_path,
                run_id="20260803-1200-cleanup",
                command="python eval.py --config configs/baseline.yaml --seed 0",
            )
            self.assertTrue(runs_dir(temp_path).exists())
        self.assertIsNotNone(temp_path)
        self.assertFalse(temp_path.exists(), "Temporary test workspace was not cleaned up")


if __name__ == "__main__":
    unittest.main()
