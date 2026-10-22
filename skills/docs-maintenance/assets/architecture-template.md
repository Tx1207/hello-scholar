---
schema: 1
kind: architecture
status: current
applies_to: main
updated: YYYY-MM-DD
---

# Current Architecture

## 1. System Goal

<Describe the problem the implemented project currently solves.>

## 2. Project Structure

<Locate the principal responsibilities in the project. Include directories when they help readers find their owners; avoid a complete file listing.>

## 3. Current Modules

<Explain which existing module owns each important behavior or state, how modules depend on one another, and where to verify those responsibilities.>

## 4. Current Technical Choices

<Explain adopted technical choices and the constraints or tradeoffs they address. Cite supporting code, tests, adoption evidence, or an existing Spec for important claims. Leave an unknown historical rationale unknown; do not invent a reason or create a Spec merely to fill this section.>

## 5. Key Runtime Flows

<Explain the implemented path from an important input or user action to its outcome, including ownership transitions and failure behavior needed to understand the system.>

## 6. File and Run Artifact Locations

<Record the project's actual layout: where reusable code, entry points, and experiment configs live; the data root (default `data/`) and the artifact root for large outputs (default `artifacts/`), including where any symlink points; what each `runs/<run-id>/` directory contains; and which paths are tracked in Git and which are ignored. Agents read this section to decide where new files go.>

## 7. Current Constraints

<State current performance, compatibility, security, and dependency constraints.>

## 8. Technical Debt

<List known unresolved issues.>

## 9. Design Sources

<Cite the sources supporting implemented and adopted facts. For a partially implemented Spec, identify the relevant revision and accepted implementation evidence; do not present its remaining design as current architecture.>
