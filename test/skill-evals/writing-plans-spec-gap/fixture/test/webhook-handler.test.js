const test = require("node:test");
const assert = require("node:assert/strict");

const { signedRequest } = require("../clients/webhook-client");
const { handleWebhook } = require("../server/webhook-handler");

test("accepts a valid signature", () => {
  const request = signedRequest("payload", "secret-a");
  assert.deepEqual(handleWebhook(request, "secret-a"), {
    status: 202,
    body: { accepted: true },
  });
});

test("maps every invalid signature to the current 401 contract", () => {
  const request = signedRequest("payload", "wrong-secret");
  assert.deepEqual(handleWebhook(request, "secret-a"), {
    status: 401,
    body: { error: "invalid_signature" },
  });
});
