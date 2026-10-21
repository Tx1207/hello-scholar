const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { Readable, Writable } = require("node:stream");
const test = require("node:test");

const { formatSummary, main, parseArgs, usageText } = require("../src/cli");
const { directoryDigest, installSkillCopy, installSkillLink } = require("../src/fs-ops");
const {
  hasInstructionBlock,
  removeInstructionBlock,
  upsertInstructionBlock,
  wrapBlock,
} = require("../src/instruction-blocks");
const {
  InstallConflictError,
  RETIRED_SKILLS,
  inspectInstall,
  install,
  uninstall,
} = require("../src/install");
const { discoverSkills, parseSkillName } = require("../src/skill-discovery");
const { gitignoreBlock } = require("../src/gitignore-block");

const REPO_ROOT = path.resolve(__dirname, "..");
const CURRENT_SKILLS = [
  "docs-maintenance",
  "grilling",
  "handoff",
  "manage-specs",
  "ponytail",
  "record-experiment",
  "review",
  "synthesize",
];
const NEWLY_RETIRED_SKILLS = [
  "converge-to-spec",
  "crash-audit",
  "landing",
  "takeoff",
];

function makeTempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "hello-scholar-cli-"));
}

function listSkillNames() {
  return discoverSkills(REPO_ROOT).map((skill) => skill.name).sort();
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function makeCliIo(inputText = "") {
  let output = "";
  const stdin = Readable.from([inputText]);
  const stdout = new Writable({
    write(chunk, encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });
  return { stdin, stdout, getOutput: () => output };
}

function makeMutatingCliIo(mutate) {
  let output = "";
  let sent = false;
  const stdin = new Readable({
    read() {
      if (!sent) {
        sent = true;
        mutate();
        this.push("yes\n");
        this.push(null);
      }
    },
  });
  const stdout = new Writable({
    write(chunk, encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });
  return { stdin, stdout, getOutput: () => output };
}

function approvalsFor(plan) {
  return plan.conflicts.map((conflict) => ({
    targetPath: conflict.targetPath,
    digest: conflict.digest,
  }));
}

function markerPath(target) {
  return path.join(target, ".hello-scholar-install.json");
}

function writeCopyMarker(target, metadata) {
  fs.writeFileSync(markerPath(target), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

function prepareUpgradeFixture(tempRoot, tool, mode) {
  const repoRoot = path.join(tempRoot, "source");
  const projectRoot = path.join(tempRoot, "project");
  const toolRoot = tool === "codex" ? ".agents" : ".claude";
  const instructionFile = tool === "codex" ? "AGENTS.md" : "CLAUDE.md";
  const skillRoot = path.join(projectRoot, toolRoot, "skills");
  fs.mkdirSync(repoRoot);
  fs.mkdirSync(projectRoot);
  const rules = fs.readFileSync(path.join(REPO_ROOT, "AGENTS.md"), "utf8");
  fs.writeFileSync(path.join(repoRoot, "AGENTS.md"), rules);
  fs.writeFileSync(path.join(projectRoot, instructionFile),
    upsertInstructionBlock("# User rules\nKeep this project content.\n", tool, rules));

  // Produce the previous nine installations with the real ownership-writing primitives.
  const previousNames = [
    "docs-maintenance", "grilling", "handoff", "manage-specs", "record-experiment",
    ...NEWLY_RETIRED_SKILLS,
  ];
  for (const name of previousNames) {
    const sourceDir = path.join(repoRoot, "skills", name);
    const target = path.join(skillRoot, name);
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(path.join(sourceDir, "SKILL.md"), `---\nname: ${name}\n---\nPrevious version.\n`);
    if (mode === "link") {
      installSkillLink(sourceDir, target);
    } else {
      installSkillCopy(sourceDir, target, { source: sourceDir, mode, tool });
    }
  }

  // Upgrade the same source location: old links become dangling, while copy baselines survive.
  for (const name of NEWLY_RETIRED_SKILLS) {
    fs.rmSync(path.join(repoRoot, "skills", name), { recursive: true });
  }
  for (const name of CURRENT_SKILLS) {
    fs.cpSync(path.join(REPO_ROOT, "skills", name), path.join(repoRoot, "skills", name),
      { recursive: true });
  }
  const documents = {
    "hello-scholar/specs/research/SPEC-007-study/spec.md": "# Existing research design\nKeep the comparison criteria.\n",
    "runs/20261012-baseline/record.md": "# Existing Run\nKeep the actual conditions and results.\n",
  };
  for (const [relativePath, text] of Object.entries(documents)) {
    const target = path.join(projectRoot, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  return { repoRoot, projectRoot, skillRoot, documents };
}

function assertProjectDocuments(projectRoot, documents) {
  for (const [relativePath, text] of Object.entries(documents)) {
    assert.equal(fs.readFileSync(path.join(projectRoot, relativePath), "utf8"), text);
  }
}

test("parseArgs accepts only the existing complete-set install commands", () => {
  assert.deepEqual(parseArgs(["help"]), { action: "help" });
  assert.deepEqual(parseArgs(["install", "codex"]), {
    action: "install", tool: "codex", mode: "link",
  });
  assert.deepEqual(parseArgs(["install", "claude", "--mode", "copy"]), {
    action: "install", tool: "claude", mode: "copy",
  });
  assert.deepEqual(parseArgs(["uninstall", "codex"]), { action: "uninstall", tool: "codex" });
  assert.throws(() => parseArgs(["install", "codex", "--with", "handoff"]), /Usage:/);
  assert.throws(() => parseArgs(["install", "gemini"]), /Usage:/);
  assert.throws(() => parseArgs(["install", "codex", "--mode", "bad"]), /Usage:/);
});

test("usage and summary expose the retained command contract", () => {
  const text = usageText();
  assert.match(text, /hello-scholar install codex\|claude \[--mode link\|copy\]/);
  assert.doesNotMatch(text, /--with/);
  assert.equal(
    formatSummary({ action: "install", tool: "codex", installed: 2, updated: 1, removed: 3, skipped: 0 }),
    "install codex: installed 2, updated 1, removed 3, skipped 0"
  );
});

test("instruction blocks insert, replace, remove, and recognize CRLF", () => {
  const userText = "# Project Rules\n\nKeep this.";
  const inserted = upsertInstructionBlock(userText, "codex", "hello rules");
  assert.equal(hasInstructionBlock(inserted, "codex"), true);
  const replaced = upsertInstructionBlock(inserted.replace(/\n/g, "\r\n"), "codex", "new rules");
  assert.match(replaced, /new rules/);
  assert.doesNotMatch(replaced, /hello rules/);
  assert.match(removeInstructionBlock(replaced, "codex"), /# Project Rules/);
});

test("instruction replacement and removal preserve LF and CRLF outside the block", () => {
  const lfBlock = wrapBlock("codex", "owned");
  const lfOutside = "\n\n\nUSER\n";
  assert.equal(
    upsertInstructionBlock(`${lfBlock}${lfOutside}`, "codex", "new"),
    `${wrapBlock("codex", "new")}${lfOutside}`
  );
  assert.equal(removeInstructionBlock(`${lfBlock}${lfOutside}`, "codex"), lfOutside);

  const crlfBlock = lfBlock.replace(/\n/g, "\r\n");
  const crlfPrefix = "HEAD\r\n\r\n";
  const crlfSuffix = "\r\n\r\n\r\nUSER\r\n";
  assert.equal(
    upsertInstructionBlock(`${crlfPrefix}${crlfBlock}${crlfSuffix}`, "codex", "new"),
    `${crlfPrefix}${wrapBlock("codex", "new")}${crlfSuffix}`
  );
  assert.equal(
    removeInstructionBlock(`${crlfPrefix}${crlfBlock}${crlfSuffix}`, "codex"),
    `${crlfPrefix}${crlfSuffix}`
  );
});

test("instruction replacement and removal preserve text beside blocks at file boundaries", () => {
  const oldBlock = wrapBlock("codex", "owned");
  const newBlock = wrapBlock("codex", "new");
  const cases = [
    { current: oldBlock, replaced: newBlock, removed: "" },
    { current: `${oldBlock}TAIL`, replaced: `${newBlock}TAIL`, removed: "TAIL" },
    { current: `HEAD${oldBlock}`, replaced: `HEAD${newBlock}`, removed: "HEAD" },
    { current: `HEAD${oldBlock}TAIL`, replaced: `HEAD${newBlock}TAIL`, removed: "HEADTAIL" },
  ];
  for (const fixture of cases) {
    assert.equal(upsertInstructionBlock(fixture.current, "codex", "new"), fixture.replaced);
    assert.equal(removeInstructionBlock(fixture.current, "codex"), fixture.removed);
  }
});

test("discovery returns exactly the eight independent Skills and no retired name", () => {
  const names = listSkillNames();
  assert.deepEqual(names, CURRENT_SKILLS);
  assert.deepEqual(names.filter((name) => RETIRED_SKILLS.includes(name)), []);
  assert.equal(new Set(names).size, names.length);
});

test("parseSkillName accepts LF and CRLF frontmatter", () => {
  assert.equal(parseSkillName("---\nname: lf-skill\n---\n", "lf/SKILL.md"), "lf-skill");
  assert.equal(parseSkillName("---\r\nname: crlf-skill\r\n---\r\n", "crlf/SKILL.md"), "crlf-skill");
});

test("fresh link install uses root AGENTS.md and installs all current Skills", () => {
  const projectRoot = makeTempProject();
  try {
    fs.writeFileSync(path.join(projectRoot, "AGENTS.md"), "# User Rules\n\nKeep me.\n", "utf8");
    const summary = install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    assert.equal(summary.installed, CURRENT_SKILLS.length);
    assert.equal(summary.removed, 0);

    const agentsText = fs.readFileSync(path.join(projectRoot, "AGENTS.md"), "utf8");
    const portableText = fs.readFileSync(path.join(REPO_ROOT, "AGENTS.md"), "utf8").trimEnd();
    assert.match(agentsText, /HELLO-SCHOLAR:BEGIN codex/);
    assert.ok(agentsText.includes(portableText));
    assert.match(agentsText, /# User Rules/);
    assert.doesNotMatch(agentsText, /npm test|Current repository language: Chinese|hello-scholar Repository Guide/);
    assert.equal(fs.existsSync(path.join(projectRoot, ".agents", ".hello-scholar-install.json")), false);

    for (const name of CURRENT_SKILLS) {
      const target = path.join(projectRoot, ".agents", "skills", name);
      assert.equal(fs.lstatSync(target).isSymbolicLink(), true);
    }
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("fresh copy install records a content baseline for every Skill", () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    assert.equal(fs.existsSync(path.join(projectRoot, ".claude", ".hello-scholar-install.json")), false);
    assert.equal(fs.lstatSync(path.join(projectRoot, "CLAUDE.md")).isSymbolicLink(), false);
    assert.equal(
      fs.readFileSync(path.join(projectRoot, "CLAUDE.md"), "utf8").trim(),
      wrapBlock("claude", fs.readFileSync(path.join(REPO_ROOT, "AGENTS.md"), "utf8"))
    );
    for (const name of CURRENT_SKILLS) {
      const target = path.join(projectRoot, ".claude", "skills", name);
      const marker = JSON.parse(fs.readFileSync(markerPath(target), "utf8"));
      assert.equal(fs.lstatSync(target).isSymbolicLink(), false);
      assert.equal(marker.tool, "claude");
      assert.equal(marker.mode, "copy");
      assert.equal(marker.baselineDigest, directoryDigest(target));
    }
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("both tools use only AGENTS in both modes and upgrade without touching outside bytes", () => {
  const repoRoot = makeTempProject();
  const projectRoot = makeTempProject();
  try {
    fs.mkdirSync(path.join(repoRoot, "skills"));
    fs.writeFileSync(path.join(repoRoot, "CONTRIBUTING.md"), "repository-only sentinel\n");
    for (const [tool, filename, mode] of [
      ["codex", "AGENTS.md", "link"], ["codex", "AGENTS.md", "copy"],
      ["claude", "CLAUDE.md", "link"], ["claude", "CLAUDE.md", "copy"],
    ]) {
      const sourcePath = path.join(repoRoot, "AGENTS.md");
      const targetPath = path.join(projectRoot, filename);
      const prefix = "USER HEAD\r\n\r\n";
      const suffix = "\n\nUSER TAIL\n";
      fs.writeFileSync(sourcePath, `${tool} version one\n`);
      install({ tool, mode, projectRoot, repoRoot });
      fs.writeFileSync(targetPath, `${prefix}${wrapBlock(tool, `${tool} version one`)}${suffix}`);
      fs.writeFileSync(sourcePath, `${tool} version two\n`);
      const plan = inspectInstall({ tool, mode, projectRoot, repoRoot });
      assert.equal(plan.conflicts.length, 1);
      assert.throws(() => install({ tool, mode, projectRoot, repoRoot }), InstallConflictError);
      uninstall({ tool, projectRoot, repoRoot });
      assert.equal(fs.readFileSync(targetPath, "utf8"), `${prefix}${wrapBlock(tool, `${tool} version one`)}${suffix}`);
      install({ tool, mode, projectRoot, repoRoot, approvedConflicts: approvalsFor(plan) });
      const expected = `${prefix}${wrapBlock(tool, `${tool} version two`)}${suffix}`;
      assert.equal(fs.readFileSync(targetPath, "utf8"), expected);
      install({ tool, mode, projectRoot, repoRoot });
      assert.equal(fs.readFileSync(targetPath, "utf8"), expected);
      uninstall({ tool, projectRoot, repoRoot });
      assert.equal(fs.readFileSync(targetPath, "utf8"), `${prefix}${suffix}`);
    }
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
});

test("missing AGENTS fails before any target writes for both tools and modes", () => {
  const repoRoot = makeTempProject();
  try {
    fs.mkdirSync(path.join(repoRoot, "skills", "example"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "skills", "example", "SKILL.md"), "---\nname: example\n---\n");
    fs.writeFileSync(path.join(repoRoot, "CLAUDE.md"), "not the rule source\n");
    for (const tool of ["codex", "claude"]) {
      for (const mode of ["link", "copy"]) {
        const projectRoot = makeTempProject();
        try {
          assert.throws(() => install({ tool, mode, projectRoot, repoRoot }), /ENOENT.*AGENTS\.md/);
          assert.deepEqual(fs.readdirSync(projectRoot), []);
        } finally {
          fs.rmSync(projectRoot, { recursive: true, force: true });
        }
      }
    }
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
});

test("unchanged CLI reinstall is automatic and does not duplicate instructions", async () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const io = makeCliIo("");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: io.stdin, stdout: io.stdout,
    });
    assert.doesNotMatch(io.getOutput(), /Type "yes"/);
    assert.match(io.getOutput(), new RegExp(`updated ${CURRENT_SKILLS.length}`));
    const agentsText = fs.readFileSync(path.join(projectRoot, "AGENTS.md"), "utf8");
    assert.equal(countMatches(agentsText, /HELLO-SCHOLAR:BEGIN codex/g), 1);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("modified instruction block is reported before mutation and needs one exact approval", async () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const agentsPath = path.join(projectRoot, "AGENTS.md");
    const editedText = upsertInstructionBlock(
      fs.readFileSync(agentsPath, "utf8"), "codex", "user changed the managed block"
    );
    fs.writeFileSync(agentsPath, editedText, "utf8");

    const declined = makeCliIo("no\n");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: declined.stdin, stdout: declined.stdout,
    });
    assert.match(declined.getOutput(), /conflict managed-content-conflict AGENTS\.md/);
    assert.match(declined.getOutput(), /Type "yes" to continue/);
    assert.equal(fs.readFileSync(agentsPath, "utf8"), editedText);

    const approved = makeCliIo("yes\n");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: approved.stdin, stdout: approved.stdout,
    });
    assert.doesNotMatch(fs.readFileSync(agentsPath, "utf8"), /user changed/);

    const unchanged = makeCliIo("");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: unchanged.stdin, stdout: unchanged.stdout,
    });
    assert.doesNotMatch(unchanged.getOutput(), /Type "yes"/);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("instruction approval cannot overwrite a newer edit made while the CLI waits", async () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const agentsPath = path.join(projectRoot, "AGENTS.md");
    fs.writeFileSync(
      agentsPath,
      upsertInstructionBlock(fs.readFileSync(agentsPath, "utf8"), "codex", "first edit"),
      "utf8"
    );
    let textAfterPrompt;
    const io = makeMutatingCliIo(() => {
      textAfterPrompt = upsertInstructionBlock(
        fs.readFileSync(agentsPath, "utf8"),
        "codex",
        "newer edit while waiting"
      );
      fs.writeFileSync(agentsPath, textAfterPrompt, "utf8");
    });

    await assert.rejects(
      main(["install", "codex"], {
        projectRoot, repoRoot: REPO_ROOT, stdin: io.stdin, stdout: io.stdout,
      }),
      InstallConflictError
    );

    assert.match(io.getOutput(), /Type "yes" to continue/);
    assert.equal(fs.readFileSync(agentsPath, "utf8"), textAfterPrompt);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("modified and unknown-baseline managed copies are preserved until approved", () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    const modifiedTarget = path.join(projectRoot, ".claude", "skills", "handoff");
    const modifiedSkill = path.join(modifiedTarget, "SKILL.md");
    fs.appendFileSync(modifiedSkill, "\nuser edit\n", "utf8");
    const legacyTarget = path.join(projectRoot, ".claude", "skills", "grilling");
    const legacyMarker = JSON.parse(fs.readFileSync(markerPath(legacyTarget), "utf8"));
    delete legacyMarker.baselineDigest;
    writeCopyMarker(legacyTarget, legacyMarker);

    assert.throws(
      () => install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT }),
      (error) => error instanceof InstallConflictError && error.conflicts.length === 2
    );
    assert.match(fs.readFileSync(modifiedSkill, "utf8"), /user edit/);
    assert.equal(JSON.parse(fs.readFileSync(markerPath(legacyTarget), "utf8")).baselineDigest, undefined);

    const plan = inspectInstall({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    install({
      tool: "claude",
      mode: "copy",
      projectRoot,
      repoRoot: REPO_ROOT,
      approvedConflicts: approvalsFor(plan),
    });
    assert.doesNotMatch(fs.readFileSync(modifiedSkill, "utf8"), /user edit/);
    assert.equal(typeof JSON.parse(fs.readFileSync(markerPath(legacyTarget), "utf8")).baselineDigest, "string");
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("copy approval cannot overwrite a newer edit made while the CLI waits", async () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    const skillPath = path.join(projectRoot, ".claude", "skills", "handoff", "SKILL.md");
    fs.appendFileSync(skillPath, "\nfirst edit\n", "utf8");
    const io = makeMutatingCliIo(() => {
      fs.appendFileSync(skillPath, "newer edit while waiting\n", "utf8");
    });

    await assert.rejects(
      main(["install", "claude", "--mode", "copy"], {
        projectRoot, repoRoot: REPO_ROOT, stdin: io.stdin, stdout: io.stdout,
      }),
      InstallConflictError
    );

    assert.match(io.getOutput(), /Type "yes" to continue/);
    assert.match(fs.readFileSync(skillPath, "utf8"), /newer edit while waiting/);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("an unowned current target blocks the whole install and is never approvable", () => {
  const projectRoot = makeTempProject();
  try {
    const target = path.join(projectRoot, ".agents", "skills", "handoff");
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "SKILL.md"), "custom\n", "utf8");

    assert.throws(
      () => install({
        tool: "codex",
        mode: "link",
        projectRoot,
        repoRoot: REPO_ROOT,
        approvedConflicts: [{ targetPath: target, digest: "not-applicable" }],
      }),
      (error) => error instanceof InstallConflictError
        && error.conflicts[0].code === "unowned-target"
    );
    assert.equal(fs.readFileSync(path.join(target, "SKILL.md"), "utf8"), "custom\n");
    assert.equal(fs.existsSync(path.join(projectRoot, "AGENTS.md")), false);
    assert.equal(fs.existsSync(path.join(projectRoot, ".agents", "skills", "review")), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("install removes an owned dangling retired link discovered with lstat", () => {
  const projectRoot = makeTempProject();
  try {
    const retiredName = "writing-plans";
    const target = path.join(projectRoot, ".agents", "skills", retiredName);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.symlinkSync(path.join(REPO_ROOT, "skills", retiredName), target, "dir");
    assert.equal(fs.existsSync(target), false, "fixture must be a dangling link");
    assert.equal(fs.lstatSync(target).isSymbolicLink(), true);

    const summary = install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    assert.equal(summary.removed, 1);
    assert.equal(fs.existsSync(target), false);
    assert.throws(() => fs.lstatSync(target), /ENOENT/);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("retired clean copies are removed but modified retired copies require approval", () => {
  const projectRoot = makeTempProject();
  try {
    const skillRoot = path.join(projectRoot, ".claude", "skills");
    const cleanTarget = path.join(skillRoot, "writing-plans");
    const modifiedTarget = path.join(skillRoot, "generating-tasks");
    for (const [name, target] of [["writing-plans", cleanTarget], ["generating-tasks", modifiedTarget]]) {
      fs.mkdirSync(target, { recursive: true });
      fs.writeFileSync(path.join(target, "SKILL.md"), `---\nname: ${name}\n---\n`, "utf8");
      writeCopyMarker(target, {
        source: path.join(REPO_ROOT, "skills", name),
        mode: "copy",
        tool: "claude",
        baselineDigest: directoryDigest(target),
      });
    }
    fs.appendFileSync(path.join(modifiedTarget, "SKILL.md"), "user edit\n", "utf8");

    assert.throws(
      () => install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT }),
      InstallConflictError
    );
    assert.ok(fs.existsSync(cleanTarget), "preflight conflict prevents partial retirement");
    assert.ok(fs.existsSync(modifiedTarget));

    const plan = inspectInstall({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    install({
      tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT,
      approvedConflicts: approvalsFor(plan),
    });
    assert.equal(fs.existsSync(cleanTarget), false);
    assert.equal(fs.existsSync(modifiedTarget), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("CLI upgrade retires all four replaced names and retains grilling, Spec and Run", async (t) => {
  for (const tool of ["codex", "claude"]) {
    for (const mode of ["link", "copy"]) {
      const tempRoot = makeTempProject();
      try {
        const fixture = prepareUpgradeFixture(tempRoot, tool, mode);
        const { repoRoot, projectRoot, skillRoot, documents } = fixture;
        if (mode === "link") {
          for (const name of NEWLY_RETIRED_SKILLS) {
            const target = path.join(skillRoot, name);
            assert.equal(fs.existsSync(target), false);
            assert.equal(fs.lstatSync(target).isSymbolicLink(), true);
          }
        }
        const io = makeCliIo();
        await main(["install", tool, "--mode", mode], {
          repoRoot, projectRoot, stdin: io.stdin, stdout: io.stdout,
        });
        assert.doesNotMatch(io.getOutput(), /Type "yes"/);
        assert.match(io.getOutput(), /installed 3, updated 5, removed 4, skipped 0/);
        assert.deepEqual(fs.readdirSync(skillRoot).sort(), CURRENT_SKILLS);
        for (const name of CURRENT_SKILLS) {
          const target = path.join(skillRoot, name);
          assert.equal(fs.lstatSync(target).isSymbolicLink(), mode === "link");
          assert.deepEqual(fs.readFileSync(path.join(target, "SKILL.md")),
            fs.readFileSync(path.join(repoRoot, "skills", name, "SKILL.md")));
        }
        assertProjectDocuments(projectRoot, documents);
        const uninstallIo = makeCliIo();
        await main(["uninstall", tool], {
          repoRoot, projectRoot, stdin: uninstallIo.stdin, stdout: uninstallIo.stdout,
        });
        assert.deepEqual(fs.readdirSync(skillRoot), []);
        assertProjectDocuments(projectRoot, documents);
        t.diagnostic(`${tool}/${mode}: nine-to-eight upgrade and uninstall preserve project documents`);
      } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      }
    }
  }
});

test("modified newly retired copies are preserved until the existing CLI approval", async () => {
  const tempRoot = makeTempProject();
  try {
    const { repoRoot, projectRoot, skillRoot, documents } = prepareUpgradeFixture(tempRoot, "claude", "copy");
    const grillingBefore = fs.readFileSync(path.join(skillRoot, "grilling", "SKILL.md"));
    for (const name of NEWLY_RETIRED_SKILLS) {
      fs.appendFileSync(path.join(skillRoot, name, "SKILL.md"), "User customization.\n");
    }
    const unknownBaseline = path.join(skillRoot, "takeoff");
    const marker = JSON.parse(fs.readFileSync(markerPath(unknownBaseline), "utf8"));
    delete marker.baselineDigest;
    writeCopyMarker(unknownBaseline, marker);
    const declined = makeCliIo("no\n");
    await main(["install", "claude", "--mode", "copy"], {
      repoRoot, projectRoot, stdin: declined.stdin, stdout: declined.stdout,
    });
    assert.match(declined.getOutput(), /install claude cancelled/);
    for (const name of NEWLY_RETIRED_SKILLS) {
      assert.ok(declined.getOutput().includes(`conflict managed-content-conflict .claude/skills/${name}:`));
      assert.match(fs.readFileSync(path.join(skillRoot, name, "SKILL.md"), "utf8"), /User customization/);
    }
    assert.deepEqual(fs.readFileSync(path.join(skillRoot, "grilling", "SKILL.md")), grillingBefore);
    assert.equal(fs.existsSync(path.join(skillRoot, "review")), false);
    assertProjectDocuments(projectRoot, documents);

    const approved = makeCliIo("yes\n");
    await main(["install", "claude", "--mode", "copy"], {
      repoRoot, projectRoot, stdin: approved.stdin, stdout: approved.stdout,
    });
    assert.equal(countMatches(approved.getOutput(), /Type "yes"/g), 1);
    assert.deepEqual(fs.readdirSync(skillRoot).sort(), CURRENT_SKILLS);
    assertProjectDocuments(projectRoot, documents);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("foreign directories using newly retired names block CLI upgrade without deletion", async () => {
  const tempRoot = makeTempProject();
  try {
    const { repoRoot, projectRoot, skillRoot, documents } = prepareUpgradeFixture(tempRoot, "codex", "copy");
    const grillingBefore = fs.readFileSync(path.join(skillRoot, "grilling", "SKILL.md"));
    for (const name of NEWLY_RETIRED_SKILLS) {
      const target = path.join(skillRoot, name);
      fs.rmSync(target, { recursive: true });
      fs.mkdirSync(target);
      fs.writeFileSync(path.join(target, "SKILL.md"), "Unrelated user Skill.\n");
    }
    const io = makeCliIo("yes\n");
    await assert.rejects(main(["install", "codex"], {
      repoRoot, projectRoot, stdin: io.stdin, stdout: io.stdout,
    }), InstallConflictError);
    assert.doesNotMatch(io.getOutput(), /Type "yes"/);
    for (const name of NEWLY_RETIRED_SKILLS) {
      assert.ok(io.getOutput().includes(`conflict unowned-target .agents/skills/${name}:`));
      assert.equal(fs.readFileSync(path.join(skillRoot, name, "SKILL.md"), "utf8"), "Unrelated user Skill.\n");
    }
    assert.deepEqual(fs.readFileSync(path.join(skillRoot, "grilling", "SKILL.md")), grillingBefore);
    assert.equal(fs.existsSync(path.join(skillRoot, "review")), false);
    assertProjectDocuments(projectRoot, documents);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("other-source retired links are preserved and block mutation", async () => {
  const projectRoot = makeTempProject();
  const otherSource = makeTempProject();
  try {
    const target = path.join(projectRoot, ".agents", "skills", "converge-to-spec");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.symlinkSync(otherSource, target, "dir");
    const io = makeCliIo("yes\n");
    await assert.rejects(
      main(["install", "codex"], {
        projectRoot, repoRoot: REPO_ROOT, stdin: io.stdin, stdout: io.stdout,
      }),
      InstallConflictError
    );
    assert.match(io.getOutput(), /conflict unowned-target \.agents\/skills\/converge-to-spec/);
    assert.doesNotMatch(io.getOutput(), /Type "yes"/);
    assert.equal(fs.realpathSync(target), fs.realpathSync(otherSource));
    assert.equal(fs.existsSync(path.join(projectRoot, "AGENTS.md")), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
    fs.rmSync(otherSource, { recursive: true, force: true });
  }
});

test("uninstall removes unchanged owned assets and preserves modified user content", () => {
  const projectRoot = makeTempProject();
  try {
    fs.writeFileSync(path.join(projectRoot, "CLAUDE.md"), "# User Rules\n", "utf8");
    install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT });
    const modifiedTarget = path.join(projectRoot, ".claude", "skills", "handoff");
    fs.appendFileSync(path.join(modifiedTarget, "SKILL.md"), "user edit\n", "utf8");
    const claudePath = path.join(projectRoot, "CLAUDE.md");
    fs.writeFileSync(
      claudePath,
      upsertInstructionBlock(fs.readFileSync(claudePath, "utf8"), "claude", "user block edit"),
      "utf8"
    );

    uninstall({ tool: "claude", projectRoot, repoRoot: REPO_ROOT });
    assert.ok(fs.existsSync(modifiedTarget));
    assert.match(fs.readFileSync(claudePath, "utf8"), /user block edit/);
    assert.match(fs.readFileSync(claudePath, "utf8"), /# User Rules/);
    assert.equal(fs.existsSync(path.join(projectRoot, ".claude", "skills", "review")), false);
    assert.equal(fs.existsSync(path.join(projectRoot, ".claude", ".hello-scholar-install.json")), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("uninstall preserves exact whitespace outside an unchanged managed block", () => {
  const projectRoot = makeTempProject();
  try {
    install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const agentsPath = path.join(projectRoot, "AGENTS.md");
    const sourceText = fs.readFileSync(
      path.join(REPO_ROOT, "AGENTS.md"),
      "utf8"
    );
    const outsideText = "\n\n\nUSER\n";
    fs.writeFileSync(agentsPath, `${wrapBlock("codex", sourceText)}${outsideText}`, "utf8");

    uninstall({ tool: "codex", projectRoot, repoRoot: REPO_ROOT });

    assert.equal(fs.readFileSync(agentsPath, "utf8"), outsideText);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("uninstall preserves instructions with duplicate or misordered markers", () => {
  const duplicateProject = makeTempProject();
  const misorderedProject = makeTempProject();
  try {
    install({ tool: "codex", mode: "link", projectRoot: duplicateProject, repoRoot: REPO_ROOT });
    const duplicatePath = path.join(duplicateProject, "AGENTS.md");
    const duplicateText = `${fs.readFileSync(duplicatePath, "utf8")}\n`
      + "<!-- HELLO-SCHOLAR:BEGIN codex -->\nuser duplicate\n"
      + "<!-- HELLO-SCHOLAR:END codex -->\n";
    fs.writeFileSync(duplicatePath, duplicateText, "utf8");
    uninstall({ tool: "codex", projectRoot: duplicateProject, repoRoot: REPO_ROOT });
    assert.equal(fs.readFileSync(duplicatePath, "utf8"), duplicateText);

    install({ tool: "codex", mode: "link", projectRoot: misorderedProject, repoRoot: REPO_ROOT });
    const misorderedPath = path.join(misorderedProject, "AGENTS.md");
    const misorderedText = "<!-- HELLO-SCHOLAR:END codex -->\n"
      + `${fs.readFileSync(misorderedPath, "utf8")}`;
    fs.writeFileSync(misorderedPath, misorderedText, "utf8");
    uninstall({ tool: "codex", projectRoot: misorderedProject, repoRoot: REPO_ROOT });
    assert.equal(fs.readFileSync(misorderedPath, "utf8"), misorderedText);
  } finally {
    fs.rmSync(duplicateProject, { recursive: true, force: true });
    fs.rmSync(misorderedProject, { recursive: true, force: true });
  }
});

test("install failure before Skill writes does not create instructions", () => {
  const projectRoot = makeTempProject();
  try {
    fs.writeFileSync(path.join(projectRoot, ".agents"), "not a directory", "utf8");
    assert.throws(
      () => install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT }),
      InstallConflictError
    );
    assert.equal(fs.existsSync(path.join(projectRoot, "AGENTS.md")), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("linked managed parents block installation and obsolete state files are untouched", () => {
  const linkedParentProject = makeTempProject();
  const linkedStateProject = makeTempProject();
  const externalRoot = makeTempProject();
  const externalState = path.join(externalRoot, "state.json");
  try {
    fs.symlinkSync(externalRoot, path.join(linkedParentProject, ".agents"), "dir");
    assert.throws(
      () => install({ tool: "codex", mode: "link", projectRoot: linkedParentProject, repoRoot: REPO_ROOT }),
      InstallConflictError
    );
    assert.deepEqual(fs.readdirSync(externalRoot), []);
    assert.equal(fs.existsSync(path.join(linkedParentProject, "AGENTS.md")), false);

    fs.mkdirSync(path.join(linkedStateProject, ".agents"), { recursive: true });
    fs.writeFileSync(externalState, JSON.stringify({ schema: 1, tool: "codex" }), "utf8");
    fs.symlinkSync(externalState, path.join(linkedStateProject, ".agents", ".hello-scholar-install.json"));
    install({ tool: "codex", mode: "link", projectRoot: linkedStateProject, repoRoot: REPO_ROOT });
    uninstall({ tool: "codex", projectRoot: linkedStateProject, repoRoot: REPO_ROOT });
    assert.equal(fs.readFileSync(externalState, "utf8"), JSON.stringify({ schema: 1, tool: "codex" }));
    assert.equal(fs.lstatSync(path.join(linkedStateProject, ".agents", ".hello-scholar-install.json")).isSymbolicLink(), true);
    assert.equal(fs.readFileSync(path.join(linkedStateProject, "AGENTS.md"), "utf8"), "\n\n");
  } finally {
    fs.rmSync(linkedParentProject, { recursive: true, force: true });
    fs.rmSync(linkedStateProject, { recursive: true, force: true });
    fs.rmSync(externalRoot, { recursive: true, force: true });
  }
});

test("gitignore block is shared by both tools and preserves user lines", () => {
  const projectRoot = makeTempProject();
  const gitignorePath = path.join(projectRoot, ".gitignore");
  try {
    fs.writeFileSync(gitignorePath, "node_modules/\r\n", "utf8");
    const first = install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    assert.equal(first.gitignore, "updated");
    const expected = `node_modules/\r\n\r\n${gitignoreBlock("\r\n")}\r\n`;
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), expected);

    assert.equal(install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT }).gitignore, "unchanged");
    assert.equal(install({ tool: "claude", mode: "link", projectRoot, repoRoot: REPO_ROOT }).gitignore, "unchanged");
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), expected);

    assert.equal(uninstall({ tool: "codex", projectRoot, repoRoot: REPO_ROOT }).gitignore, "kept");
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), expected);
    assert.equal(uninstall({ tool: "claude", projectRoot, repoRoot: REPO_ROOT }).gitignore, "removed");
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), "node_modules/\r\n");
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("fresh install creates gitignore and uninstall deletes a file it alone owns", () => {
  const projectRoot = makeTempProject();
  const gitignorePath = path.join(projectRoot, ".gitignore");
  try {
    assert.equal(install({ tool: "claude", mode: "copy", projectRoot, repoRoot: REPO_ROOT }).gitignore, "created");
    const text = fs.readFileSync(gitignorePath, "utf8");
    assert.equal(text, `${gitignoreBlock()}\n`);
    assert.match(text, /^\/artifacts\/$/m);
    assert.match(text, /^\/runs\/\*\/logs\/$/m);
    assert.doesNotMatch(text, /record\.md|^\/runs\/$/m);
    uninstall({ tool: "claude", projectRoot, repoRoot: REPO_ROOT });
    assert.equal(fs.existsSync(gitignorePath), false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("edited gitignore block needs approval and malformed markers block install", async () => {
  const projectRoot = makeTempProject();
  const gitignorePath = path.join(projectRoot, ".gitignore");
  try {
    install({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const edited = fs.readFileSync(gitignorePath, "utf8").replace("/artifacts/\n", "");
    fs.writeFileSync(gitignorePath, edited, "utf8");

    const declined = makeCliIo("no\n");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: declined.stdin, stdout: declined.stdout,
    });
    assert.match(declined.getOutput(), /conflict managed-content-conflict \.gitignore/);
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), edited);
    assert.equal(uninstall({ tool: "codex", projectRoot, repoRoot: REPO_ROOT }).gitignore, "skipped");
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), edited);

    const approved = makeCliIo("yes\n");
    await main(["install", "codex"], {
      projectRoot, repoRoot: REPO_ROOT, stdin: approved.stdin, stdout: approved.stdout,
    });
    assert.equal(fs.readFileSync(gitignorePath, "utf8"), `${gitignoreBlock()}\n`);

    fs.writeFileSync(gitignorePath, "# HELLO-SCHOLAR:BEGIN\n/artifacts/\n", "utf8");
    const plan = inspectInstall({ tool: "codex", mode: "link", projectRoot, repoRoot: REPO_ROOT });
    const conflict = plan.conflicts.find((item) => item.path === ".gitignore");
    assert.equal(conflict.code, "unowned-target");
    assert.equal(conflict.approvable, false);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});
