const crypto = require("node:crypto");

function signedRequest(body, secret) {
  return {
    body,
    headers: {
      "x-webhook-signature": crypto.createHmac("sha256", secret).update(body).digest("hex"),
    },
  };
}

module.exports = { signedRequest };
