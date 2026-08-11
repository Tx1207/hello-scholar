class PolicyEngine:
    def __init__(self, global_defaults: dict[str, bool], tenant_rules: dict[str, dict[str, bool]]) -> None:
        self._global_defaults = dict(global_defaults)
        self._tenant_rules = {tenant: dict(rules) for tenant, rules in tenant_rules.items()}

    def evaluate(self, feature: str, tenant: str) -> bool:
        tenant_rule = self._tenant_rules.get(tenant, {}).get(feature)
        if tenant_rule is not None:
            return tenant_rule
        return self._global_defaults.get(feature, False)
