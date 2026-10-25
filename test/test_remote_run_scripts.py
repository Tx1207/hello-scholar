#!/usr/bin/env python3
"""Checks the remote-run sync script: syntax, first-time setup, and fast-forward-only push and pull."""

from pathlib import Path
import os
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skills/remote-run/assets/scripts/remote"


class RemoteRunScriptTests(unittest.TestCase):
    def test_every_script_parses_and_is_executable(self) -> None:
        for path in sorted(SCRIPTS.glob("*.sh")):
            with self.subTest(script=path.name):
                result = subprocess.run(["bash", "-n", str(path)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(os.access(path, os.X_OK))

    GIT_ENV = {"GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@t", "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@t"}

    def _env(self, root: Path) -> dict:
        # GIT_SSH_VARIANT=simple makes git call the ssh stand-in as "ssh <host> <command>".
        return dict(os.environ, PATH=f"{root / 'bin'}{os.pathsep}{os.environ['PATH']}", GIT_SSH_VARIANT="simple", **self.GIT_ENV)

    def _git(self, root: Path, cwd: Path, *args: str) -> str:
        return subprocess.run(["git", *args], cwd=cwd, env=self._env(root), check=True, capture_output=True, text=True).stdout.strip()

    def _project(self, root: Path) -> Path:
        """Committed local project whose ssh stand-in runs remote commands locally against root/server."""
        project = root / "project"
        (project / "scripts/remote").mkdir(parents=True)
        shutil.copy(SCRIPTS / "sync.sh", project / "scripts/remote/sync.sh")
        (project / "scripts/remote/remote.env").write_text(f"REMOTE_HOST=fake\nREMOTE_DIR={root / 'server'}\n", encoding="utf-8")
        (project / "src").mkdir()
        (project / "src/model.py").write_text("x = 1\n", encoding="utf-8")
        (project / ".gitignore").write_text("/data/\n", encoding="utf-8")
        bin_dir = root / "bin"
        bin_dir.mkdir()
        (bin_dir / "ssh").write_text(
            '#!/bin/sh\nshift\ncmd="$*"\n'
            'case "$cmd" in git-receive-pack*|git-upload-pack*) cmd="git ${cmd#git-}" ;; esac\n'
            'exec bash -c "$cmd"\n', encoding="utf-8"
        )
        (bin_dir / "ssh").chmod(0o755)
        self._git(root, project, "init", "-q", "-b", "main")
        self._git(root, project, "add", "-A")
        self._git(root, project, "commit", "-qm", "feat: init")
        return project

    def _sync(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["bash", "scripts/remote/sync.sh", *args], cwd=project, env=self._env(root), capture_output=True, text=True)

    def _ready(self, root: Path) -> tuple:
        project = self._project(root)
        result = self._sync(root, project, "init")
        self.assertEqual(result.returncode, 0, result.stderr)
        return project, root / "server"

    def _commit(self, root: Path, cwd: Path, path: str, text: str, message: str) -> None:
        (cwd / path).write_text(text, encoding="utf-8")
        self._git(root, cwd, "add", path)
        self._git(root, cwd, "commit", "-qm", message)

    def test_init_creates_a_work_tree_on_the_local_branch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self.assertEqual((server / "src/model.py").read_text(), "x = 1\n")
            self.assertEqual(self._git(root, server, "symbolic-ref", "--short", "HEAD"), "main")
            self.assertEqual(self._git(root, server, "rev-parse", "HEAD"), self._git(root, project, "rev-parse", "HEAD"))
            self.assertEqual(self._git(root, server, "branch", "--list", "remote-run-incoming"), "")
            again = self._sync(root, project, "init")
            self.assertEqual(again.returncode, 0, again.stderr)
            self.assertIn("already", again.stdout)

    def test_init_on_an_existing_directory_keeps_differing_server_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._project(root)
            server = root / "server"
            (server / "src").mkdir(parents=True)
            (server / "src/model.py").write_text("x = 2  # server edit\n", encoding="utf-8")
            (server / "data").mkdir()
            (server / "data/d.bin").write_text("DATA\n", encoding="utf-8")
            (server / "notes.txt").write_text("server only\n", encoding="utf-8")
            result = self._sync(root, project, "init")
            self.assertEqual(result.returncode, 4)
            self.assertIn("src/model.py", result.stderr)
            self.assertIn("notes.txt", result.stderr)
            self.assertEqual((server / "src/model.py").read_text(), "x = 2  # server edit\n")
            self.assertEqual((server / "data/d.bin").read_text(), "DATA\n")
            self.assertTrue((server / "scripts/remote/sync.sh").exists(), "files missing on the server are restored")
            self.assertEqual(self._git(root, server, "rev-parse", "HEAD"), self._git(root, project, "rev-parse", "HEAD"))

    def test_init_refuses_a_server_branch_with_commits_the_local_copy_lacks(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, server, "src/model.py", "x = 3\n", "fix: server")
            self._git(root, server, "checkout", "-q", "--detach")
            result = self._sync(root, project, "init")
            self.assertEqual(result.returncode, 5)
            self.assertEqual(self._git(root, server, "log", "-1", "--format=%s", "main"), "fix: server")

    def test_push_fast_forwards_the_server(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, project, "src/model.py", "x = 4\n", "feat: local")
            result = self._sync(root, project, "push")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual((server / "src/model.py").read_text(), "x = 4\n")
            self.assertEqual(self._git(root, server, "status", "--porcelain"), "")
            self.assertEqual(self._git(root, server, "branch", "--list", "remote-run-incoming"), "")

    def test_push_needs_committed_local_changes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            (project / "src/model.py").write_text("x = 5\n", encoding="utf-8")
            result = self._sync(root, project, "push")
            self.assertEqual(result.returncode, 2)
            self.assertEqual((server / "src/model.py").read_text(), "x = 1\n")

    def test_push_stops_on_uncommitted_server_changes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            (server / "src/model.py").write_text("x = 6  # codex is editing\n", encoding="utf-8")
            self._commit(root, project, ".gitignore", "/data/\n/outputs/\n", "chore: ignore outputs")
            result = self._sync(root, project, "push")
            self.assertEqual(result.returncode, 4)
            self.assertIn("src/model.py", result.stderr)
            self.assertEqual((server / "src/model.py").read_text(), "x = 6  # codex is editing\n")
            self.assertEqual((server / ".gitignore").read_text(), "/data/\n")

    def test_push_stops_when_the_server_has_new_commits(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, server, "src/model.py", "x = 7\n", "fix: server")
            self._commit(root, project, ".gitignore", "/data/\n/outputs/\n", "chore: ignore outputs")
            result = self._sync(root, project, "push")
            self.assertEqual(result.returncode, 5)
            self.assertIn("pull", result.stderr)
            self.assertEqual(self._git(root, server, "log", "-1", "--format=%s"), "fix: server")

    def test_push_stops_on_a_branch_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._git(root, server, "checkout", "-q", "-b", "other")
            result = self._sync(root, project, "push")
            self.assertEqual(result.returncode, 3)

    def test_pull_fast_forwards_the_local_branch_and_lists_untracked_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, server, "src/model.py", "x = 8\n", "fix: server")
            (server / "data").mkdir()
            (server / "data/d.bin").write_text("DATA\n", encoding="utf-8")
            (server / "scratch.py").write_text("print(1)\n", encoding="utf-8")
            result = self._sync(root, project, "pull")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual((project / "src/model.py").read_text(), "x = 8\n")
            self.assertIn("fix: server", result.stdout)
            self.assertIn("scratch.py", result.stderr)
            self.assertNotIn("d.bin", result.stderr)
            self.assertNotIn("?? data", result.stderr)
            self.assertFalse((project / "scratch.py").exists())

    def test_pull_stops_on_uncommitted_server_changes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            (server / "src/model.py").write_text("x = 9\n", encoding="utf-8")
            result = self._sync(root, project, "pull")
            self.assertEqual(result.returncode, 4)
            self.assertEqual((project / "src/model.py").read_text(), "x = 1\n")

    def test_pull_stops_when_both_sides_have_new_commits(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, server, "src/model.py", "x = 10\n", "fix: server")
            self._commit(root, project, ".gitignore", "/data/\n/outputs/\n", "chore: ignore outputs")
            before = self._git(root, project, "rev-parse", "HEAD")
            result = self._sync(root, project, "pull")
            self.assertEqual(result.returncode, 5)
            self.assertIn("git rebase refs/remote-run/server", result.stderr)
            self.assertEqual(self._git(root, project, "rev-parse", "HEAD"), before)
            self._git(root, project, "rebase", "-q", "refs/remote-run/server")
            pushed = self._sync(root, project, "push")
            self.assertEqual(pushed.returncode, 0, pushed.stderr)
            self.assertEqual((server / ".gitignore").read_text(), "/data/\n/outputs/\n")
            self.assertEqual((server / "src/model.py").read_text(), "x = 10\n")

    def test_status_reports_both_sides(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project, server = self._ready(root)
            self._commit(root, server, "src/model.py", "x = 11\n", "fix: server")
            (server / ".gitignore").write_text("/data/\n/tmp/\n", encoding="utf-8")
            result = self._sync(root, project, "status")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("0 local commit(s) not on the server, 1 server commit(s) not local", result.stdout)
            self.assertIn(".gitignore", result.stdout)


if __name__ == "__main__":
    unittest.main()
