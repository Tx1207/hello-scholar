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

    def test_sync_never_deletes_server_only_paths_or_run_outputs(self) -> None:
        text = (SCRIPTS / "sync.sh").read_text(encoding="utf-8")
        rsync_lines = [line for line in text.splitlines() if line.strip().startswith("rsync")]
        self.assertEqual(len(rsync_lines), 2)
        for line in rsync_lines:
            self.assertNotIn("--delete-excluded", line)
            self.assertIn("--no-owner --no-group", line)
        code_sync, runs_sync = rsync_lines
        self.assertIn("--delete", code_sync)
        self.assertIn('"${excludes[@]}"', code_sync)
        self.assertNotIn("--delete", runs_sync)
        self.assertIn("--exclude '/runs/'", text)

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

    def _launcher_project(self, root: Path, git: bool) -> Path:
        project = self._project(root)
        for name in ("run.sh", "sync.sh"):
            shutil.copy(SCRIPTS / name, project / "scripts/remote" / name)
        (project / "scripts/remote/remote.env").write_text(
            'REMOTE_HOST=fake\nREMOTE_DIR=project\nREMOTE_SERVER_DIRS="data tmp"\n', encoding="utf-8"
        )
        # Stand-ins for ssh and rsync record their calls instead of reaching a server.
        bin_dir = root / "bin"
        bin_dir.mkdir()
        for tool in ("ssh", "rsync"):
            stub = bin_dir / tool
            stub.write_text(f'#!/bin/sh\necho "{tool} $*" >> "{root}/calls.log"\n', encoding="utf-8")
            stub.chmod(0o755)
        if git:
            env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@t")
            for args in (["init", "-q"], ["add", "-A"], ["commit", "-qm", "init"]):
                subprocess.run(["git", *args], cwd=project, env=env, check=True)
        return project

    def _launch(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        env = dict(os.environ, PATH=f"{root / 'bin'}{os.pathsep}{os.environ['PATH']}")
        return subprocess.run(["bash", "scripts/remote/run.sh", *args], cwd=project, env=env, capture_output=True, text=True)

    def test_research_execution_requires_a_committed_tree(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._launcher_project(root, git=True)
            (project / "code.txt").write_text("v2\n", encoding="utf-8")
            dirty = self._launch(root, project, "--bg", "--run", "r1", "python", "train.py")
            self.assertEqual(dirty.returncode, 2)
            self.assertIn("commit the pending changes", dirty.stderr)
            self.assertFalse((root / "calls.log").exists())

            startup = self._launch(root, project, "--run", "r1", "--startup", "python", "train.py")
            self.assertEqual(startup.returncode, 0, startup.stderr)

            env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@t")
            subprocess.run(["git", "commit", "-qam", "exp: switch code to v2"], cwd=project, env=env, check=True)
            rev = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=project, capture_output=True, text=True).stdout.strip()
            clean = self._launch(root, project, "--bg", "--run", "r1", "python", "train.py")
            self.assertEqual(clean.returncode, 0, clean.stderr)
            launch = (root / "calls.log").read_text().splitlines()[-1]
            self.assertIn(f"SOURCE_REV={rev}\\ ", launch)
            self.assertNotIn("+uncommitted", launch)

    def test_research_execution_requires_git(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._launcher_project(root, git=False)
            result = self._launch(root, project, "--run", "r1", "python", "train.py")
            self.assertEqual(result.returncode, 2)
            self.assertIn("needs the project in Git", result.stderr)


if __name__ == "__main__":
    unittest.main()
