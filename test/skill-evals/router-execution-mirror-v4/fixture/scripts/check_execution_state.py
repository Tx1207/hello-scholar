#!/usr/bin/env python3
"""Verify the bounded T004 delivery without advancing persisted Tasks."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "hello-scholar/specs/batch-processing/SPEC-052-batch-limit"


def field(text: str, name: str) -> str:
    match = re.search(rf"^{re.escape(name)}:\s*(.+)$", text, re.MULTILINE)
    if match is None:
        raise AssertionError(f"missing field: {name}")
    return match.group(1).strip()


def main() -> int:
    spec = (BUNDLE / "spec.md").read_text(encoding="utf-8")
    plan = (BUNDLE / "plan.md").read_text(encoding="utf-8")
    tasks = (BUNDLE / "tasks.md").read_text(encoding="utf-8")

    assert field(spec, "id") == "SPEC-052"
    assert field(spec, "status") == "accepted"
    assert field(plan, "status") == "approved"
    assert field(tasks, "approval") == "approved"
    assert field(tasks, "approved_revision") == field(tasks, "revision")
    assert field(tasks, "status") == "in-progress"
    assert len(re.findall(r"^- \[ \] T\d{3}:", tasks, re.MULTILINE)) == 7
    assert "- [x]" not in tasks.lower()

    for task_id in ("T001", "T002", "T003", "T004"):
        evidence = (ROOT / f"evidence/{task_id}-validation.txt").read_text(
            encoding="utf-8"
        )
        assert "Validation: PASS" in evidence
        assert "Completion: PASS" in evidence
    for task_id in ("T005", "T006", "T007"):
        assert not (ROOT / f"evidence/{task_id}-validation.txt").exists()

    print("execution-state-ready: T001-T004 evidenced; T005-T007 pending; tasks unchanged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
