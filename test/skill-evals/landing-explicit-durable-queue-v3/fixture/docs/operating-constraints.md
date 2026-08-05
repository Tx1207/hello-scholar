# Operating Constraints

- The scheduler runs as one Linux service with a persistent local volume.
- One service owner maintains the scheduler and reporting worker.
- No managed queue or additional datastore has been approved.
- A rollout must preserve the current reporting consumer and support returning to the in-memory implementation without rewriting queued payloads.
- Restart loss is the approval-changing failure in the current model; cross-region operation is outside the present objective.
