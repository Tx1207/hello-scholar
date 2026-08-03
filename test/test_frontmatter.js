const assert = require("node:assert/strict");
const test = require("node:test");

const {
  FrontMatterError,
  parseFrontMatter,
  parseScalar,
} = require("../src/frontmatter");

function document(lines, body = "") {
  // Purpose: assemble a Front Matter parser fixture; Input: metadata lines and optional Markdown body; Output: complete document text.
  return ["---", ...lines, "---", body].join("\n");
}

test("parses the five document front matter shapes", () => {
  const cases = [
    {
      lines: [
        "schema: 1",
        "kind: spec",
        "id: SPEC-001",
        "title: Paged Cache Feasibility",
        "topic: kv-cache-acceleration",
        "type: research",
        "status: accepted",
        "revision: 3",
        "summary: 验证 Paged KV Cache",
        "created: 2026-07-20",
        "updated: 2026-08-01",
        "supersedes: []",
        "superseded_by: null",
      ],
      expected: { kind: "spec", revision: 3, supersedes: [], superseded_by: null },
    },
    {
      lines: [
        "schema: 1",
        "kind: plan",
        "spec: SPEC-001",
        "spec_revision: 3",
        "revision: 2",
        "status: approved",
        "title: Paged Cache Plan",
        "summary: 实现原型",
        "created: 2026-08-01",
        "updated: 2026-08-02",
      ],
      expected: { kind: "plan", spec_revision: 3, revision: 2 },
    },
    {
      lines: [
        "schema: 1",
        "kind: tasks",
        "spec: SPEC-001",
        "spec_revision: 3",
        "plan_revision: 2",
        "revision: 4",
        "approval: approved",
        "approved_revision: 4",
        "status: in-progress",
        "created: 2026-08-02",
        "updated: 2026-08-03",
      ],
      expected: { kind: "tasks", approved_revision: 4, status: "in-progress" },
    },
    {
      lines: [
        "schema: 1",
        "kind: record",
        "run_id: 20260801-1430-paged-cache",
        "title: Block Size Comparison",
        "status: completed",
        "spec: null",
        "spec_revision: null",
        "plan_revision: null",
        "started: 2026-08-01T14:30:00+08:00",
        "completed: 2026-08-01T16:42:00+08:00",
        "decision: adopt",
        "summary: Block Size 16 wins",
      ],
      expected: { kind: "record", spec: null, decision: "adopt" },
    },
    {
      lines: [
        "schema: 1",
        "kind: architecture",
        "status: current",
        "applies_to: main",
        "updated: 2026-08-03",
      ],
      expected: { kind: "architecture", status: "current" },
    },
  ];

  for (const { lines, expected } of cases) {
    const result = parseFrontMatter(document(lines, "# Body\n"), `${expected.kind}.md`);
    assert.equal(result.attributes.schema, 1);
    assert.deepEqual({ ...result.attributes, ...expected }, result.attributes);
    assert.equal(result.body, "# Body\n");
  }
});

test("supports LF and CRLF without rewriting the body", () => {
  const lf = parseFrontMatter("---\nkind: spec\n---\nline 1\r\nline 2\n", "lf.md");
  const crlf = parseFrontMatter("---\r\nkind: spec\r\n---\r\nline 1\r\nline 2\r\n", "crlf.md");

  assert.equal(lf.body, "line 1\r\nline 2\n");
  assert.equal(crlf.body, "line 1\r\nline 2\r\n");
});

test("parses supported scalar boundaries", () => {
  assert.equal(parseScalar("-12", "values.md", 2), -12);
  assert.equal(parseScalar("true", "values.md", 2), true);
  assert.equal(parseScalar("false", "values.md", 2), false);
  assert.equal(parseScalar("null", "values.md", 2), null);
  assert.equal(parseScalar("2026-08-01T14:30:00+08:00", "values.md", 2), "2026-08-01T14:30:00+08:00");
  assert.equal(parseScalar('"Title: with colon"', "values.md", 2), "Title: with colon");
  assert.equal(parseScalar("'research: alpha'", "values.md", 2), "research: alpha");
  assert.deepEqual(parseScalar("[]", "values.md", 2), []);
  assert.deepEqual(
    parseScalar('[SPEC-001, "SPEC:002", \'SPEC-003\']', "values.md", 2),
    ["SPEC-001", "SPEC:002", "SPEC-003"]
  );
});

test("uses only the first colon to split a metadata entry", () => {
  const result = parseFrontMatter(
    document(["title: Research: retrieval: phase 1", "summary: 带 空格 的 中文 摘要"]),
    "colon.md"
  );

  assert.equal(result.attributes.title, "Research: retrieval: phase 1");
  assert.equal(result.attributes.summary, "带 空格 的 中文 摘要");
});

test("allows blank metadata lines", () => {
  const result = parseFrontMatter(document(["schema: 1", "", "kind: spec"]), "blank.md");
  assert.deepEqual(result.attributes, { schema: 1, kind: "spec" });
});

test("preserves __proto__ as metadata without changing the attributes prototype", () => {
  const result = parseFrontMatter(document(["__proto__: metadata", "kind: spec"]), "keys.md");

  assert.equal(Object.prototype.hasOwnProperty.call(result.attributes, "__proto__"), true);
  assert.equal(result.attributes.__proto__, "metadata");
  assert.equal(Object.getPrototypeOf(result.attributes), Object.prototype);
  assert.throws(
    () => parseFrontMatter(document(["__proto__: one", "__proto__: two"]), "keys.md"),
    /keys\.md:3.*duplicate metadata key/
  );
});

const invalidDocuments = [
  ["missing opening boundary", "kind: spec\n---\n", 1],
  ["missing closing boundary", "---\nkind: spec\n", 3],
  ["duplicate key", document(["kind: spec", "kind: plan"]), 3],
  ["invalid key", document(["bad key: value"]), 2],
  ["missing colon", document(["kind spec"]), 2],
  ["indented nested value", document(["owner:", "  name: scholar"]), 3],
  ["literal multiline value", document(["summary: |", "  text"]), 2],
  ["folded multiline value", document(["summary: >", "  text"]), 2],
  ["literal multiline value with indent and chomp", document(["summary: |2-", "  text"]), 2],
  ["folded multiline value with comment", document(["summary: >- # note", "  text"]), 2],
  ["anchor", document(["owner: &owner scholar"]), 2],
  ["alias", document(["owner: *owner"]), 2],
  ["tag", document(["owner: !!str scholar"]), 2],
  ["object", document(["owner: {name: scholar}"]), 2],
  ["nested array", document(["items: [[one]]"]), 2],
  ["unclosed double quote", document(['title: "broken']), 2],
  ["unclosed single quote", document(["title: 'broken"]), 2],
];

for (const [name, input, line] of invalidDocuments) {
  test(`rejects ${name} with source and line`, () => {
    assert.throws(
      () => parseFrontMatter(input, "broken.md"),
      (error) => {
        assert.ok(error instanceof FrontMatterError);
        assert.match(error.message, new RegExp(`broken\\.md:${line}\\b`));
        return true;
      }
    );
  });
}

test("rejects an array with an empty item", () => {
  assert.throws(
    () => parseScalar("[one,,two]", "array.md", 7),
    /array\.md:7.*empty array item/
  );
});
