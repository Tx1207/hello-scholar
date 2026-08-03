# Current Query Service

`QueryService.query(text)` validates one string and delegates directly to the search adapter. The transport layer owns HTTP request parsing and maps service errors to status codes. There is no batch contract, request-size limit, partial-failure policy, or concurrency policy today.

The single-query entry point has production callers and must remain compatible. This file describes current behavior only; it is not an approved design for the requested batch API.
