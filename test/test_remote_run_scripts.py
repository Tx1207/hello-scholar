#!/usr/bin/env python3
"""Checks the remote-run script templates: syntax, sync safety, exact job names, and the executor."""

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

    def _git_project(self, root: Path, scripts=("sync.sh",), commit: bool = True) -> Path:
        """Git project whose ssh stand-in runs remote commands locally against root/server."""
        project = root / "project"
        (project / "scripts/remote").mkdir(parents=True)
        for name in scripts:
            shutil.copy(SCRIPTS / name, project / "scripts/remote" / name)
        (project / "scripts/remote/remote.env").write_text(
            f'REMOTE_HOST=fake\nREMOTE_DIR={root / "server"}\nREMOTE_CONDA_ACTIVATE=\nREMOTE_SERVER_DIRS="data tmp"\n'
            'REMOTE_LOCAL_EXCLUDES=".venv"\nREMOTE_PROTECTED_PATTERNS="*.pt *.safetensors"\n', encoding="utf-8"
        )
        (project / "src").mkdir()
        (project / "src/model.py").write_text("x = 1\n", encoding="utf-8")
        (project / "src/old.py").write_text("old\n", encoding="utf-8")
        bin_dir = root / "bin"
        bin_dir.mkdir()
        (bin_dir / "ssh").write_text(
            '#!/bin/sh\nshift\ncmd="$*"\n'
            'case "$cmd" in git-receive-pack*|git-upload-pack*) cmd="git ${cmd#git-}" ;; esac\n'
            'exec bash -c "$cmd"\n', encoding="utf-8"
        )
        (bin_dir / "ssh").chmod(0o755)
        self._git(root, project, "init", "-q")
        if commit:
            self._git(root, project, "add", "-A")
            self._git(root, project, "commit", "-qm", "feat: init")
        return project

    def _sync(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["bash", "scripts/remote/sync.sh", *args], cwd=project, env=self._env(root), capture_output=True, text=True)

    def test_sync_deploys_commits_and_mirrors_deletions_and_renames(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            server = root / "server"
            first = self._sync(root, project)
            self.assertEqual(first.returncode, 0, first.stderr)
            self.assertEqual(first.stdout.strip(), self._git(root, project, "rev-parse", "--short", "HEAD"))
            self.assertEqual((server / "src/model.py").read_text(), "x = 1\n")
            (server / "data").mkdir()
            (server / "data/d.txt").write_text("D\n", encoding="utf-8")
            (server / "w.pt").write_text("REAL\n", encoding="utf-8")
            self._git(root, project, "mv", "src/old.py", "src/new.py")
            self._git(root, project, "commit", "-qm", "refactor: rename old")
            second = self._sync(root, project)
            self.assertEqual(second.returncode, 0, second.stderr)
            self.assertFalse((server / "src/old.py").exists())
            self.assertTrue((server / "src/new.py").exists())
            self.assertEqual((server / "data/d.txt").read_text(), "D\n")
            self.assertEqual((server / "w.pt").read_text(), "REAL\n")

    def test_sync_deploys_uncommitted_work_without_touching_local_git(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            server = root / "server"
            self.assertEqual(self._sync(root, project).returncode, 0)
            (project / "src/model.py").write_text("x = 2\n", encoding="utf-8")
            (project / "src/extra.py").write_text("e\n", encoding="utf-8")
            (project / "local.pt").write_text("FAKE\n", encoding="utf-8")
            (project / ".venv").mkdir()
            (project / ".venv/v.py").write_text("v\n", encoding="utf-8")
            (project / "data").mkdir()
            (project / "data/sample.txt").write_text("s\n", encoding="utf-8")
            status = self._git(root, project, "status", "--porcelain")
            head = self._git(root, project, "rev-parse", "HEAD")
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("working tree on", result.stdout)
            self.assertEqual(self._git(root, project, "status", "--porcelain"), status)
            self.assertEqual(self._git(root, project, "rev-parse", "HEAD"), head)
            self.assertEqual((server / "src/model.py").read_text(), "x = 2\n")
            self.assertTrue((server / "src/extra.py").exists())
            for kept_out in ("local.pt", ".venv", "data"):
                self.assertFalse((server / kept_out).exists(), kept_out)

    def test_sync_refuses_modified_tracked_files_on_the_server(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            self.assertEqual(self._sync(root, project).returncode, 0)
            (root / "server/src/model.py").write_text("edited on server\n", encoding="utf-8")
            (project / "src/model.py").write_text("x = 3\n", encoding="utf-8")
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 4)
            self.assertIn("modified tracked files", result.stderr)
            self.assertEqual((root / "server/src/model.py").read_text(), "edited on server\n")

    def test_sync_accepts_server_edits_and_files_that_match_the_deployment(self) -> None:
        # The server already holds the same edits and new files as the local working tree, for
        # example after the same change was applied there by hand, including non-ASCII file names.
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            server = root / "server"
            self.assertEqual(self._sync(root, project).returncode, 0)
            for base in (project, server):
                (base / "src/model.py").write_text("x = 2\n", encoding="utf-8")
                (base / "实验报告.md").write_text("报告\n", encoding="utf-8")
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("already match", result.stderr)
            self.assertEqual(self._git(root, server, "status", "--porcelain", "--untracked-files=no"), "")
            self.assertEqual((server / "实验报告.md").read_text(encoding="utf-8"), "报告\n")
            # A differing untracked file with a non-ASCII name must still be detected, not overwritten.
            (server / "笔记.md").write_text("服务器版本\n", encoding="utf-8")
            (project / "笔记.md").write_text("本地版本\n", encoding="utf-8")
            differs = self._sync(root, project)
            self.assertEqual(differs.returncode, 5)
            self.assertIn("笔记.md", differs.stderr)
            self.assertEqual((server / "笔记.md").read_text(encoding="utf-8"), "服务器版本\n")

    def test_sync_replaces_identical_untracked_files_and_stops_on_differing_ones(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            server = root / "server"
            self.assertEqual(self._sync(root, project).returncode, 0)
            # Results pulled from the server and committed locally are identical to the server copy.
            for base in (project, server):
                (base / "runs/r1/results").mkdir(parents=True)
                (base / "runs/r1/results/eval.json").write_text('{"dists": 0.081}\n', encoding="utf-8")
            self._git(root, project, "add", "-A")
            self._git(root, project, "commit", "-qm", "exp: add r1 results")
            same = self._sync(root, project)
            self.assertEqual(same.returncode, 0, same.stderr)
            (server / "src/notes.py").write_text("server version\n", encoding="utf-8")
            (project / "src/notes.py").write_text("local version\n", encoding="utf-8")
            differs = self._sync(root, project)
            self.assertEqual(differs.returncode, 5)
            self.assertIn("src/notes.py", differs.stderr)
            self.assertEqual((server / "src/notes.py").read_text(), "server version\n")

    def test_first_deployment_into_existing_directory_previews_then_backs_up(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            server = root / "server"
            (server / "src").mkdir(parents=True)
            (server / "src/model.py").write_text("x = 1\n", encoding="utf-8")
            (server / "src/old.py").write_text("server copy\n", encoding="utf-8")
            (server / "src/server_only.py").write_text("s\n", encoding="utf-8")
            preview = self._sync(root, project)
            self.assertEqual(preview.returncode, 3)
            self.assertIn("src/old.py", preview.stderr)
            self.assertFalse((server / ".git").exists())
            confirmed = self._sync(root, project, "--confirm-first-sync")
            self.assertEqual(confirmed.returncode, 0, confirmed.stderr)
            self.assertEqual((server / "src/old.py").read_text(), "old\n")
            backups = list((server / "tmp/remote-run-backup").glob("*/src/old.py"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), "server copy\n")
            self.assertTrue((server / "src/server_only.py").exists())

    def test_dry_run_changes_nothing_on_the_server(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            self.assertEqual(self._sync(root, project).returncode, 0)
            (project / "src/model.py").write_text("x = 9\n", encoding="utf-8")
            result = self._sync(root, project, "--dry-run")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("would deploy", result.stderr)
            self.assertEqual((root / "server/src/model.py").read_text(), "x = 1\n")

    def test_sync_requires_git(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root)
            shutil.rmtree(project / ".git")
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 2)
            self.assertIn("git init", result.stderr)

    def test_state_query_succeeds_on_a_fresh_server_directory(self) -> None:
        text = (SCRIPTS / "sync.sh").read_text(encoding="utf-8")
        script = text.split("<<'EOF'\n", 1)[1].split("\nEOF\n", 1)[0]
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "fresh"
            result = subprocess.run(["bash", "-c", script], env=dict(os.environ, dir=str(target)), capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.splitlines(), ["empty"])

    def _delete_project(self, root: Path) -> Path:
        """Project whose ssh stand-in runs the remote command locally against root/server."""
        project = root / "project"
        (project / "scripts/remote").mkdir(parents=True)
        shutil.copy(SCRIPTS / "delete.sh", project / "scripts/remote/delete.sh")
        server = root / "server"
        (project / "scripts/remote/remote.env").write_text(
            f'REMOTE_HOST=fake\nREMOTE_DIR={server}\nREMOTE_SERVER_DIRS="data tmp"\n'
            'REMOTE_PROTECTED_PATTERNS="*.pt *.safetensors"\n', encoding="utf-8"
        )
        for rel in ("src/old.py", "legacy/a.py", "outputs/exp1/model.pt", "outputs/exp1/log.txt", "data/d.txt", "w.pt"):
            path = server / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("x\n", encoding="utf-8")
        bin_dir = root / "bin"
        bin_dir.mkdir()
        (bin_dir / "ssh").write_text('#!/bin/sh\nshift\nexec bash -c "$*"\n', encoding="utf-8")
        (bin_dir / "ssh").chmod(0o755)
        return project

    def _delete(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        env = dict(os.environ, PATH=f"{root / 'bin'}{os.pathsep}{os.environ['PATH']}")
        return subprocess.run(["bash", "scripts/remote/delete.sh", *args], cwd=project, env=env, capture_output=True, text=True)

    def test_delete_refuses_protected_paths_and_weights(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._delete_project(root)
            for path in ("data/d.txt", "runs/r1/record.md", "../x", "/etc/hosts", "src/*.py", "w.pt", "outputs/exp1/model.pt"):
                with self.subTest(path=path):
                    result = self._delete(root, project, path)
                    self.assertEqual(result.returncode, 2)
                    self.assertIn("refusing", result.stderr)
            self.assertTrue((root / "server/w.pt").exists())
            self.assertTrue((root / "server/data/d.txt").exists())

    def test_delete_removes_named_files_but_not_directories_holding_weights(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._delete_project(root)
            server = root / "server"
            self.assertEqual(self._delete(root, project, "legacy").returncode, 1)
            self.assertTrue((server / "legacy/a.py").exists())
            misplaced = self._delete(root, project, "./src/old.py", "--recursive")
            self.assertEqual(misplaced.returncode, 2)
            self.assertTrue((server / "src/old.py").exists())
            removed = self._delete(root, project, "./src/old.py")
            self.assertEqual(removed.returncode, 0, removed.stderr)
            self.assertIn("removed src/old.py", removed.stdout)
            self.assertFalse((server / "src/old.py").exists())
            self.assertEqual(self._delete(root, project, "--recursive", "legacy").returncode, 0)
            self.assertFalse((server / "legacy").exists())
            kept = self._delete(root, project, "--recursive", "outputs")
            self.assertEqual(kept.returncode, 1)
            self.assertIn("contains protected file", kept.stderr)
            self.assertTrue((server / "outputs/exp1/model.pt").exists())

    def test_delete_refuses_paths_tracked_by_the_deployment(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root, scripts=("sync.sh", "delete.sh"))
            self.assertEqual(self._sync(root, project).returncode, 0)
            result = subprocess.run(["bash", "scripts/remote/delete.sh", "src/model.py"], cwd=project, env=self._env(root), capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn("tracked by the deployed code", result.stderr)
            self.assertTrue((root / "server/src/model.py").exists())

    def test_tmux_names_are_matched_exactly(self) -> None:
        for name in ("run.sh", "logs.sh", "stop.sh"):
            text = (SCRIPTS / name).read_text(encoding="utf-8")
            with self.subTest(script=name):
                self.assertIn("=$name", text)
                self.assertNotIn('has-session -t "$name"', text)

    def _project(self, root: Path) -> Path:
        project = root / "project"
        (project / "scripts/remote").mkdir(parents=True)
        shutil.copy(SCRIPTS / "_job.sh", project / "scripts/remote/_job.sh")
        (project / "scripts/remote/remote.env").write_text(
            'REMOTE_CONDA_ACTIVATE=\nREMOTE_SERVER_DIRS="data tmp"\n', encoding="utf-8"
        )
        (project / "data").mkdir()
        (project / "data/sample.txt").write_text("DATA\n", encoding="utf-8")
        (project / "code.txt").write_text("v1\n", encoding="utf-8")
        return project

    def _job(self, project: Path, *args: str, run_id: str = "", startup: bool = False) -> subprocess.CompletedProcess:
        env = dict(os.environ, SOURCE_REV="abc1234", RUN_ID=run_id, STARTUP="1" if startup else "0")
        return subprocess.run(
            ["bash", "scripts/remote/_job.sh", *args],
            cwd=project, env=env, capture_output=True, text=True,
        )

    def test_executor_splits_streams_and_records_exit_codes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self._project(Path(tmp))
            ok = self._job(project, "demo", "sh", "-c", "echo out; echo err >&2")
            self.assertEqual(ok.returncode, 0)
            logs = project / "tmp/jobs/demo"
            self.assertEqual((logs / "stdout.log").read_text(), "out\n")
            self.assertEqual((logs / "stderr.log").read_text(), "err\n")
            meta = (logs / "job.log").read_text()
            self.assertIn("[source abc1234]", meta)
            self.assertRegex(meta.splitlines()[-1], r"^\[exit 0 at ")

            failed = self._job(project, "broken", "sh", "-c", "exit 7")
            self.assertEqual(failed.returncode, 7)
            self.assertRegex((project / "tmp/jobs/broken/job.log").read_text(), r"\[exit 7 at ")

    def test_formal_run_logs_to_its_run_and_refuses_a_second_execution(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self._project(Path(tmp))
            first = self._job(project, "r1", "sh", "-c", "echo result", run_id="r1")
            self.assertEqual(first.returncode, 0)
            self.assertEqual((project / "runs/r1/logs/stdout.log").read_text(), "result\n")
            again = self._job(project, "r1", "sh", "-c", "echo again", run_id="r1")
            self.assertEqual(again.returncode, 3)
            self.assertIn("Use --startup for startup checks", again.stderr)
            self.assertIn("derived_from", again.stderr)
            self.assertEqual((project / "runs/r1/logs/stdout.log").read_text(), "result\n")

    def test_startup_checks_repeat_and_precede_the_single_research_execution(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self._project(Path(tmp))
            logs = project / "runs/r2/logs"
            first = self._job(project, "r2", "sh", "-c", "echo import failed >&2; exit 1", run_id="r2", startup=True)
            self.assertEqual(first.returncode, 1)
            second = self._job(project, "r2", "sh", "-c", "echo ok", run_id="r2", startup=True)
            self.assertEqual(second.returncode, 0)
            self.assertEqual((logs / "startup-01.stderr.log").read_text(), "import failed\n")
            self.assertEqual((logs / "startup-02.stdout.log").read_text(), "ok\n")
            self.assertIn("[startup check]", (logs / "startup-01.job.log").read_text())
            self.assertFalse((logs / "job.log").exists())

            formal = self._job(project, "r2", "sh", "-c", "echo trained", run_id="r2")
            self.assertEqual(formal.returncode, 0)
            self.assertIn("[research execution]", (logs / "job.log").read_text())
            self.assertEqual(self._job(project, "r2", "true", run_id="r2").returncode, 3)
            late = self._job(project, "r2", "true", run_id="r2", startup=True)
            self.assertEqual(late.returncode, 3)
            self.assertIn("already started its research execution", late.stderr)
            self.assertFalse((logs / "startup-03.job.log").exists())

    def test_run_requires_a_run_id_for_startup_checks(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self._project(Path(tmp))
            shutil.copy(SCRIPTS / "run.sh", project / "scripts/remote/run.sh")
            result = subprocess.run(
                ["bash", "scripts/remote/run.sh", "--startup", "python", "train.py"],
                cwd=project, capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 2)
            self.assertIn("--startup needs --run", result.stderr)

    def test_jobs_run_in_the_project_directory(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self._project(Path(tmp))
            result = self._job(project, "plain", "sh", "-c", "cat code.txt data/sample.txt; pwd")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse((project / "tmp/jobs/plain/code").exists())
            output = (project / "tmp/jobs/plain/stdout.log").read_text()
            self.assertIn("v1\nDATA\n", output)
            self.assertEqual(Path(output.splitlines()[-1]).resolve(), project.resolve())

    def _launch(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["bash", "scripts/remote/run.sh", *args], cwd=project, env=self._env(root), capture_output=True, text=True)

    def test_run_refuses_direct_deletion_commands(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root, scripts=("run.sh", "sync.sh", "_job.sh"))
            for command in (["rm", "-rf", "outputs"], ["mv", "a.pt", "b.pt"], ["sudo", "rm", "x"], ["find", ".", "-name", "*.pt", "-delete"]):
                with self.subTest(command=command):
                    result = self._launch(root, project, *command)
                    self.assertEqual(result.returncode, 2)
                    self.assertIn("delete.sh", result.stderr)
            self.assertFalse((root / "server").exists())

    def test_research_execution_requires_a_committed_tree_and_logs_the_commit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root, scripts=("run.sh", "sync.sh", "_job.sh"))
            server = root / "server"
            (project / "src/model.py").write_text("x = 2\n", encoding="utf-8")
            dirty = self._launch(root, project, "--run", "r1", "sh", "-c", "echo trained")
            self.assertEqual(dirty.returncode, 2)
            self.assertIn("commit the pending changes", dirty.stderr)
            self.assertFalse(server.exists())

            startup = self._launch(root, project, "--run", "r1", "--startup", "sh", "-c", "echo checked")
            self.assertEqual(startup.returncode, 0, startup.stderr)
            self.assertIn("working tree on", (server / "runs/r1/logs/startup-01.job.log").read_text())

            self._git(root, project, "commit", "-qam", "exp: switch model to x = 2")
            rev = self._git(root, project, "rev-parse", "--short", "HEAD")
            formal = self._launch(root, project, "--run", "r1", "sh", "-c", "echo trained")
            self.assertEqual(formal.returncode, 0, formal.stderr)
            meta = (server / "runs/r1/logs/job.log").read_text()
            self.assertIn(f"[source {rev}]", meta)
            self.assertIn("[research execution]", meta)

    def test_research_execution_requires_a_commit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._git_project(root, scripts=("run.sh", "sync.sh", "_job.sh"), commit=False)
            result = self._launch(root, project, "--run", "r1", "sh", "-c", "true")
            self.assertEqual(result.returncode, 2)
            self.assertIn("needs a committed project", result.stderr)


if __name__ == "__main__":
    unittest.main()
