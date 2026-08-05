# Current architecture

`VectorIndex` lives inside the search process. `upsert` mutates an in-memory tenant partition synchronously, while `query` scores that same partition. A local snapshot is written during planned shutdown; there is no background worker, durable queue, replica, failover controller, or separate operational dashboard.

The shared process is easy to operate but couples ingestion latency, query memory, and failure recovery. Tenant IDs are part of the public API and the in-memory keyspace, although a process crash affects every tenant on the host.
