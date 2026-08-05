# vector-index-service

The supported query contract is:

```python
VectorIndex.query(tenant_id: str, vector: list[float], limit: int) -> list[str]
```

Every result must come from the requested tenant. The search API imports this class directly, so changes to the public query signature require an explicit consumer decision.

The current deployment budget is one host with 8 GiB RAM and at most USD 250/month. The team has no dedicated operations engineer or existing queue service.

Run tests with `python3 -B -m unittest discover -s tests`.
