# background-job-scheduler

The public scheduler entry point is `Scheduler.enqueue(queue, payload)`. A queue leases jobs in FIFO order and provides at-least-once delivery: an unacknowledged job may be delivered again after `fail(jobId)`.

The reporting worker relies on the public enqueue method and does not read scheduler internals. Payloads must be JSON-serializable.

Run the suite with `npm test`.
