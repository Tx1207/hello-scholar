# Prior Takeoff output

## Thesis

Move from process-owned mutable queues to an append-only job log with leased workers, while preserving the documented enqueue surface, FIFO within a queue, and at-least-once delivery. Confidence: medium, because restart and throughput evidence is still local.

## The Trap

The in-memory array is implementation inertia; the public enqueue and delivery semantics are real consumer contracts.

## High-格局 Direction

Make durable job state the source of truth and workers disposable consumers. Delete direct ownership of job lifetime by one scheduler process, but keep queue ordering and explicit acknowledgement semantics.

## Frame-Opening Move

Zero-Legacy Thought Experiment: without the current arrays, the natural model is a log plus leases, not a larger in-process queue object.

## Bold Takes

- Delete process memory as the authoritative job record.
- Preserve public enqueue, FIFO per queue, and at-least-once behavior.
- Separate worker availability from job durability.

## Options

| Route | Verdict | Why | Tradeoff |
|---|---|---|---|
| Conservative path | weak | smaller change | restart loss remains |
| Clean target | strongest model | durable jobs and replaceable workers | persistence and lease semantics become explicit |
| Staged clean path | evidence-sensitive | can validate the log model | temporary migration boundary must not become permanent dual-write |

## What Not To Do

Do not hide the same in-memory ownership behind a queue adapter or rename retry state without changing its source of truth.

## First Proof Point

Can a worker crash after lease and still cause the same job to be redelivered without reordering the rest of its queue?

## Falsifier

If the documented FIFO contract requires global ordering across every queue, the proposed partitioned log model must be reconsidered.

## Payoff Ledger

Explicit persistence and lease costs buy restart recovery and independently replaceable workers; the payoff is visible when a killed worker no longer loses its job. Keeping the public enqueue boundary avoids forcing the reporting consumer to understand storage.

## Next Move

Should we route this thesis to Landing for feasibility pressure, or keep reviewing the direction?
