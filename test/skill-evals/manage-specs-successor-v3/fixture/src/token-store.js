const crypto = require("node:crypto");

class TokenStore {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.sessions = new Map();
  }

  issue(subject, now) {
    const token = crypto.createHash("sha256").update(`${subject}:${now}`).digest("hex");
    this.sessions.set(token, { subject, expiresAt: now + this.ttlMs });
    return token;
  }

  verify(token, now) {
    const session = this.sessions.get(token);
    if (!session || session.expiresAt <= now) {
      return null;
    }
    return session.subject;
  }

  revoke(token) {
    return this.sessions.delete(token);
  }
}

module.exports = { TokenStore };
