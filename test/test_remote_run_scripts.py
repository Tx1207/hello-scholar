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

    def test_sync_never_deletes_on_the_server(self) -> None:
        text = (SCRIPTS / "sync.sh").read_text(encoding="utf-8")
        code = [line for line in text.splitlines() if not line.lstrip().startswith("#")]
        self.assertFalse(any("--delete-excluded" in line for line in code))
        self.assertIn("opts=(-az --no-owner --no-group)", text)
        # --delete appears only in the read-only stale preview, which always carries -n.
        for line in code:
            if "--delete" in line:
                self.assertIn(" -n ", line)

    def _sync_project(self, root: Path, server_state: str, stale: str = "", prune: str = "1") -> Path:
        project = root / "project"
        (project / "scripts/remote").mkdir(parents=True)
        for name in ("sync.sh", "delete.sh"):
            shutil.copy(SCRIPTS / name, project / "scripts/remote" / name)
        (project / "scripts/remote/remote.env").write_text(
            'REMOTE_HOST=fake\nREMOTE_DIR=project\nREMOTE_SERVER_DIRS="data tmp"\n'
            'REMOTE_LOCAL_EXCLUDES=".venv node_modules"\nREMOTE_PROTECTED_PATTERNS="*.pt *.safetensors"\n'
            f'REMOTE_PRUNE_CODE={prune}\nREMOTE_CODE_PATTERNS="*.py *.yaml"\n',
            encoding="utf-8",
        )
        (project / "src").mkdir()
        (project / "src/model.py").write_text("x = 1\n", encoding="utf-8")
        # A local weight file must not stop the pattern from reaching rsync unexpanded.
        (project / "local.pt").write_text("placeholder\n", encoding="utf-8")
        bin_dir = root / "bin"
        bin_dir.mkdir()
        (root / "state.txt").write_text(server_state, encoding="utf-8")
        (root / "stale.txt").write_text(stale, encoding="utf-8")
        # The ssh stand-in answers the state query from state.txt, saves the manifest write to
        # manifest.txt, and swallows other input; the rsync stand-in reports stale files on a
        # deletion preview. Both log their calls.
        (bin_dir / "ssh").write_text(
            f'#!/bin/sh\necho "ssh $*" >> "{root}/calls.log"\n'
            f'case "$*" in\n'
            f'  *dir=*"bash -s"*) cat > /dev/null; cat "{root}/state.txt" ;;\n'
            f'  *"cat > "*) cat > "{root}/manifest.txt" ;;\n'
            f'  *) cat > /dev/null ;;\n'
            f'esac\n', encoding="utf-8"
        )
        (bin_dir / "rsync").write_text(
            f'#!/bin/sh\necho "rsync $*" >> "{root}/calls.log"\n'
            f'case "$*" in *--delete*) cat "{root}/stale.txt" ;; esac\n', encoding="utf-8"
        )
        for tool in ("ssh", "rsync"):
            (bin_dir / tool).chmod(0o755)
        return project

    def _sync(self, root: Path, project: Path, *args: str) -> subprocess.CompletedProcess:
        env = dict(os.environ, PATH=f"{root / 'bin'}{os.pathsep}{os.environ['PATH']}")
        return subprocess.run(["bash", "scripts/remote/sync.sh", *args], cwd=project, env=env, capture_output=True, text=True)

    def _rsync_calls(self, root: Path) -> list:
        return [line for line in (root / "calls.log").read_text().splitlines() if line.startswith("rsync")]

    def test_first_sync_into_a_populated_directory_only_previews(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "new\nnonempty\n")
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 3)
            self.assertIn("--confirm-first-sync", result.stderr)
            code_sync = self._rsync_calls(root)[0]
            self.assertIn(" -n ", code_sync)
            self.assertNotIn("--delete", code_sync)
            for pattern in ("--exclude /data", "--exclude .venv/", "--exclude node_modules/", "--exclude *.pt", "--exclude *.safetensors"):
                self.assertIn(pattern, code_sync)
            self.assertNotIn("--exclude local.pt", code_sync)
            self.assertFalse(any("touch" in line for line in (root / "calls.log").read_text().splitlines()))

    def test_confirmed_and_later_syncs_send_without_deleting(self) -> None:
        for state, args in (("new\nnonempty\n", ("--confirm-first-sync",)), ("synced\nnonempty\n", ()), ("new\nempty\n", ())):
            with self.subTest(state=state.split(), args=args), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                project = self._sync_project(root, state)
                result = self._sync(root, project, *args)
                self.assertEqual(result.returncode, 0, result.stderr)
                calls = self._rsync_calls(root)
                self.assertNotIn(" -n ", calls[0])
                self.assertNotIn("--delete", calls[0])
                self.assertIn("--delete", calls[-1])
                self.assertIn(" -n ", calls[-1])

    def test_stale_files_are_reported_and_listed_but_kept(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "synced\nnonempty\n", stale="deleting src/old.py\ndeleting legacy/\n")
            summary = self._sync(root, project)
            self.assertEqual(summary.returncode, 0, summary.stderr)
            self.assertIn("2 path(s) on the server are not in the local tree and were kept", summary.stderr)
            listed = self._sync(root, project, "--list-stale")
            self.assertIn("src/old.py\nlegacy/", listed.stdout)

    def _ssh_calls(self, root: Path) -> list:
        return [line for line in (root / "calls.log").read_text().splitlines() if line.startswith("ssh")]

    STALE = (
        "deleting src/old.py\ndeleting src/server_only.py\ndeleting src/cache.npy\n"
        "deleting outputs/x.py\ndeleting src/legacy/\ndeleting stale_top.py\n"
    )

    def test_sync_removes_only_stale_code_it_pushed_earlier(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "synced\nnonempty\nsrc/old.py\nsrc/model.py\n", stale=self.STALE)
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 0, result.stderr)
            delete_calls = [line for line in self._ssh_calls(root) if "bash -s --" in line]
            self.assertEqual(len(delete_calls), 1)
            self.assertIn("src/old.py", delete_calls[0])
            for kept in ("server_only.py", "cache.npy", "outputs/x.py", "stale_top.py"):
                self.assertNotIn(kept, delete_calls[0])
            self.assertTrue(any("rmdir" in line for line in self._ssh_calls(root)))
            self.assertIn("4 path(s) on the server are not in the local tree and were kept", result.stderr)
            listed = self._sync(root, project, "--list-stale")
            self.assertIn("src/server_only.py", listed.stdout)
            self.assertNotIn("src/old.py\n", listed.stdout.split("(kept):", 1)[-1])

    def test_pruning_can_be_turned_off_and_previewed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "synced\nnonempty\nsrc/old.py\n", stale=self.STALE, prune="0")
            off = self._sync(root, project)
            self.assertEqual(off.returncode, 0, off.stderr)
            self.assertFalse(any("bash -s --" in line for line in self._ssh_calls(root)))
            self.assertIn("6 path(s)", off.stderr)
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "synced\nnonempty\nsrc/old.py\n", stale=self.STALE)
            preview = self._sync(root, project, "--dry-run")
            self.assertEqual(preview.returncode, 0, preview.stderr)
            self.assertIn("would remove stale code src/old.py", preview.stdout)
            ssh = self._ssh_calls(root)
            self.assertFalse(any("bash -s --" in line or "rmdir" in line or "cat > " in line for line in ssh))

    def test_manifest_lists_git_code_files_only(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "new\nempty\n")
            (project / "configs").mkdir()
            (project / "configs/a.yaml").write_text("lr: 1\n", encoding="utf-8")
            (project / "notes.md").write_text("n\n", encoding="utf-8")
            (project / ".gitignore").write_text("ignored.py\n", encoding="utf-8")
            (project / "ignored.py").write_text("x\n", encoding="utf-8")
            subprocess.run(["git", "init", "-q"], cwd=project, check=True)
            result = self._sync(root, project)
            self.assertEqual(result.returncode, 0, result.stderr)
            manifest = (root / "manifest.txt").read_text().splitlines()
            self.assertIn("src/model.py", manifest)
            self.assertIn("configs/a.yaml", manifest)
            self.assertNotIn("notes.md", manifest)
            self.assertNotIn("ignored.py", manifest)
            self.assertNotIn("local.pt", manifest)

    def test_state_query_succeeds_on_a_fresh_server_directory(self) -> None:
        text = (SCRIPTS / "sync.sh").read_text(encoding="utf-8")
        script = text.split("<<'EOF'\n", 1)[1].split("\nEOF\n", 1)[0]
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "fresh"
            result = subprocess.run(["bash", "-c", script], env=dict(os.environ, dir=str(target)), capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.splitlines(), ["new", "empty"])

    def test_dry_run_never_changes_the_server(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._sync_project(root, "synced\nnonempty\n")
            result = self._sync(root, project, "--dry-run")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(all(" -n " in line for line in self._rsync_calls(root)))

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

    def test_run_refuses_direct_deletion_commands(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            project = self._launcher_project(root, git=False)
            for command in (["rm", "-rf", "outputs"], ["mv", "a.pt", "b.pt"], ["sudo", "rm", "x"], ["find", ".", "-name", "*.pt", "-delete"]):
                with self.subTest(command=command):
                    result = self._launch(root, project, *command)
                    self.assertEqual(result.returncode, 2)
                    self.assertIn("delete.sh", result.stderr)
            self.assertFalse((root / "calls.log").exists())

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
