"use strict";

class PolicyInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "PolicyInputError";
    this.code = "invalid_request";
  }
}

function normalizeLegacyPolicy(policy) {
  return {
    defaultAllow: Boolean(policy.defaultAllow),
    rules: Array.isArray(policy.rules) ? policy.rules : [],
  };
}

function authorize(request, policy, options = {}) {
  if (!request || typeof request.actorId !== "string" || request.actorId === "") {
    throw new PolicyInputError("actorId is required");
  }

  const normalized = normalizeLegacyPolicy(policy);
  const matched = normalized.rules.find((rule) =>
    rule.actorRole === request.actorRole && rule.resource === request.resource
  );
  let allowed = matched ? matched.effect === "allow" : normalized.defaultAllow;
  if (options.shadowMode && !allowed) {
    allowed = true;
  }

  return {
    allowed,
    reason: matched ? `matched:${matched.id}` : "default",
    matchedRuleId: matched ? matched.id : null,
  };
}

module.exports = { PolicyInputError, authorize, normalizeLegacyPolicy };
