---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-10
---

# Current Architecture

The paper-search API calls one in-process lexical retriever. The retriever tokenizes the query, scores exact title overlap, and returns stable document IDs. Publication filtering is performed by the caller before retrieval.

The retrieval module owns no vector evidence and has no experiment-backed ranking decision.
