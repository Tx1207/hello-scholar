import assert from "node:assert/strict";
import test from "node:test";

import { parsePolicy } from "../src/policy.mjs";

test("parses a valid policy", () => {
  assert.deepEqual(parsePolicy('{"version":1,"rules":[{"kind":"allow","pattern":"^docs/"}]}'), {
    ruleCount: 1,
  });
});

test("rejects a policy without rules", () => {
  assert.throws(() => parsePolicy('{"version":1,"rules":[]}'), /at least one rule/);
});
