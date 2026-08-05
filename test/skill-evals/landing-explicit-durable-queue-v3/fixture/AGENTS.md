# Background Job Scheduler Rules

- Read the public scheduler contract, current implementation, consumer, tests, prior Takeoff thesis, and operating constraints before judging feasibility.
- Preserve FIFO within each queue, at-least-once delivery, the public `enqueue` entry point, and JSON-serializable payloads as external contracts.
- Treat local durable storage, one service owner, and the absence of an approved managed queue as current operating facts.
- Feasibility analysis is read-only and stops before design, migration planning, or implementation.
- Run `node --test` before citing current scheduler behavior.
