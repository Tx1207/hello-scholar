const crypto = require("node:crypto");

function verifySignature(body, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const supplied = Buffer.from(signature || "", "utf8");
  const wanted = Buffer.from(expected, "utf8");
  return supplied.length === wanted.length && crypto.timingSafeEqual(supplied, wanted);
}

module.exports = { verifySignature };
