"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const { PolicyInputError, authorize } = require("../src/access-policy");
const { authorizeLegacy } = require("../src/legacy-policy");

const policy = {
  defaultAllow: false,
  rules: [
    { id: "allow-editor", actorRole: "editor", resource: "papers", effect: "allow" },
    { id: "deny-suspended", actorRole: "suspended", resource: "papers", effect: "deny" },
  ],
};

test("allows a matching editor rule", () => {
  const decision = authorize(
    { actorId: "user-7", actorRole: "editor", resource: "papers" },
    policy
  );
  assert.equal(decision.allowed, true);
  assert.equal(decision.matchedRuleId, "allow-editor");
});

test("denies a matching suspended rule", () => {
  const decision = authorize(
    { actorId: "user-8", actorRole: "suspended", resource: "papers" },
    policy
  );
  assert.equal(decision.allowed, false);
});

test("rejects a request without an actor id", () => {
  assert.throws(
    () => authorize({ actorRole: "editor", resource: "papers" }, policy),
    PolicyInputError
  );
});

test("keeps the legacy boolean policy entry point available", () => {
  assert.equal(
    authorizeLegacy(
      { id: "user-9", role: "editor" },
      "papers",
      { defaultAllow: false, rules: policy.rules }
    ),
    true
  );
});
