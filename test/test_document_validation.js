const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { discoverDocuments } = require("../src/document-discovery");
const { validateDocumentSet } = require("../src/document-validation");

function document(relativePath, attributes, body = "# Document\n") {
  // Purpose: build one discovered-document fixture; Input: relative path, Front Matter attributes, and optional body; Output: document object accepted by validation.
  return {
    kind: attributes.kind,
    absolutePath: `/fixture/${relativePath}`,
    relativePath,
    attributes,
    body,
  };
}

function discovery(documents, overrides = {}) {
  // Purpose: build a complete discovery-result fixture; Input: document list and optional collection overrides; Output: discovery result accepted by validation.
  return {
    documents,
    legacyPaths: [],
    misplacedPaths: [],
    forbiddenRunDocuments: [],
    unsafePaths: [],
    indexPaths: [],
    ...overrides,
  };
}

function specAttributes(overrides = {}) {
  // Purpose: build valid Spec metadata; Input: optional field overrides; Output: Spec Front Matter attributes.
  return {
    schema: 1,
    kind: "spec",
    id: "SPEC-001",
    title: "Paged Cache",
    topic: "kv-cache",
    type: "research",
    status: "accepted",
    revision: 3,
    summary: "Remove fragmentation failures",
    created: "2026-07-20",
    updated: "2026-08-01",
    supersedes: [],
    superseded_by: null,
    ...overrides,
  };
}

function planAttributes(overrides = {}) {
  // Purpose: build valid Plan metadata; Input: optional field overrides; Output: Plan Front Matter attributes.
  return {
    schema: 1,
    kind: "plan",
    spec: "SPEC-001",
    spec_revision: 3,
    revision: 2,
    status: "approved",
    title: "Paged Cache Plan",
    summary: "Implement the accepted design",
    created: "2026-08-01",
    updated: "2026-08-02",
    ...overrides,
  };
}

function tasksAttributes(overrides = {}) {
  // Purpose: build valid Tasks metadata; Input: optional field overrides; Output: Tasks Front Matter attributes.
  return {
    schema: 1,
    kind: "tasks",
    spec: "SPEC-001",
    spec_revision: 3,
    plan_revision: 2,
    revision: 4,
    approval: "approved",
    approved_revision: 4,
    status: "in-progress",
    created: "2026-08-02",
    updated: "2026-08-03",
    ...overrides,
  };
}

function recordAttributes(overrides = {}) {
  // Purpose: build valid Record metadata; Input: optional field overrides; Output: Record Front Matter attributes.
  return {
    schema: 1,
    kind: "record",
    run_id: "20260801-1430-paged-cache",
    title: "Block Size Comparison",
    status: "completed",
    spec: "SPEC-001",
    spec_revision: 2,
    plan_revision: 1,
    started: "2026-08-01T14:30:00+08:00",
    completed: "2026-08-01T16:42:00+08:00",
    decision: "adopt",
    summary: "Block size 16 wins",
    ...overrides,
  };
}

function architectureAttributes(overrides = {}) {
  // Purpose: build valid Architecture metadata; Input: optional field overrides; Output: Architecture Front Matter attributes.
  return {
    schema: 1,
    kind: "architecture",
    status: "current",
    applies_to: "main",
    updated: "2026-08-03",
    ...overrides,
  };
}

const bundle = "hello-scholar/specs/kv-cache/SPEC-001-paged-cache";

function errorCodes(result) {
  // Purpose: compare validation errors by stable code; Input: validation result; Output: set of error codes.
  return new Set(result.errors.map((diagnostic) => diagnostic.code));
}

function noticeCodes(result) {
  // Purpose: compare validation notices by stable code; Input: validation result; Output: set of notice codes.
  return new Set(result.notices.map((diagnostic) => diagnostic.code));
}

test("validates a complete current bundle and computes top-level task completion", () => {
  const input = discovery([
    document(`${bundle}/tasks.md`, tasksAttributes(), [
      "# Tasks",
      "",
      "- [x] T001: Implement allocator",
      "  - [ ] T999: Nested checklist is not a task",
      "- [ ] T002：Run benchmark",
      "",
    ].join("\n")),
    document("runs/20260801-1430-paged-cache/record.md", recordAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document("hello-scholar/architecture.md", architectureAttributes()),
    document(`${bundle}/spec.md`, specAttributes()),
  ]);
  const before = structuredClone(input);

  const result = validateDocumentSet(input);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.notices, []);
  assert.equal(result.specs.length, 1);
  assert.equal(result.specs[0].id, "SPEC-001");
  assert.equal(result.specs[0].planState, "Current");
  assert.equal(result.specs[0].tasksState, "Current");
  assert.deepEqual(result.specs[0].completion, { completed: 1, total: 2, percent: 50 });
  assert.equal(result.specs[0].approvalState, "approved");
  assert.equal(result.specs[0].tasksStatus, "in-progress");
  assert.equal(result.records[0].runId, "20260801-1430-paged-cache");
  assert.equal(result.architecture.relativePath, "hello-scholar/architecture.md");
  assert.deepEqual(input, before, "validation must not mutate discovery results");
});

test("does not count task-shaped examples in fenced code or HTML comments", () => {
  const result = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document(`${bundle}/tasks.md`, tasksAttributes({ status: "completed" }), [
      "# Tasks",
      "",
      "```markdown",
      "- [x] T001: Example only",
      "```",
      "",
      "<!--",
      "- [x] T002: Hidden historical task",
      "-->",
      "",
    ].join("\n")),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ]));

  assert.deepEqual(result.specs[0].completion, { completed: 0, total: 0, percent: 0 });
  assert.ok(errorCodes(result).has("empty-tasks-marked-completed"));
});

test("derives Missing and Stale as notices without turning them into errors", () => {
  const missing = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
  ]));

  assert.deepEqual(missing.errors, []);
  assert.equal(missing.specs[0].planState, "Missing");
  assert.equal(missing.specs[0].tasksState, "Missing");
  assert.equal(missing.specs[0].completion, null);
  assert.deepEqual(noticeCodes(missing), new Set([
    "architecture-missing",
    "plan-missing",
    "tasks-missing",
  ]));

  const stale = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes({ spec_revision: 2 })),
    document(`${bundle}/tasks.md`, tasksAttributes({ plan_revision: 1 })),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ]));

  assert.deepEqual(stale.errors, []);
  assert.equal(stale.specs[0].planState, "Stale");
  assert.equal(stale.specs[0].tasksState, "Stale");
  assert.deepEqual(noticeCodes(stale), new Set(["plan-stale", "tasks-stale"]));
});

test("checks every document kind for required fields and fixed scalar types", () => {
  const cases = [
    [`${bundle}/spec.md`, specAttributes(), "title"],
    [`${bundle}/plan.md`, planAttributes(), "summary"],
    [`${bundle}/tasks.md`, tasksAttributes(), "approval"],
    ["runs/20260801-1430-paged-cache/record.md", recordAttributes(), "decision"],
    ["hello-scholar/architecture.md", architectureAttributes(), "applies_to"],
  ];

  for (const [relativePath, attributes, field] of cases) {
    delete attributes[field];
    const result = validateDocumentSet(discovery([document(relativePath, attributes)]));
    assert.ok(
      result.errors.some((diagnostic) =>
        diagnostic.code === "missing-field" && diagnostic.message.includes(field)
      ),
      `${relativePath} should require ${field}`
    );
  }

  const result = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes({
      schema: "1",
      revision: 0,
      type: "idea",
      created: "2026-02-30",
    })),
    document(`${bundle}/plan.md`, planAttributes({ status: "ready", updated: "08/02/2026" })),
    document(`${bundle}/tasks.md`, tasksAttributes({ revision: true })),
    document("hello-scholar/architecture.md", architectureAttributes({ status: "draft" })),
  ]));
  const codes = errorCodes(result);
  for (const code of ["invalid-schema", "invalid-positive-integer", "invalid-enum", "invalid-date"]) {
    assert.ok(codes.has(code), `expected ${code}`);
  }
});

test("checks path identity, globally unique Spec IDs, and three-or-more digit IDs", () => {
  const result = validateDocumentSet(discovery([
    document(
      "hello-scholar/specs/search/SPEC-999-search/spec.md",
      specAttributes({ id: "SPEC-999", topic: "search" })
    ),
    document(
      "hello-scholar/specs/search/SPEC-1000-search/spec.md",
      specAttributes({ id: "SPEC-1000", topic: "search" })
    ),
    document(
      "hello-scholar/specs/wrong-topic/SPEC-002-other/spec.md",
      specAttributes({ topic: "right-topic" })
    ),
    document(
      "hello-scholar/specs/duplicate/SPEC-001-duplicate/spec.md",
      specAttributes({ topic: "duplicate" })
    ),
  ]));

  const codes = errorCodes(result);
  assert.ok(codes.has("duplicate-spec-id"));
  assert.ok(codes.has("topic-path-mismatch"));
  assert.ok(codes.has("bundle-id-mismatch"));
  assert.equal(result.errors.some((error) => error.message.includes("SPEC-999") && error.code === "invalid-spec-id"), false);
  assert.equal(result.errors.some((error) => error.message.includes("SPEC-1000") && error.code === "invalid-spec-id"), false);

  const wrongKind = validateDocumentSet(discovery([
    document(`${bundle}/plan.md`, { ...planAttributes(), kind: "spec" }),
  ]));
  assert.ok(errorCodes(wrongKind).has("kind-path-mismatch"));
});

test("separates Tasks approval from execution state and rejects fake completion", () => {
  const documents = [
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document(
      `${bundle}/tasks.md`,
      tasksAttributes({
        approval: "pending-review",
        approved_revision: 4,
        status: "completed",
      }),
      [
        "- [x] T001: Done once",
        "- [ ] T001：Duplicate and incomplete",
      ].join("\n")
    ),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ];
  const result = validateDocumentSet(discovery(documents));
  const codes = errorCodes(result);

  assert.ok(codes.has("invalid-task-approval"));
  assert.ok(codes.has("unapproved-task-execution"));
  assert.ok(codes.has("duplicate-task-id"));
  assert.ok(codes.has("incomplete-tasks-marked-completed"));

  const staleCompleted = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document(
      `${bundle}/tasks.md`,
      tasksAttributes({ spec_revision: 2, status: "completed" }),
      "- [x] T001: Complete\n"
    ),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ]));
  assert.ok(errorCodes(staleCompleted).has("stale-tasks-marked-completed"));

  const emptyCompleted = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document(`${bundle}/tasks.md`, tasksAttributes({ status: "completed" }), "# No tasks\n"),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ]));
  assert.ok(errorCodes(emptyCompleted).has("empty-tasks-marked-completed"));
});

test("validates Spec replacement references, reciprocity, missing IDs, and cycles", () => {
  const makeSpec = (id, topic, relations) => {
    // Purpose: build a related Spec fixture; Input: Spec ID, topic, and relation overrides; Output: discovered Spec document.
    return document(
      `hello-scholar/specs/${topic}/${id}-${topic}/spec.md`,
      specAttributes({ id, topic, ...relations })
    );
  };
  const result = validateDocumentSet(discovery([
    makeSpec("SPEC-010", "alpha", { supersedes: ["SPEC-011"], superseded_by: "SPEC-011" }),
    makeSpec("SPEC-011", "beta", { supersedes: ["SPEC-010"], superseded_by: "SPEC-010" }),
    makeSpec("SPEC-012", "self", { supersedes: ["SPEC-012"] }),
    makeSpec("SPEC-013", "missing", { supersedes: ["SPEC-999"] }),
    makeSpec("SPEC-014", "one-way", { supersedes: ["SPEC-015"] }),
    makeSpec("SPEC-015", "target", {}),
    document("hello-scholar/architecture.md", architectureAttributes()),
  ]));
  const codes = errorCodes(result);

  assert.ok(codes.has("spec-relation-cycle"));
  assert.ok(codes.has("spec-self-reference"));
  assert.ok(codes.has("missing-spec-reference"));
  assert.ok(codes.has("inconsistent-spec-relation"));
});

test("validates Record association revisions and lifecycle timestamps", () => {
  const records = [
    document("runs/partial/record.md", recordAttributes({
      run_id: "partial",
      spec_revision: null,
    })),
    document("runs/running/record.md", recordAttributes({
      run_id: "running",
      status: "running",
      started: null,
      completed: null,
    })),
    document("runs/backwards/record.md", recordAttributes({
      run_id: "backwards",
      completed: "2026-08-01T13:30:00+08:00",
    })),
    document("runs/invalid-time/record.md", recordAttributes({
      run_id: "invalid-time",
      started: "2026-02-30T14:30:00+08:00",
    })),
    document("runs/future-spec/record.md", recordAttributes({
      run_id: "future-spec",
      spec_revision: 4,
    })),
    document("runs/future-plan/record.md", recordAttributes({
      run_id: "future-plan",
      plan_revision: 3,
    })),
    document("runs/missing-spec/record.md", recordAttributes({
      run_id: "missing-spec",
      spec: "SPEC-999",
    })),
    document("runs/exploration/record.md", recordAttributes({
      run_id: "exploration",
      status: "planned",
      spec: null,
      spec_revision: null,
      plan_revision: null,
      started: null,
      completed: null,
      decision: "pending",
    })),
  ];
  const result = validateDocumentSet(discovery([
    document(`${bundle}/spec.md`, specAttributes()),
    document(`${bundle}/plan.md`, planAttributes()),
    document("hello-scholar/architecture.md", architectureAttributes()),
    ...records,
  ]));
  const codes = errorCodes(result);

  assert.ok(codes.has("partial-record-association"));
  assert.ok(codes.has("invalid-record-lifecycle"));
  assert.ok(codes.has("invalid-timestamp"));
  assert.ok(codes.has("record-time-order"));
  assert.ok(codes.has("future-spec-revision"));
  assert.ok(codes.has("future-plan-revision"));
  assert.ok(codes.has("missing-record-spec"));
  assert.ok(noticeCodes(result).has("unassociated-record"));
});

test("validates discovered files without changing any Fixture bytes", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hello-scholar-validation-"));
  const specPath = path.join(projectRoot, ...`${bundle}/spec.md`.split("/"));
  const architecturePath = path.join(projectRoot, "hello-scholar", "architecture.md");
  try {
    fs.mkdirSync(path.dirname(specPath), { recursive: true });
    fs.writeFileSync(specPath, [
      "---",
      "schema: 1",
      "kind: spec",
      "id: SPEC-001",
      "title: Paged Cache",
      "topic: kv-cache",
      "type: research",
      "status: accepted",
      "revision: 3",
      "summary: Remove fragmentation failures",
      "created: 2026-07-20",
      "updated: 2026-08-01",
      "supersedes: []",
      "superseded_by: null",
      "---",
      "# Paged Cache",
      "",
    ].join("\n"), "utf8");
    fs.mkdirSync(path.dirname(architecturePath), { recursive: true });
    fs.writeFileSync(architecturePath, [
      "---",
      "schema: 1",
      "kind: architecture",
      "status: current",
      "applies_to: main",
      "updated: 2026-08-03",
      "---",
      "# Current Architecture",
      "",
    ].join("\n"), "utf8");
    const before = new Map([
      [specPath, fs.readFileSync(specPath)],
      [architecturePath, fs.readFileSync(architecturePath)],
    ]);

    const result = validateDocumentSet(discoverDocuments(projectRoot));

    assert.deepEqual(result.errors, []);
    for (const [filePath, bytes] of before) {
      assert.deepEqual(fs.readFileSync(filePath), bytes);
    }
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("converts discovery safety and legacy findings into sorted diagnostics", () => {
  const result = validateDocumentSet(discovery([], {
    legacyPaths: ["hello-scholar/memory/specs/old.md"],
    misplacedPaths: ["hello-scholar/specs/orphan/plan.md"],
    forbiddenRunDocuments: ["runs/demo/README.md"],
    unsafePaths: [{ relativePath: "runs/linked", reason: "symbolic link or junction" }],
  }));

  assert.deepEqual(errorCodes(result), new Set([
    "forbidden-run-document",
    "misplaced-document",
    "unsafe-path",
  ]));
  assert.deepEqual(noticeCodes(result), new Set([
    "architecture-missing",
    "legacy-path",
  ]));
  assert.deepEqual(result.errors.map((diagnostic) => diagnostic.path), [
    "hello-scholar/specs/orphan/plan.md",
    "runs/demo/README.md",
    "runs/linked",
  ]);
});
