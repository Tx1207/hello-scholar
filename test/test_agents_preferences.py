#!/usr/bin/env python3
"""Forward-test harness and static checks for repository agent preferences.

Run the static and harness self-tests:

    python3 -m unittest discover -s test

The SKILL_WRITTEN_DOC_PROMPT can be sent to a fresh agent to check whether
skill-written user-readable documents follow the repository language preference.
"""

from pathlib import Path
import re
import tempfile
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
AGENTS_MD = REPO_ROOT / "AGENTS.md"
AGENTS_ZH = REPO_ROOT / "AGENTS-zh.md"
RECORD_EXPERIMENT_SKILL = REPO_ROOT / "skills" / "hello-scholar" / "record-experiment"
RECORD_EXPERIMENT_ASSETS = RECORD_EXPERIMENT_SKILL / "assets"
RUNS_ROOT = Path("runs")

SKILL_WRITTEN_DOC_PROMPT = f"""请使用 record-experiment skill：{RECORD_EXPERIMENT_SKILL}

把这个临时目录当作当前任务的项目根目录，所有文件都只能写在这里：{{workspace}}
开始前必须先读取并遵循这个仓库的项目指令：{AGENTS_MD}
开始前必须先读取 record-experiment skill 的 `SKILL.md`，并按其中的模板创建记录。
不要启动命令，只创建 planned Run Record。

为下面这个实验创建计划阶段记录：
python eval.py --config configs/baseline.yaml --seed 0 --split test

实验目的：比较 test split 上的 baseline retrieval accuracy。
预期信号：生成 metrics JSON 文件。
失败信号：crash、缺失 metrics 文件或空结果文件。
"""


def runs_dir(workspace: Path) -> Path:
    """Purpose: resolve the canonical root Run directory; Input: temporary project root; Output: root runs path."""
    return workspace / RUNS_ROOT


def run_record_paths(workspace: Path) -> list[Path]:
    """Purpose: locate canonical Run Records; Input: temporary project root; Output: sorted direct record paths."""
    root = runs_dir(workspace)
    if not root.exists():
        return []
    return sorted(path for path in root.glob("*/record.md") if path.is_file())


def read_all_run_records(workspace: Path) -> str:
    """Purpose: combine canonical Record text; Input: temporary project root; Output: joined Record content."""
    return "\n\n".join(path.read_text(encoding="utf-8") for path in run_record_paths(workspace))


def count_chinese_user_readable_values(text: str) -> int:
    """Purpose: count Chinese prose in Record fields; Input: Record text; Output: number of populated Chinese values."""
    user_readable_labels = (
        "目的",
        "假设",
        "变量",
        "控制条件",
        "观察",
        "结论",
        "决定",
        "后续行动",
    )
    count = 0
    for label in user_readable_labels:
        pattern = rf"(?m)^-\s+{re.escape(label)}\s*:\s*.*[一-鿿]"
        if re.search(pattern, text):
            count += 1
    return count


def validate_skill_written_language_result(testcase: unittest.TestCase, workspace: Path) -> None:
    """Purpose: validate a Chinese root Record; Input: testcase and temporary project root; Output: none; Errors: missing canonical path, technical command, or Chinese prose."""
    records = run_record_paths(workspace)
    testcase.assertGreaterEqual(len(records), 1, "Expected at least one Run Record")
    for path in records:
        relative = path.relative_to(workspace)
        testcase.assertEqual(("runs", relative.parts[1], "record.md"), relative.parts)

    record_text = read_all_run_records(workspace)
    for field in (
        "schema: 1",
        "kind: record",
        "status: planned",
        "spec: null",
        "spec_revision: null",
        "plan_revision: null",
        "started: null",
        "completed: null",
        "decision: pending",
        "## 5. 执行信息",
        "## 12. 后续行动",
        "- 精确命令:",
    ):
        testcase.assertIn(field, record_text)

    testcase.assertIn("python eval.py --config configs/baseline.yaml --seed 0 --split test", record_text)
    testcase.assertGreaterEqual(
        count_chinese_user_readable_values(record_text),
        2,
        "Expected Chinese prose in user-readable skill-written fields",
    )


def chinese_record(run_id: str, command: str) -> str:
    """Purpose: build a canonical Chinese planned Record fixture; Input: Run ID and command; Output: Markdown Record content."""
    return f"""---
schema: 1
kind: record
run_id: {run_id}
title: 基线检索评估
status: planned
spec: null
spec_revision: null
plan_revision: null
started: null
completed: null
decision: pending
summary: 将在启动前比较 test split 上的 baseline retrieval accuracy。
---
# 基线检索评估

## 1. 目的

- 目的: 比较 test split 上的 baseline retrieval accuracy。

## 2. 假设

- 假设: baseline 会生成可用的 metrics JSON 文件。

## 3. 实验变量

- 变量: seed 0 和 test split。

## 4. 控制条件

- 控制条件: 保持配置和数据划分不变。

## 5. 执行信息

- 精确命令: {command}
- 工作目录: /tmp/project
- 预期信号: 生成 metrics JSON 文件。
- 失败信号: crash、缺失 metrics 文件或空结果文件。
- 停止规则: 结果文件写入后停止。

## 6. 产物位置

- 预期日志路径: logs/baseline-eval-s0.log
- 预期结果路径: results/baseline-eval-s0.json

## 7. 执行事件

| 时间 | 事件 | 观察 | 处理 |
|---|---|---|---|

## 8. 关键结果

- 指标: 尚未启动。

## 9. 观察

- 观察: 当前记录只包含启动前已知事实。

## 10. 结论

- 结论: 等待运行结果。

## 11. 决定

- 决定: 在记录完整后启动。

## 12. 后续行动

- 后续行动: 启动前再次确认路径和命令。
"""


def english_record(run_id: str, command: str) -> str:
    """Purpose: build an English-only canonical planned Record fixture; Input: Run ID and command; Output: Markdown Record content."""
    return f"""---
schema: 1
kind: record
run_id: {run_id}
title: Baseline retrieval evaluation
status: planned
spec: null
spec_revision: null
plan_revision: null
started: null
completed: null
decision: pending
summary: Compare baseline retrieval accuracy before the command starts.
---
# Baseline retrieval evaluation

## 1. Purpose

- Purpose: Compare baseline retrieval accuracy on the test split.

## 2. Hypothesis

- Hypothesis: The baseline creates a metrics JSON file.

## 3. Experimental Variables

- Variables: Seed 0 and the test split.

## 4. Controls

- Controls: Keep the configuration and data split unchanged.

## 5. Execution Information

- Exact command: {command}
- CWD: /tmp/project
- Expected signal: A metrics JSON file appears.
- Failure signal: Crash, a missing metrics file, or an empty result file.
- Stop rule: Stop after the result file is written.

## 6. Artifact Locations

- Intended log path: logs/baseline-eval-s0.log
- Intended result path: results/baseline-eval-s0.json

## 7. Execution Events

| Time | Event | Observation | Action |
|---|---|---|---|

## 8. Key Results

- Metrics: The command has not started.

## 9. Observations

- Observations: This Record contains only current prelaunch facts.

## 10. Conclusion

- Conclusion: Pending execution.

## 11. Decision

- Decision: Launch only after the Record is complete.

## 12. Next Actions

- Next action: Confirm the command and paths before launch.
"""


class AgentPreferenceTests(unittest.TestCase):
    def test_language_preferences_are_synced_for_skill_written_docs(self) -> None:
        english = AGENTS_MD.read_text(encoding="utf-8")
        chinese = AGENTS_ZH.read_text(encoding="utf-8")

        self.assertIn("user-readable documents written by skills", english)
        self.assertIn("code symbols", english)
        self.assertIn("field names", english)
        self.assertIn("enum values", english)
        self.assertIn("paths", english)
        self.assertIn("commands", english)
        self.assertIn("template-required headings", english)
        self.assertIn("choose language according to context and user requirements", english)
        self.assertIn("use Chinese as the default language", english)

        self.assertIn("Skill 写入的用户可读文档", chinese)
        self.assertIn("代码符号", chinese)
        self.assertIn("字段名", chinese)
        self.assertIn("枚举值", chinese)
        self.assertIn("路径", chinese)
        self.assertIn("命令", chinese)
        self.assertIn("模板要求的标题", chinese)
        self.assertIn("根据上下文和用户需求确定语言", chinese)
        self.assertIn("默认语言：中文", chinese)

    def test_record_experiment_skill_repeats_project_language_preference(self) -> None:
        english = (RECORD_EXPERIMENT_SKILL / "SKILL.md").read_text(encoding="utf-8")
        chinese = (RECORD_EXPERIMENT_SKILL / "SKILL.zh_CN.md").read_text(encoding="utf-8")

        self.assertIn("repository language preference", english)
        self.assertIn("assets/run-record-template.zh_CN.md", english)
        self.assertIn("user-readable", english)
        self.assertIn("do not infer", english.lower())

        self.assertIn("仓库语言偏好", chinese)
        self.assertIn("assets/run-record-template.zh_CN.md", chinese)
        self.assertIn("用户可读", chinese)
        self.assertIn("不要根据任务提示语言推断", chinese)

        chinese_run = (RECORD_EXPERIMENT_ASSETS / "run-record-template.zh_CN.md").read_text(encoding="utf-8")
        self.assertIn("schema: 1", chinese_run)
        self.assertIn("kind: record", chinese_run)
        self.assertIn("## 5. 执行信息", chinese_run)
        self.assertIn("- 精确命令:", chinese_run)
        self.assertIn("## 12. 后续行动", chinese_run)
        self.assertFalse((RECORD_EXPERIMENT_ASSETS / "index-template.md").exists())
        self.assertFalse((RECORD_EXPERIMENT_ASSETS / "index-template.zh_CN.md").exists())

    def test_skill_written_doc_forward_test_prompt_targets_language_preference(self) -> None:
        self.assertIn(str(RECORD_EXPERIMENT_SKILL), SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("{workspace}", SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn(str(AGENTS_MD), SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("必须先读取并遵循", SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("必须先读取 record-experiment skill", SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("不要启动命令", SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("planned Run Record", SKILL_WRITTEN_DOC_PROMPT)
        self.assertIn("python eval.py --config configs/baseline.yaml --seed 0 --split test", SKILL_WRITTEN_DOC_PROMPT)

    def test_chinese_skill_written_record_passes_language_validator(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            run_id = "20260803-1200-baseline-eval-s0"
            record_path = runs_dir(workspace) / run_id / "record.md"
            record_path.parent.mkdir(parents=True)
            record_path.write_text(
                chinese_record(
                    run_id,
                    "python eval.py --config configs/baseline.yaml --seed 0 --split test",
                ),
                encoding="utf-8",
            )

            validate_skill_written_language_result(self, workspace)

    def test_english_only_skill_written_record_fails_language_validator(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            run_id = "20260803-1200-baseline-eval-s0"
            record_path = runs_dir(workspace) / run_id / "record.md"
            record_path.parent.mkdir(parents=True)
            record_path.write_text(
                english_record(
                    run_id,
                    "python eval.py --config configs/baseline.yaml --seed 0 --split test",
                ),
                encoding="utf-8",
            )

            with self.assertRaises(AssertionError):
                validate_skill_written_language_result(self, workspace)


if __name__ == "__main__":
    unittest.main()
