const { verifySignature } = require("../src/verify-signature");

function handleWebhook({ body, headers }, secret) {
  if (!verifySignature(body, headers["x-webhook-signature"], secret)) {
    return { status: 401, body: { error: "invalid_signature" } };
  }
  return { status: 202, body: { accepted: true } };
}

module.exports = { handleWebhook };
