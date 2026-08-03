# Base-to-final Tree Evidence

- Base commit: `c869f2b86b5e541eaa5eb92e4b36794688686e68`
- Final `HEAD`: `c869f2b86b5e541eaa5eb92e4b36794688686e68`

## Committed diff: `base..HEAD`

No output.

## Index diff: `HEAD..index`

No output.

## Working-tree diff: `index..working tree`

```diff
diff --git a/hello-scholar/specs/INDEX.md b/hello-scholar/specs/INDEX.md
index 3bfc1bf..6397f8f 100644
--- a/hello-scholar/specs/INDEX.md
+++ b/hello-scholar/specs/INDEX.md
@@ -3,5 +3,5 @@
 
 | Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| search-ranking | [SPEC-001](search-ranking/SPEC-001-intent-aware-ranking/spec.md) | capability | accepted | 2 | Missing | Missing | - | Rank exact terms and semantic matches through one stable scoring contract |
+| search-ranking | [SPEC-001](search-ranking/SPEC-001-intent-aware-ranking/spec.md) | capability | accepted | 3 | Missing | Missing | - | Rank exact phrases, terms, and semantic matches through one stable scoring contract |
 | search-ranking | [SPEC-004](search-ranking/SPEC-004-result-diversity/spec.md) | capability | accepted | 1 | Missing | Missing | - | Limit repeated sources after relevance ranking |
diff --git a/hello-scholar/specs/search-ranking/INDEX.md b/hello-scholar/specs/search-ranking/INDEX.md
index 3a6131a..327bc29 100644
--- a/hello-scholar/specs/search-ranking/INDEX.md
+++ b/hello-scholar/specs/search-ranking/INDEX.md
@@ -3,5 +3,5 @@
 
 | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| [SPEC-001](SPEC-001-intent-aware-ranking/spec.md) | capability | accepted | 2 | Missing | Missing | - | Rank exact terms and semantic matches through one stable scoring contract | - |
+| [SPEC-001](SPEC-001-intent-aware-ranking/spec.md) | capability | accepted | 3 | Missing | Missing | - | Rank exact phrases, terms, and semantic matches through one stable scoring contract | - |
 | [SPEC-004](SPEC-004-result-diversity/spec.md) | capability | accepted | 1 | Missing | Missing | - | Limit repeated sources after relevance ranking | - |
diff --git a/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md b/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md
index 1831146..4bb62d8 100644
--- a/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md
+++ b/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md
@@ -6,10 +6,10 @@
 title: Intent-aware search ranking
 topic: search-ranking
 type: capability
 status: accepted
-revision: 2
-summary: Rank exact terms and semantic matches through one stable scoring contract
+revision: 3
+summary: Rank exact phrases, terms, and semantic matches through one stable scoring contract
 created: 2026-06-10
-updated: 2026-07-18
+updated: 2026-08-02
 supersedes: []
 superseded_by: null
 ---
@@ -29,23 +29,23 @@ Result diversity and pagination are owned elsewhere.
 
 ## 4. Current State
 
-Revision 2 adds an `intent_score` fallback when lexical score is below the configured threshold.
+Revision 3 prioritizes exact phrase matches over ordinary term matches and raises the semantic fallback threshold from `0.62` to `0.68`.
 
 ## 5. Target Design
 
-The ranking score is the sum of exact-term, semantic intent, and freshness components. Exact terms remain the strongest signal.
+The ranking score is the sum of exact-phrase, ordinary-term, semantic intent, and freshness components. An exact phrase match receives a higher weight than an ordinary term match. Semantic intent contributes only when its score is at least `0.68`.
 
 ## 6. Implementation Boundary
 
-Only relevance scoring and its configuration belong to this Spec.
+Only relevance scoring and its configuration belong to this Spec. Result diversity remains owned by `SPEC-004` and is unchanged.
 
 ## 7. Interfaces And Data
 
-`rank_documents(query, documents, policy)` returns document IDs ordered by descending score and stable input order for ties.
+`rank_documents` remains the public ranking entry and continues to return document IDs ordered by descending score with stable input order for ties. Its return structure is unchanged.
 
 ## 8. Invariants And Constraints
 
-The public function and return type remain stable. Scores are deterministic for the same inputs.
+The public ranking entry and return structure remain stable. Scores are deterministic for the same inputs. Exact phrase weight is greater than ordinary term weight. Semantic intent below `0.68` does not contribute to the score.
 
 ## 9. Options And Decision
 
@@ -53,7 +53,7 @@ Adopt a bounded semantic fallback instead of a semantic-only ranker.
 
 ## 10. Acceptance Criteria
 
-Exact lexical hits outrank semantic-only hits; intent fallback activates only above its threshold.
+Exact phrase hits receive more relevance weight than ordinary term hits; exact lexical hits outrank semantic-only hits; intent fallback activates only at `0.68` or above. Result diversity behavior is unchanged.
 
 ## 11. Verification
 
@@ -75,3 +75,4 @@ Restore the previous weight values and service build.
 
 - Revision 1: lexical and freshness scoring.
 - Revision 2: bounded semantic intent fallback at threshold 0.62.
+- Revision 3: exact phrase matches outrank ordinary term matches; semantic fallback threshold raised to 0.68; public ranking interface, return structure, and diversity strategy unchanged.
```

## Untracked files

```text
src/__pycache__/ranking.cpython-310.pyc
tests/__pycache__/test_ranking.cpython-310.pyc
```

These Python bytecode files were absent before the prompt and appeared after the Implementer ran an additional Python test command without the evaluator's bytecode suppression. They are preserved rather than deleted.

## Final tracked and untracked file hashes

```text
57c440ce751bb51f9e4016fd40f510d02e4bac8145d560b149cf73c89890b5c8  AGENTS.md
0c585ed829d1d7013c3fe8ed803be9a064a69509f827964d71a889110f62386c  hello-scholar/architecture.md
45abd4b3cfdf8272b4089da76e951bdcddc3007736034e4c96cb23dc621d456c  hello-scholar/specs/INDEX.md
3034440c385c828b66f8a17b46722125a9a2ac9235d16883e95b6d94ab7b4edd  hello-scholar/specs/search-ranking/INDEX.md
30216ac5e3a45fa4603a3569ef72a387c5e49a853bde3d984fde0cabbd73d359  hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md
1d9e6fe916f13ee39b32763572ec3a40bbd3aec46cd87c6c972eb181646686ec  hello-scholar/specs/search-ranking/SPEC-004-result-diversity/spec.md
0bdc135876bbebc3aae540986359e6a0133ccded09983ea0f404266756473073  src/__pycache__/ranking.cpython-310.pyc
d91409a8c9f70bdd822bb2b68ccee9393dfaa4d56b7b8b981d90e3c3296aac60  src/ranking.py
d69eb084e55dbb702adba4cb2e951e0d4c57e371d762752104b13dff55320841  tests/__pycache__/test_ranking.cpython-310.pyc
17fa99aae4dc00b93c7f6e790d38557590c8eb5e4e9ad591a90f5f19e7af08d5  tests/test_ranking.py
```
