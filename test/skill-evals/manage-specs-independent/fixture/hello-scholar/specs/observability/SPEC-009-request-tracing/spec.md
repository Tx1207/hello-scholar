---
schema: 1
kind: spec
id: SPEC-009
title: Retrieval request tracing
topic: observability
type: capability
status: accepted
revision: 1
summary: Correlate retrieval requests across HTTP and storage calls
created: 2026-07-20
updated: 2026-07-20
supersedes: []
superseded_by: null
---
# Retrieval Request Tracing

## Problem

Operators cannot correlate an HTTP request with its storage lookup.

## Goal

Propagate one trace ID through request logs.

## Boundary

Tracing observes routes but does not own route semantics, batch behavior, or error contracts.

## Acceptance Criteria

Every storage lookup log contains the incoming or generated trace ID.

## Revision History

- Revision 1: accepted request tracing.
