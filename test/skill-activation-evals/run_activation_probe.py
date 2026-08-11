#!/usr/bin/env python3
"""Run one approved Claude Code Skill-catalog activation probe and retain its evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from typing import Any, Iterable


SCRIPT_ROOT = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_ROOT.parents[1]
IGNORED_TREE_NAMES = {".git", "__pycache__", ".DS_Store", ".hello-scholar-install.json"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_tree(root: Path) -> str:
    digest = hashlib.sha256()
    files = sorted(
        path
        for path in root.rglob("*")
        if path.is_file()
        and not path.is_symlink()
        and not any(part in IGNORED_TREE_NAMES for part in path.relative_to(root).parts)
    )
    for path in files:
        relative = path.relative_to(root).as_posix()
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected JSON object")
    return value


def original_request(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    matches = re.findall(
        r"^## (?:Original User Request|原始用户请求)\s*$\n(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    if len(matches) != 1 or not matches[0].strip():
        raise ValueError(f"{path}: expected one nonempty original request")
    return matches[0].strip()


def require_approved_inputs(scenario_dir: Path) -> tuple[dict[str, Any], str]:
    """Accept only an approved, unchanged probe definition and catalog snapshot."""

    protocol_path = scenario_dir / "protocol.json"
    scenario_path = scenario_dir / "scenario.md"
    fixture_path = scenario_dir / "fixture"
    approval = load_json(scenario_dir / "proposal-approval.json")
    if approval["decision"] != "approved":
        raise RuntimeError("activation probe requires an approved Proposal")
    protocol = load_json(protocol_path)
    expected = {
        "scenarioSha256": sha256_file(scenario_path),
        "protocolSha256": sha256_file(protocol_path),
        "fixtureSha256": sha256_tree(fixture_path),
        "runnerSha256": sha256_file(SCRIPT_ROOT / "run_activation_probe.py"),
        "catalogSkillSnapshots": {
            skill: sha256_tree(REPO_ROOT / protocol["skillSources"][skill])
            for skill in protocol["catalogSkills"]
        },
    }
    for field, actual in expected.items():
        if approval.get(field) != actual:
            raise RuntimeError(f"approved Proposal is stale: {field}")
    return protocol, original_request(scenario_path)


def assemble_plugin(plugin_dir: Path, protocol: dict[str, Any]) -> dict[str, str]:
    manifest_dir = plugin_dir / ".claude-plugin"
    manifest_dir.mkdir(parents=True)
    (manifest_dir / "plugin.json").write_text(
        json.dumps(
            {
                "name": "hello-scholar-activation-probe",
                "version": "1.0.0",
                "description": "Isolated catalog for hello-scholar activation evaluation",
                "author": {"name": "hello-scholar Eval"},
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    snapshots: dict[str, str] = {}
    for skill_name in protocol["catalogSkills"]:
        source = REPO_ROOT / protocol["skillSources"][skill_name]
        target = plugin_dir / "skills" / skill_name
        shutil.copytree(source, target)
        snapshots[skill_name] = sha256_tree(source)
    return snapshots


def write_probe_settings(
    path: Path,
    protocol: dict[str, Any],
    workspace: Path,
    plugin_dir: Path,
) -> None:
    """Grant only the isolated paths and commands required by one Scenario."""

    absolute_workspace = f"//{workspace.as_posix().lstrip('/')}"
    absolute_plugin = f"//{plugin_dir.as_posix().lstrip('/')}"
    allow = [
        "Skill",
        f"Read({absolute_workspace}/**)",
        f"Read({absolute_plugin}/**)",
        "Bash(ls *)",
        "Bash(find *)",
        "Bash(git *)",
        "Bash(date *)",
        "Bash(mkdir *)",
    ]
    if protocol["scenarioId"] == "record-auto-formal-v1":
        cli = REPO_ROOT / "bin" / "hello-scholar.js"
        allow.extend(
            [
                f"Write({absolute_workspace}/runs/**)",
                f"Edit({absolute_workspace}/runs/**)",
                "Bash(python3 -B -m unittest discover -s tests)",
                "Bash(PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests)",
                "Bash(python3 -B scripts/benchmark_cache.py --dry-run)",
                "Bash(PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/benchmark_cache.py --dry-run)",
                "Bash(python3 scripts/benchmark_cache.py --run-dir runs/*)",
                "Bash(python3 -B scripts/verify_formal_run.py runs/*)",
                f"Bash(node {cli} docs check)",
                f"Bash(node {cli} docs sync)",
            ]
        )
    else:
        allow.extend(
            [
                "Bash(npm test)",
                "Bash(node scripts/check-policy.mjs)",
            ]
        )
    path.write_text(
        json.dumps(
            {
                "permissions": {
                    "allow": allow,
                    "deny": ["Agent", "Workflow", "WebFetch", "WebSearch"],
                }
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def initialize_fixture(source: Path, workspace: Path) -> str:
    shutil.copytree(source, workspace)
    commands = (
        ["git", "init", "-q"],
        ["git", "config", "user.name", "hello-scholar Eval"],
        ["git", "config", "user.email", "eval@hello-scholar.local"],
        ["git", "add", "-A"],
        ["git", "commit", "-q", "-m", "activation probe fixture"],
    )
    for command in commands:
        subprocess.run(command, cwd=workspace, check=True, capture_output=True)
    return subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=workspace,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def nested_values(value: Any) -> Iterable[Any]:
    yield value
    if isinstance(value, dict):
        for nested in value.values():
            yield from nested_values(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from nested_values(nested)


def invoked_record_experiment(events: list[dict[str, Any]]) -> bool:
    for tool_name, tool_input in successful_tool_uses(events):
        if tool_name != "Skill":
            continue
        skill_name = tool_input.get("skill", "")
        if isinstance(skill_name, str) and (
            skill_name == "record-experiment"
            or skill_name.endswith(":record-experiment")
        ):
            return True
    return False


def parse_events(stdout: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    for line_number, line in enumerate(stdout.splitlines(), start=1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError as error:
            raise RuntimeError(f"invalid stream-json event at line {line_number}") from error
        if isinstance(event, dict):
            events.append(event)
    return events


def successful_tool_uses(
    events: list[dict[str, Any]],
) -> list[tuple[str, dict[str, Any]]]:
    """Return tool calls that have a matching non-error result, in call order."""

    calls: list[tuple[str, str, dict[str, Any]]] = []
    outcomes: dict[str, bool] = {}
    for event in events:
        message = event.get("message")
        if not isinstance(message, dict):
            continue
        content = message.get("content")
        if not isinstance(content, list):
            continue
        for item in content:
            if not isinstance(item, dict):
                continue
            if item.get("type") == "tool_use":
                tool_id = item.get("id")
                tool_name = item.get("name")
                tool_input = item.get("input")
                if (
                    isinstance(tool_id, str)
                    and isinstance(tool_name, str)
                    and isinstance(tool_input, dict)
                ):
                    calls.append((tool_id, tool_name, tool_input))
            elif item.get("type") == "tool_result":
                tool_id = item.get("tool_use_id")
                if isinstance(tool_id, str):
                    outcomes[tool_id] = item.get("is_error") is not True
    return [
        (tool_name, tool_input)
        for tool_id, tool_name, tool_input in calls
        if outcomes.get(tool_id) is True
    ]


def retryable_api_failure(events: list[dict[str, Any]]) -> bool:
    """Classify only explicit retryable API termination as inconclusive."""

    retryable_statuses = {408, 409, 425, 429, 500, 502, 503, 504, 524}
    for event in events:
        if event.get("type") != "result" or event.get("terminal_reason") != "api_error":
            continue
        if event.get("api_error_status") in retryable_statuses:
            return True
        result = event.get("result")
        if isinstance(result, str) and '"retryable":true' in re.sub(r"\s+", "", result).lower():
            return True
    return False


def command_pattern_matches(pattern: str, command: str) -> bool:
    expression = re.escape(pattern).replace(re.escape("<run-id>"), r"[A-Za-z0-9._-]+")
    return re.search(expression, command) is not None


def transcript_command_observed(events: list[dict[str, Any]], pattern: str) -> bool:
    return any(
        tool_name == "Bash"
        and isinstance(tool_input.get("command"), str)
        and command_pattern_matches(pattern, tool_input["command"])
        for tool_name, tool_input in successful_tool_uses(events)
    )


def activation_before_command(events: list[dict[str, Any]], command_pattern: str) -> bool:
    activation_index: int | None = None
    command_index: int | None = None
    for index, (tool_name, tool_input) in enumerate(successful_tool_uses(events)):
        if tool_name == "Skill" and activation_index is None:
            skill_name = tool_input.get("skill", "")
            if isinstance(skill_name, str) and (
                skill_name == "record-experiment"
                or skill_name.endswith(":record-experiment")
            ):
                activation_index = index
        if tool_name == "Bash" and command_index is None:
            command = tool_input.get("command", "")
            if isinstance(command, str) and command_pattern_matches(command_pattern, command):
                command_index = index
    return (
        activation_index is not None
        and command_index is not None
        and activation_index < command_index
    )


def verify_workspace(
    protocol: dict[str, Any], workspace: Path
) -> subprocess.CompletedProcess[str]:
    """Run evaluator-owned artifact checks without changing the probe's measured behavior."""

    if protocol["scenarioId"] == "record-auto-formal-v1":
        records = sorted((workspace / "runs").glob("*/record.md"))
        if len(records) != 1 or not (workspace / "runs" / "INDEX.md").is_file():
            return subprocess.CompletedProcess(
                ["formal-workspace-verifier"],
                1,
                "",
                "expected one Run Record and runs/INDEX.md\n",
            )
        run_dir = records[0].parent.relative_to(workspace).as_posix()
        return subprocess.run(
            ["python3", "-B", "scripts/verify_formal_run.py", run_dir],
            cwd=workspace,
            capture_output=True,
            text=True,
        )
    return subprocess.run(
        ["node", "scripts/verify-local-check.mjs"],
        cwd=workspace,
        capture_output=True,
        text=True,
    )


def final_tree(workspace: Path) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for path in sorted(workspace.rglob("*")):
        if not path.is_file() or ".git" in path.relative_to(workspace).parts:
            continue
        entries.append(
            {
                "path": path.relative_to(workspace).as_posix(),
                "sha256": sha256_file(path),
            }
        )
    return entries


def save_result(
    scenario_dir: Path,
    protocol: dict[str, Any],
    completed: subprocess.CompletedProcess[str],
    verification: subprocess.CompletedProcess[str],
    events: list[dict[str, Any]],
    snapshots: dict[str, str],
    base_commit: str,
    workspace: Path,
) -> None:
    evidence_dir = scenario_dir / "evidence"
    evidence_dir.mkdir()
    stdout_path = evidence_dir / "claude-stream.jsonl"
    stderr_path = evidence_dir / "claude-stderr.log"
    verification_stdout_path = evidence_dir / "verification-stdout.log"
    verification_stderr_path = evidence_dir / "verification-stderr.log"
    tree_path = evidence_dir / "final-tree.json"
    status_path = evidence_dir / "git-status.txt"
    stdout_path.write_text(completed.stdout, encoding="utf-8")
    stderr_path.write_text(completed.stderr, encoding="utf-8")
    verification_stdout_path.write_text(verification.stdout, encoding="utf-8")
    verification_stderr_path.write_text(verification.stderr, encoding="utf-8")
    tree_path.write_text(
        json.dumps(final_tree(workspace), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    status_path.write_text(
        subprocess.run(
            ["git", "status", "--porcelain=v1", "--untracked-files=all"],
            cwd=workspace,
            check=True,
            capture_output=True,
            text=True,
        ).stdout,
        encoding="utf-8",
    )
    invoked = invoked_record_experiment(events)
    expected = protocol["activationProbe"]["expected"]
    command_pattern = protocol["activationProbe"].get(
        "mustOccurBeforeCommand", "node scripts/check-policy.mjs"
    )
    command_observed = transcript_command_observed(events, command_pattern)
    ordered = (
        activation_before_command(events, command_pattern)
        if expected == "invoked"
        else None
    )
    passed = (
        completed.returncode == 0
        and verification.returncode == 0
        and invoked == (expected == "invoked")
        and command_observed
        and ordered is not False
    )
    if passed:
        outcome = "pass"
    elif retryable_api_failure(events):
        outcome = "inconclusive-transient"
    else:
        outcome = "fail"
    result = {
        "activationProtocolVersion": protocol["activationProtocolVersion"],
        "scenarioId": protocol["scenarioId"],
        "result": outcome,
        "expected": expected,
        "recordExperimentInvoked": invoked,
        "activationBeforeCommand": ordered,
        "measuredCommand": command_pattern,
        "measuredCommandObserved": command_observed,
        "claudeExitCode": completed.returncode,
        "verificationExitCode": verification.returncode,
        "fixtureBaseCommit": base_commit,
        "skillSnapshots": snapshots,
        "evidence": {
            path.name: sha256_file(path)
            for path in (
                stdout_path,
                stderr_path,
                verification_stdout_path,
                verification_stderr_path,
                tree_path,
                status_path,
            )
        },
    }
    (scenario_dir / "activation-result.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("scenario", choices=("record-auto-formal-v1", "record-auto-small-v1"))
    args = parser.parse_args()
    scenario_dir = SCRIPT_ROOT / args.scenario
    protocol, prompt = require_approved_inputs(scenario_dir)

    with tempfile.TemporaryDirectory(prefix=f"{args.scenario}-") as temp_name:
        temp_root = Path(temp_name)
        workspace = temp_root / "fixture"
        plugin_dir = temp_root / "plugin"
        settings_path = temp_root / "settings.json"
        base_commit = initialize_fixture(scenario_dir / "fixture", workspace)
        snapshots = assemble_plugin(plugin_dir, protocol)
        write_probe_settings(settings_path, protocol, workspace, plugin_dir)
        project_rules = (workspace / "AGENTS.md").read_text(encoding="utf-8")
        main_agent_context = (
            "You are the current main agent responsible for completing the user's task "
            "end to end. You were not dispatched as a subagent or worker. "
            "Use the available Skill catalog according to each Skill's invocation rules. "
            f"The absolute hello-scholar CLI is {REPO_ROOT / 'bin' / 'hello-scholar.js'}; "
            "invoke it with node when project rules require docs check or docs sync. "
            "This fixture provides Python as python3; use python3 rather than python.\n\n"
        )
        command = [
            "claude",
            "-p",
            "--setting-sources",
            "project",
            "--settings",
            str(settings_path),
            "--no-session-persistence",
            "--strict-mcp-config",
            "--add-dir",
            str(workspace),
            "--add-dir",
            str(plugin_dir),
            "--add-dir",
            str(REPO_ROOT),
            "--output-format",
            "stream-json",
            "--verbose",
            "--model",
            "haiku",
            "--permission-mode",
            "auto",
            "--disallowed-tools",
            "Agent,Workflow,WebFetch,WebSearch",
            "--plugin-dir",
            str(plugin_dir),
            "--append-system-prompt",
            main_agent_context + project_rules,
            prompt,
        ]
        process = subprocess.Popen(
            command,
            cwd=workspace,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        stdout, stderr = process.communicate(timeout=900)
        completed = subprocess.CompletedProcess(command, process.returncode, stdout, stderr)
        events = parse_events(stdout)
        verification = verify_workspace(protocol, workspace)
        save_result(
            scenario_dir,
            protocol,
            completed,
            verification,
            events,
            snapshots,
            base_commit,
            workspace,
        )
        return 0 if load_json(scenario_dir / "activation-result.json")["result"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
