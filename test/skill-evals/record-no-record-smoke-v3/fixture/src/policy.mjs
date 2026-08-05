export function parsePolicy(text) {
  const policy = JSON.parse(text);
  if (policy.version !== 1 || !Array.isArray(policy.rules) || policy.rules.length === 0) {
    throw new Error("policy requires version 1 and at least one rule");
  }
  for (const rule of policy.rules) {
    if (
      !rule ||
      !["allow", "deny"].includes(rule.kind) ||
      typeof rule.pattern !== "string" ||
      rule.pattern.length === 0
    ) {
      throw new Error("policy rules require a kind and pattern");
    }
  }
  return { ruleCount: policy.rules.length };
}
