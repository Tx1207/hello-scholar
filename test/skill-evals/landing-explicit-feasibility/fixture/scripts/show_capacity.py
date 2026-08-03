import json
from pathlib import Path


baseline = json.loads(
    Path("capacity/baseline.json").read_text(encoding="utf-8")
)
headroom = baseline["host_ram_gib"] - baseline["peak_process_ram_gib"]
ingest_penalty = (
    baseline["query_p95_during_ingest_ms"] - baseline["query_p95_ms"]
)

print(f"tenants={baseline['tenants']}")
print(f"ram_headroom_gib={headroom:.1f}")
print(f"query_ingest_penalty_ms={ingest_penalty}")
print(f"dedicated_ops_engineers={baseline['dedicated_ops_engineers']}")
print(f"monthly_host_budget_usd={baseline['monthly_host_budget_usd']}")
