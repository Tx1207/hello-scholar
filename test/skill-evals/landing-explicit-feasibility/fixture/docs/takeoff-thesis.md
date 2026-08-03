# Prior Takeoff direction

## Thesis

Replace the request-local synchronous index with a multi-tenant asynchronous indexing service: tenant isolation is a non-negotiable data boundary, writes enter a bounded ingestion contract, and the existing query API remains the consumer-facing surface. Treat cross-region replicas as a possible resilience capability, not as proof that the first landed shape is viable.

## Old model and trap

The old model assumes a single shared process can own ingestion, querying, recovery, and every tenant's memory. Keeping that shape solely because it is simple to deploy would make ingestion spikes and process failure global.

## Directional options

- Conservative: tune the synchronous process; lowest operational cost, but shared failure and write/query contention remain.
- Clean target: isolated tenant partitions behind an asynchronous write boundary; largest product and reliability gain, but queue and recovery semantics must be real.
- Expanded target: add cross-region replication immediately; greater theoretical resilience with substantial operational and consistency cost.

## First proof and falsifier

First proof question: can a bounded single-host prototype isolate one tenant's ingest burst while preserving query latency and memory limits for another? Falsifier: if isolation needs more memory or operational ownership than the stated budget can sustain, the service boundary or isolation granularity must be revised.

## Payoff

The direction pays for explicit queue/recovery semantics to remove request-path ingestion stalls and reduce cross-tenant blast radius. The payoff is visible only when a measured ingest burst no longer degrades another tenant's query behavior.
