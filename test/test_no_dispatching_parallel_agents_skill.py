"""Regression checks for the retired dispatching-parallel-agents Skill."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
RETIRED_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "dispatching-parallel-agents"
EXPECTED_RETIRED_FILES = {
    "SKILL.md",
    "SKILL.zh_CN.md",
}
EVAL_WORKFLOW = REPO_ROOT / "test" / "skill-evals" / "WORKFLOW.md"
DISCOVERY_SCRIPT = """
const path = require('node:path');
const { discoverSkills } = require(path.join(process.argv[1], 'src', 'skill-discovery.js'));
process.stdout.write(JSON.stringify(discoverSkills(process.argv[1]).map((skill) => skill.name)));
"""


def discovered_skill_names() -> set[str]:
    """Purpose: load source Skill names through repository discovery; Input: repository root; Output: discovered Skill identities; Errors: node discovery failure."""
    result = subprocess.run(
        ["node", "-e", DISCOVERY_SCRIPT, str(REPO_ROOT)],
        check=True,
        capture_output=True,
        text=True,
    )
    return set(json.loads(result.stdout))


class NoDispatchingParallelAgentsSkillTests(unittest.TestCase):
    def test_retired_package_and_discovery_name_are_absent(self) -> None:
        self.assertFalse(RETIRED_DIR.exists())
        for relative_path in EXPECTED_RETIRED_FILES:
            self.assertFalse((RETIRED_DIR / relative_path).exists())
        self.assertNotIn("dispatching-parallel-agents", discovered_skill_names())

    def test_eval_workflow_keeps_isolated_agent_roles(self) -> None:
        workflow = EVAL_WORKFLOW.read_text(encoding="utf-8")
        for phrase in (
            "全新 Implementer subagent",
            "独立 Reviewer subagent",
            "当前用户授权最多三个正式 Eval Agent 并行",
            "两个角色的 Agent ID 必须不同",
        ):
            self.assertIn(phrase, workflow)


if __name__ == "__main__":
    unittest.main()
