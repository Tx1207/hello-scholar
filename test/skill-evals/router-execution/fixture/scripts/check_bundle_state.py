#!/usr/bin/env python3
"""Check that the fixture has one approved, current execution Bundle."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "hello-scholar/specs/cache-eviction/SPEC-004-lru-eviction"


def field(text: str, name: str) -> str:
    match = re.search(rf"^{re.escape(name)}:\s*(.+)$", text, re.MULTILINE)
    if match is None:
        raise AssertionError(f"missing field: {name}")
    return match.group(1).strip()


def main() -> int:
    spec = (BUNDLE / "spec.md").read_text(encoding="utf-8")
    plan = (BUNDLE / "plan.md").read_text(encoding="utf-8")
    tasks = (BUNDLE / "tasks.md").read_text(encoding="utf-8")

    assert field(spec, "id") == "SPEC-004"
    assert field(spec, "status") == "accepted"
    assert field(plan, "status") == "approved"
    assert field(plan, "spec_revision") == field(spec, "revision")
    assert field(tasks, "approval") == "approved"
    assert field(tasks, "approved_revision") == field(tasks, "revision")
    assert field(tasks, "spec_revision") == field(spec, "revision")
    assert field(tasks, "plan_revision") == field(plan, "revision")
    assert len(list(BUNDLE.glob("spec.md"))) == 1
    assert len(list(BUNDLE.glob("plan.md"))) == 1
    assert len(list(BUNDLE.glob("tasks.md"))) == 1
    print("bundle-ready: SPEC-004 revision 1, plan 1, tasks 1 approved")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
