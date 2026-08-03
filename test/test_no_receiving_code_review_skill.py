"""Regression checks for the retired receiving-code-review Skill."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
RETIRED_DIR = REPO_ROOT / "skills" / "superpowers-skills" / "receiving-code-review"
EXPECTED_RETIRED_FILES = {
    "SKILL.md",
    "SKILL.zh_CN.md",
}
AGENTS_MD = REPO_ROOT / "AGENTS.md"
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


class NoReceivingCodeReviewSkillTests(unittest.TestCase):
    def test_retired_package_and_discovery_name_are_absent(self) -> None:
        self.assertFalse(RETIRED_DIR.exists())
        for relative_path in EXPECTED_RETIRED_FILES:
            self.assertFalse((RETIRED_DIR / relative_path).exists())
        self.assertNotIn("receiving-code-review", discovered_skill_names())

    def test_agents_keeps_fact_checking_validation_and_communication_rules(self) -> None:
        agents = AGENTS_MD.read_text(encoding="utf-8")
        for phrase in (
            "Read local facts first, then generate changes.",
            "Test behavior that can actually break",
            "Say what you did, why you did it, and what remains uncertain.",
        ):
            self.assertIn(phrase, agents)


if __name__ == "__main__":
    unittest.main()
