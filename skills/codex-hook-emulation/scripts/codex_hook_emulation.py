#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

BLOCK_PATTERNS = [
    re.compile(r"\brm\s+-rf\s+/$"),
    re.compile(r"\bdd\s+if=/dev/zero\b"),
    re.compile(r"\bmkfs(\.|\s)"),
    re.compile(r":\(\)\s*\{\s*:\|:\s*&\s*\};:"),
]

CONFIRM_PATTERNS = [
    (re.compile(r"\bgit\s+push\b.*\s--force(?!-with-lease)"), "force push rewrites remote history"),
    (re.compile(r"\bgit\s+reset\s+--hard\b"), "git reset --hard discards local changes"),
    (re.compile(r"\bchmod\s+777\b"), "chmod 777 is overly permissive"),
    (re.compile(r"\b(drop|truncate)\b", re.IGNORECASE), "destructive SQL operation"),
    (re.compile(r"\bdelete\s+from\b", re.IGNORECASE), "SQL delete operation"),
]

SENSITIVE_PATH_MARKERS = (
    "/etc/",
    "/usr/bin/",
    "/sbin/",
    "/System/",
    ".env",
    ".pem",
    ".key",
    "credentials.json",
    "settings.json",
)

RESEARCH_MARKERS = (
    ".git",
    "README.md",
    "docs",
    "notes",
    "plan",
    "results",
    "outputs",
    "src",
    "scripts",
)

RESEARCH_PATH_HINTS = (
    "obsidian",
    "zotero",
    "paper",
    "papers",
    "literature",
    "review",
    "experiment",
    "experiments",
    "results",
    "analysis",
    "research",
    "plan",
    "todo",
    "daily",
    "meeting",
    "writing",
    "draft",
    "proposal",
    "rebuttal",
    "claim",
    "method",
    "hello-scholar/project-memory",
)


@dataclass
class StatusSummary:
    branch: str
    ahead: int
    behind: int
    staged: int
    modified: int
    deleted: int
    untracked: int


@dataclass
class ProjectMemoryBinding:
    bound: bool
    repo_root: str
    registry_path: str
    project_id: str | None
    status: str | None
    auto_sync: bool
    vault_root: str | None
    hub_note: str | None
    memory_path: str | None


@dataclass
class ResearchCandidate:
    candidate: bool
    repo_root: str | None
    markers: list[str]


def run(cmd: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(cwd) if cwd else None, text=True, capture_output=True)


def repo_root(cwd: Path) -> Path | None:
    proc = run(["git", "rev-parse", "--show-toplevel"], cwd)
    if proc.returncode != 0:
        return None
    return Path(proc.stdout.strip())


def git_status(cwd: Path) -> StatusSummary | None:
    root = repo_root(cwd)
    if root is None:
        return None

    branch_proc = run(["git", "branch", "--show-current"], root)
    branch = branch_proc.stdout.strip() or "DETACHED"

    ahead = behind = 0
    upstream_proc = run(["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], root)
    if upstream_proc.returncode == 0:
        counts = run(["git", "rev-list", "--left-right", "--count", "HEAD...@{u}"], root)
        if counts.returncode == 0:
            left, right = counts.stdout.strip().split()
            ahead = int(left)
            behind = int(right)

    porcelain = run(["git", "status", "--porcelain"], root)
    staged = modified = deleted = untracked = 0
    if porcelain.returncode == 0:
        for line in porcelain.stdout.splitlines():
            if not line:
                continue
            x = line[0]
            y = line[1]
            if x == "?" and y == "?":
                untracked += 1
                continue
            if x != " ":
                staged += 1
            if y == "M":
                modified += 1
            if y == "D":
                deleted += 1
    return StatusSummary(branch, ahead, behind, staged, modified, deleted, untracked)


def bound_project_memory(root: Path | None) -> dict[str, object]:
    if root is None:
        return asdict(
            ProjectMemoryBinding(
                bound=False,
                repo_root="",
                registry_path="",
                project_id=None,
                status=None,
                auto_sync=False,
                vault_root=None,
                hub_note=None,
                memory_path=None,
            )
        ) | {"reason": "not a git repo"}
    project_memory_root = root / "hello-scholar" / "project-memory"
    registry = project_memory_root / "registry.yaml"
    if registry.exists():
        try:
            data = json.loads(registry.read_text(encoding="utf-8"))
        except Exception:
            data = {}
        projects = data.get("projects", {}) if isinstance(data, dict) else {}
        matched_id: str | None = None
        matched: dict[str, object] | None = None
        root_str = str(root)
        if isinstance(projects, dict):
            for project_id, entry in projects.items():
                if not isinstance(entry, dict):
                    continue
                repo_roots = entry.get("repo_roots", [])
                if isinstance(repo_roots, list) and any(root_str == item or root_str.startswith(f"{item}{os.sep}") for item in repo_roots if isinstance(item, str)):
                    matched_id = str(project_id)
                    matched = entry
                    break
            if matched is None and projects:
                matched_id, matched = next(iter(projects.items()))
        memory_path = None
        if matched_id:
            candidate = project_memory_root / f"{matched_id}.md"
            if candidate.exists():
                memory_path = str(candidate)
        if memory_path is None and project_memory_root.exists():
            md_files = sorted(project_memory_root.glob("*.md"))
            if md_files:
                memory_path = str(md_files[0])
        binding = ProjectMemoryBinding(
            bound=True,
            repo_root=root_str,
            registry_path=str(registry),
            project_id=matched_id,
            status=str(matched.get("status")) if matched and matched.get("status") is not None else None,
            auto_sync=bool(matched.get("auto_sync", False)) if matched else False,
            vault_root=str(matched.get("vault_root")) if matched and matched.get("vault_root") is not None else None,
            hub_note=str(matched.get("hub_note")) if matched and matched.get("hub_note") is not None else None,
            memory_path=memory_path,
        )
        return asdict(binding)
    return asdict(
        ProjectMemoryBinding(
            bound=False,
            repo_root=str(root),
            registry_path=str(registry),
            project_id=None,
            status=None,
            auto_sync=False,
            vault_root=None,
            hub_note=None,
            memory_path=None,
        )
    ) | {"reason": "no hello-scholar/project-memory/registry.yaml"}


def detect_research_project(root: Path | None) -> dict[str, object]:
    if root is None:
        return asdict(ResearchCandidate(candidate=False, repo_root=None, markers=[]))
    hits = [marker for marker in RESEARCH_MARKERS if (root / marker).exists()]
    candidate = len(hits) >= 3 or (".git" in hits and "README.md" in hits and len(hits) >= 2)
    return asdict(ResearchCandidate(candidate=candidate, repo_root=str(root), markers=hits))


def research_related_files(files: Iterable[str]) -> bool:
    lowered = " ".join(str(file).lower() for file in files)
    return any(marker in lowered for marker in RESEARCH_PATH_HINTS)


def minimum_obsidian_maintenance(binding: dict[str, object]) -> list[str]:
    if not binding.get("bound"):
        return []
    memory_path = str(binding.get("memory_path") or "hello-scholar/project-memory/<project_id>.md")
    return [
        "Daily/YYYY-MM-DD.md",
        memory_path,
        "00-Hub.md (only when top-level project status changes)",
    ]


def recent_todo_candidates(root: Path | None, limit: int = 5) -> list[str]:
    if root is None:
        return []
    candidates: list[tuple[float, Path]] = []
    for rel in ("plan", "tasks", "temp"):
        base = root / rel
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if path.is_file() and path.suffix.lower() in {".md", ".txt", ".json", ".yaml", ".yml"}:
                try:
                    candidates.append((path.stat().st_mtime, path))
                except FileNotFoundError:
                    continue
    for pattern in ("TODO*", "todo*"):
        for path in root.glob(pattern):
            if path.is_file():
                candidates.append((path.stat().st_mtime, path))
    candidates.sort(reverse=True)
    return [str(path.relative_to(root)) for _, path in candidates[:limit]]


def classify_command(command: str) -> tuple[str, list[str]]:
    normalized = " ".join(command.split())
    issues: list[str] = []
    for pattern in BLOCK_PATTERNS:
        if pattern.search(normalized):
            issues.append(f"blocked pattern: {pattern.pattern}")
    for marker in SENSITIVE_PATH_MARKERS:
        if marker in normalized:
            issues.append(f"touches sensitive path marker: {marker}")
    if any(issue.startswith("blocked pattern") for issue in issues):
        return "block", issues

    confirmations: list[str] = []
    for pattern, reason in CONFIRM_PATTERNS:
        if pattern.search(normalized):
            confirmations.append(reason)
    if any(issue.startswith("touches sensitive path marker") for issue in issues):
        confirmations.extend(issues)
    if confirmations:
        return "confirm", confirmations
    return "allow", ["no dangerous pattern detected"]


def infer_verifications(files: Iterable[str]) -> list[str]:
    files = list(files)
    suggestions: list[str] = []
    if any(path.endswith(".py") for path in files):
        suggestions.append("Run Python verification (at least targeted tests or a syntax/import smoke test).")
    if any(path.endswith((".js", ".ts", ".tsx", ".jsx")) for path in files):
        suggestions.append("Run JS/TS lint or targeted build/test for touched files.")
    if any(Path(path).name in {"README.md", "README.zh-CN.md", "AGENTS.md"} for path in files):
        suggestions.append("Check cross-doc wording consistency and path correctness.")
    if any("skills/" in path for path in files):
        suggestions.append("Run a skill integrity pass: verify referenced local files and trigger wording.")
    if any("obsidian" in path.lower() or "hello-scholar/project-memory" in path for path in files):
        suggestions.append("Verify Obsidian repo-local memory paths and bound-repo workflow examples.")
    if any(path.endswith((".toml", ".json", ".jsonc", ".yaml", ".yml")) for path in files):
        suggestions.append("Validate config syntax and confirm no unsupported keys remain.")
    if not suggestions:
        suggestions.append("Do a focused manual review; no strong file-type-specific verification was inferred.")
    return suggestions


def changed_files(cwd: Path) -> list[str]:
    root = repo_root(cwd)
    if root is None:
        return []
    proc = run(["git", "diff", "--name-only"], root)
    if proc.returncode != 0:
        return []
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def change_tracker_script() -> Path:
    return Path(__file__).resolve().parents[3] / "scripts" / "change-tracker.mjs"


def run_change_tracker(command_name: str, cwd: Path, extra_args: list[str], as_json: bool) -> int:
    script_path = change_tracker_script()
    if not script_path.exists():
        message = f"change-tracker script is missing: {script_path}"
        if as_json:
            print(json.dumps({"ok": False, "error": message}, ensure_ascii=False, indent=2))
        else:
            print(f"== Codex Change Tracker ==\n- Error: {message}")
        return 1

    node_bin = shutil.which("node") or "node"
    cmd = [node_bin, str(script_path), command_name, "--cwd", str(cwd)]
    if as_json:
        cmd.append("--json")
    cmd.extend(extra_args)
    proc = subprocess.run(cmd, text=True, capture_output=True)
    if proc.stdout:
        print(proc.stdout.rstrip())
    if proc.stderr:
        print(proc.stderr.rstrip(), file=sys.stderr)
    return proc.returncode


def session_start(cwd: Path, as_json: bool) -> int:
    root = repo_root(cwd)
    status = git_status(cwd)
    binding = bound_project_memory(root)
    candidate = detect_research_project(root)
    payload = {
        "cwd": str(cwd),
        "repo_root": str(root) if root else None,
        "git": asdict(status) if status else None,
        "project_memory": binding,
        "research_candidate": candidate,
        "todo_candidates": recent_todo_candidates(root),
    }
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    print("== Codex Session Start ==")
    if root is None:
        print("- Git: not a repository")
    else:
        print(f"- Repo: {root}")
        print(
            f"- Git: branch={status.branch} ahead={status.ahead} behind={status.behind} staged={status.staged} modified={status.modified} deleted={status.deleted} untracked={status.untracked}"
        )
    pm = payload["project_memory"]
    if pm["bound"]:
        print("- Obsidian project memory: bound")
        print(f"  - Project: {pm.get('project_id') or 'unknown'}")
        print(f"  - Status: {pm.get('status') or 'unknown'}")
        print(f"  - Auto-sync: {'on' if pm.get('auto_sync') else 'off'}")
        if pm.get("vault_root"):
            print(f"  - Vault root: {pm['vault_root']}")
        print("  - Suggested follow-up: obsidian-project-memory / obsidian-note / obsidian-review")
    else:
        print(f"- Obsidian project memory: unbound ({pm['reason']})")
        rc = payload["research_candidate"]
        if rc["candidate"]:
            print(f"  - Research repo candidate markers: {', '.join(rc['markers'])}")
            print("  - Suggested follow-up: obsidian-project-bootstrap")
    todos = payload["todo_candidates"]
    if todos:
        print("- Recent TODO candidates:")
        for item in todos:
            print(f"  - {item}")
    else:
        print("- Recent TODO candidates: none found")
    return 0


def preflight(command: str, as_json: bool) -> int:
    decision, reasons = classify_command(command)
    payload = {"command": command, "decision": decision, "reasons": reasons}
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print("== Codex Preflight ==")
        print(f"- Command: {command}")
        print(f"- Decision: {decision}")
        for reason in reasons:
            print(f"  - {reason}")
    return {"allow": 0, "confirm": 3, "block": 2}[decision]


def post_edit(cwd: Path, files: list[str], as_json: bool) -> int:
    files = files or changed_files(cwd)
    binding = bound_project_memory(repo_root(cwd))
    candidate = detect_research_project(repo_root(cwd))
    research_relevant = research_related_files(files)
    payload = {
        "cwd": str(cwd),
        "files": files,
        "verifications": infer_verifications(files),
        "project_memory": binding,
        "research_candidate": candidate,
        "research_relevant": research_relevant,
        "obsidian_maintenance": minimum_obsidian_maintenance(binding) if research_relevant else [],
    }
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    print("== Codex Post-Edit ==")
    if files:
        print("- Touched files:")
        for file in files:
            print(f"  - {file}")
    else:
        print("- Touched files: none detected")
    print("- Recommended verification:")
    for item in payload["verifications"]:
        print(f"  - {item}")
    pm = payload["project_memory"]
    if research_relevant and pm["bound"]:
        print("- Obsidian-aware reminder:")
        print(f"  - Project: {pm.get('project_id') or 'unknown'}")
        print("  - Minimum maintenance after research-state edits:")
        for item in payload["obsidian_maintenance"]:
            print(f"    - {item}")
    elif research_relevant and candidate["candidate"]:
        print("- Obsidian-aware reminder:")
        print(f"  - Research repo candidate markers: {', '.join(candidate['markers'])}")
        print("  - Suggested follow-up: obsidian-project-bootstrap")
    return 0


def session_end(cwd: Path, as_json: bool) -> int:
    root = repo_root(cwd)
    status = git_status(cwd)
    binding = bound_project_memory(root)
    candidate = detect_research_project(root)
    unpushed = 0
    if root and status and status.ahead:
        unpushed = status.ahead
    temp_candidates = recent_todo_candidates(root)
    payload = {
        "cwd": str(cwd),
        "repo_root": str(root) if root else None,
        "git": asdict(status) if status else None,
        "unpushed_commits": unpushed,
        "cleanup_candidates": temp_candidates,
        "project_memory": binding,
        "research_candidate": candidate,
        "obsidian_maintenance": minimum_obsidian_maintenance(binding),
    }
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    print("== Codex Session End ==")
    if status:
        print(
            f"- Git: branch={status.branch} staged={status.staged} modified={status.modified} deleted={status.deleted} untracked={status.untracked} unpushed={unpushed}"
        )
    else:
        print("- Git: not a repository")
    if temp_candidates:
        print("- Cleanup / TODO candidates:")
        for item in temp_candidates:
            print(f"  - {item}")
    else:
        print("- Cleanup / TODO candidates: none found")
    if binding["bound"]:
        print("- Bound Obsidian KB:")
        print(f"  - Project: {binding.get('project_id') or 'unknown'}")
        print("  - Minimum maintenance after research-state turns:")
        for item in payload["obsidian_maintenance"]:
            print(f"    - {item}")
    elif candidate["candidate"]:
        print(f"- Research repo candidate markers: {', '.join(candidate['markers'])}")
        print("- Suggested follow-up: obsidian-project-bootstrap")
    print("- Recommended next step: run the session-wrap-up skill for a human-readable closeout.")
    return 0


def track_intent(cwd: Path, args: argparse.Namespace) -> int:
    extra_args: list[str] = ["--request", args.request]
    if args.title:
        extra_args.extend(["--title", args.title])
    if args.route:
        extra_args.extend(["--route", args.route])
    if args.tier:
        extra_args.extend(["--tier", args.tier])
    if args.change_id:
        extra_args.extend(["--change-id", args.change_id])
    if args.force_new:
        extra_args.append("--force-new")
    for file_path in args.file or []:
        extra_args.extend(["--file", file_path])
    return run_change_tracker("track-intent", cwd, extra_args, args.json)


def track_change(cwd: Path, args: argparse.Namespace) -> int:
    extra_args: list[str] = ["--summary", args.summary]
    if args.change_id:
        extra_args.extend(["--change-id", args.change_id])
    if args.status:
        extra_args.extend(["--status", args.status])
    if args.result:
        extra_args.extend(["--result", args.result])
    if args.next_step:
        extra_args.extend(["--next-step", args.next_step])
    for file_path in args.file or []:
        extra_args.extend(["--file", file_path])
    for item in args.verification or []:
        extra_args.extend(["--verification", item])
    return run_change_tracker("track-change", cwd, extra_args, args.json)


def track_closeout(cwd: Path, args: argparse.Namespace) -> int:
    extra_args: list[str] = []
    if args.change_id:
        extra_args.extend(["--change-id", args.change_id])
    if args.summary:
        extra_args.extend(["--summary", args.summary])
    if args.result:
        extra_args.extend(["--result", args.result])
    if args.next_step:
        extra_args.extend(["--next-step", args.next_step])
    if args.status:
        extra_args.extend(["--status", args.status])
    return run_change_tracker("track-closeout", cwd, extra_args, args.json)


def refresh_index(cwd: Path, as_json: bool) -> int:
    return run_change_tracker("refresh-index", cwd, [], as_json)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Codex hook-emulation helper")
    sub = parser.add_subparsers(dest="command_name", required=True)

    for name in ("session-start", "post-edit", "session-end"):
        p = sub.add_parser(name)
        p.add_argument("--cwd", default=os.getcwd())
        p.add_argument("--json", action="store_true")
        if name == "post-edit":
            p.add_argument("files", nargs="*")

    p = sub.add_parser("preflight")
    p.add_argument("--json", action="store_true")
    p.add_argument("command", help="shell command or high-risk action description to classify")

    p = sub.add_parser("track-intent")
    p.add_argument("--cwd", default=os.getcwd())
    p.add_argument("--json", action="store_true")
    p.add_argument("--title", default="")
    p.add_argument("--route", default="")
    p.add_argument("--tier", default="")
    p.add_argument("--change-id", default="")
    p.add_argument("--force-new", action="store_true")
    p.add_argument("--file", action="append")
    p.add_argument("--request", required=True)

    p = sub.add_parser("track-change")
    p.add_argument("--cwd", default=os.getcwd())
    p.add_argument("--json", action="store_true")
    p.add_argument("--change-id", default="")
    p.add_argument("--status", default="active")
    p.add_argument("--result", default="")
    p.add_argument("--next-step", default="")
    p.add_argument("--file", action="append")
    p.add_argument("--verification", action="append")
    p.add_argument("--summary", required=True)

    p = sub.add_parser("track-closeout")
    p.add_argument("--cwd", default=os.getcwd())
    p.add_argument("--json", action="store_true")
    p.add_argument("--change-id", default="")
    p.add_argument("--summary", default="")
    p.add_argument("--result", default="")
    p.add_argument("--next-step", default="")
    p.add_argument("--status", default="done")

    p = sub.add_parser("refresh-index")
    p.add_argument("--cwd", default=os.getcwd())
    p.add_argument("--json", action="store_true")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    if args.command_name == "session-start":
        return session_start(Path(args.cwd).resolve(), args.json)
    if args.command_name == "preflight":
        return preflight(args.command, args.json)
    if args.command_name == "post-edit":
        return post_edit(Path(args.cwd).resolve(), args.files, args.json)
    if args.command_name == "session-end":
        return session_end(Path(args.cwd).resolve(), args.json)
    if args.command_name == "track-intent":
        return track_intent(Path(args.cwd).resolve(), args)
    if args.command_name == "track-change":
        return track_change(Path(args.cwd).resolve(), args)
    if args.command_name == "track-closeout":
        return track_closeout(Path(args.cwd).resolve(), args)
    if args.command_name == "refresh-index":
        return refresh_index(Path(args.cwd).resolve(), args.json)
    parser.error(f"unknown command: {args.command_name}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
