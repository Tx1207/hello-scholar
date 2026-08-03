# Base-to-final Tree Evidence

- Base commit: `0dd8cf3d53b14a5833bf3807dce5948b3c30abee`
- Final `HEAD`: `0dd8cf3d53b14a5833bf3807dce5948b3c30abee`

## Committed diff: `base..HEAD`

No output.

## Index diff: `HEAD..index`

No output.

## Working-tree diff: `index..working tree`

```diff
diff --git a/hello-scholar/specs/INDEX.md b/hello-scholar/specs/INDEX.md
index 73f1e8c..18dafcb 100644
--- a/hello-scholar/specs/INDEX.md
+++ b/hello-scholar/specs/INDEX.md
@@ -3,5 +3,6 @@
 | Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| session-auth | [SPEC-005](session-auth/SPEC-005-opaque-session-tokens/spec.md) | system-design | accepted | 2 | Missing | Missing | - | Issue random opaque tokens resolved through a revocable server-side store |
+| session-auth | [SPEC-005](session-auth/SPEC-005-opaque-session-tokens/spec.md) | system-design | accepted | 3 | Missing | Missing | - | Issue random opaque tokens resolved through a revocable server-side store |
 | session-auth | [SPEC-011](session-auth/SPEC-011-session-audit-events/spec.md) | capability | accepted | 1 | Missing | Missing | - | Emit stable security events for session issue verify revoke and expiry outcomes |
+| session-auth | [SPEC-012](session-auth/SPEC-012-signed-stateless-session-tokens/spec.md) | system-design | draft | 1 | Missing | Missing | - | Issue signed session tokens containing kid, sub, iat, and exp without token-store lookup |
diff --git a/hello-scholar/specs/session-auth/INDEX.md b/hello-scholar/specs/session-auth/INDEX.md
index dd0d26d..cc363c4 100644
--- a/hello-scholar/specs/session-auth/INDEX.md
+++ b/hello-scholar/specs/session-auth/INDEX.md
@@ -3,5 +3,6 @@
 | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| [SPEC-005](SPEC-005-opaque-session-tokens/spec.md) | system-design | accepted | 2 | Missing | Missing | - | Issue random opaque tokens resolved through a revocable server-side store | - |
+| [SPEC-005](SPEC-005-opaque-session-tokens/spec.md) | system-design | accepted | 3 | Missing | Missing | - | Issue random opaque tokens resolved through a revocable server-side store | superseded by [SPEC-012](SPEC-012-signed-stateless-session-tokens/spec.md) |
 | [SPEC-011](SPEC-011-session-audit-events/spec.md) | capability | accepted | 1 | Missing | Missing | - | Emit stable security events for session issue verify revoke and expiry outcomes | - |
+| [SPEC-012](SPEC-012-signed-stateless-session-tokens/spec.md) | system-design | draft | 1 | Missing | Missing | - | Issue signed session tokens containing kid, sub, iat, and exp without token-store lookup | supersedes [SPEC-005](SPEC-005-opaque-session-tokens/spec.md) |
diff --git a/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md b/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md
index 1e17d7a..75a8aa8 100644
--- a/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md
+++ b/hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md
@@ -6,12 +6,12 @@
 status: accepted
-revision: 2
+revision: 3
 summary: Issue random opaque tokens resolved through a revocable server-side store
 created: 2026-05-08
-updated: 2026-07-10
+updated: 2026-08-02
 supersedes: []
-superseded_by: null
+superseded_by: SPEC-012
 ---
@@ -75,3 +75,4 @@ Deploy the previous token-store build while preserving stored sessions.
 - Revision 1: opaque issuance and verification.
 - Revision 2: explicit expiry and immediate deletion semantics.
+- Revision 3: superseded by SPEC-012 signed stateless session tokens.
```

## Untracked files

```text
hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md
```

## Final tracked and untracked file hashes

```text
29d93a34fbd5d2cbd805a9eb750d23280b382c817ca7f4da70eb06f02cde4f6b  AGENTS.md
f6209979f14131ed52869c25f3e8f05b0211a03ebe574f38193484f9485acc36  hello-scholar/architecture.md
40c65caab6a9c5b4eb8f7a633c21b48c06887ade7fc7e26c8f7dae5e85fb3f82  hello-scholar/specs/INDEX.md
a2ac295ebdccd3268946c2ba37dd5e8205e52ed2834d606dd035572c81207214  hello-scholar/specs/session-auth/INDEX.md
b7036d92fe20c8ae9cddb8019d4f73a350ba7ad9cd2315cc1994a99fd83582e6  hello-scholar/specs/session-auth/SPEC-005-opaque-session-tokens/spec.md
2274c2a4fa4d9e58b1fb1c085a8e64d8a2aee1cedfd8d6cbd6a9d7764c7b7aa0  hello-scholar/specs/session-auth/SPEC-011-session-audit-events/spec.md
551ecf319ae94b23e16bc10b4f278816b74dbab1a332ec8b69501c50499e1b9a  hello-scholar/specs/session-auth/SPEC-012-signed-stateless-session-tokens/spec.md
66e61cf69df3fec5c68f771bab45e0857ecbf05e1eb0d88633ecf74ecb8e991a  package.json
b2e2a7ccacfec0d342466e9a83e72601f8ab9735b0af5a983b01bad52f368334  src/token-store.js
0a2dd1986501af1f2a586e258b4d7834d7b78f9040ce2ca57526bf6531a92933  test/token-store.test.js
```
