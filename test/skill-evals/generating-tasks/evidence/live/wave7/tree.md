# Base-to-final Tree Evidence

- Base commit: `5ab0cca6dd360ca0d6b1d085c529a0982354afcf`
- Final `HEAD`: `5ab0cca6dd360ca0d6b1d085c529a0982354afcf`

## Committed diff: `base..HEAD`

No output.

## Index diff: `HEAD..index`

No output.

## Working-tree diff: `index..working tree`

```diff
diff --git a/hello-scholar/specs/INDEX.md b/hello-scholar/specs/INDEX.md
index 370f334..5241a71 100644
--- a/hello-scholar/specs/INDEX.md
+++ b/hello-scholar/specs/INDEX.md
@@ -3,4 +3,4 @@
 
 | Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| feature-policy | [SPEC-003](feature-policy/SPEC-003-policy-precedence/spec.md) | capability | accepted | 2 | [Current](feature-policy/SPEC-003-policy-precedence/plan.md) | Missing | - | Evaluate explicit deny tenant allow and global default in one deterministic order |
+| feature-policy | [SPEC-003](feature-policy/SPEC-003-policy-precedence/spec.md) | capability | accepted | 2 | [Current](feature-policy/SPEC-003-policy-precedence/plan.md) | [Current](feature-policy/SPEC-003-policy-precedence/tasks.md) | 0/6 (0%) | Evaluate explicit deny tenant allow and global default in one deterministic order |
diff --git a/hello-scholar/specs/feature-policy/INDEX.md b/hello-scholar/specs/feature-policy/INDEX.md
index 2b3d11d..f56ad0e 100644
--- a/hello-scholar/specs/feature-policy/INDEX.md
+++ b/hello-scholar/specs/feature-policy/INDEX.md
@@ -3,4 +3,4 @@
 
 | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| [SPEC-003](SPEC-003-policy-precedence/spec.md) | capability | accepted | 2 | [Current](SPEC-003-policy-precedence/plan.md) | Missing | - | Evaluate explicit deny tenant allow and global default in one deterministic order | - |
+| [SPEC-003](SPEC-003-policy-precedence/spec.md) | capability | accepted | 2 | [Current](SPEC-003-policy-precedence/plan.md) | [Current](SPEC-003-policy-precedence/tasks.md) | 0/6 (0%) | Evaluate explicit deny tenant allow and global default in one deterministic order | - |
```

The project changes are the two CLI-generated Indexes and the untracked Tasks document. Two untracked bytecode files were also present under denied source and test prefixes.

## Untracked files

```text
hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md
src/__pycache__/policy.cpython-310.pyc
tests/__pycache__/test_policy.cpython-310.pyc
```

## Final tracked and untracked file hashes

```text
fb1d480f00d488cfb28bc1c6765983070d44ba48632a344ba926a77590a1ecdb  AGENTS.md
caa22e479fccdb673fb42615d8d4e3b0b78c61fa48a00494b7fb07cf57458495  hello-scholar/architecture.md
ed7a6a54b39bae994b51b9d766ba4d25b889a8a6e5b17cb64f12a43aab9ea8d5  hello-scholar/specs/INDEX.md
0d96569cfbca29fcb8f2ae48594946ec46e1dcdd4cffffa3fe0b161918d27956  hello-scholar/specs/feature-policy/INDEX.md
9ee1b2c6522ea4f8983572b5cb06cd6e6a61e81d4066892991aa7c42eaa2b845  hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/plan.md
1499b9071eb14db8489ae0c2d9f1866c728525236e248febab98021d4189ba9c  hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/spec.md
9ace522e5603fc7d44ebcdffc3942c576a9f671ec3af337377d40f13ae000366  hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md
0d7b43b992e4d7d60b7b3baefba89e5b21a491ab72ba790d2baf32fe63d535cf  src/__pycache__/policy.cpython-310.pyc
fe4caca2ac9af6cfcc2a3d58e1797ae5a4124fd25206454cae706a632d7959ef  src/policy.py
370a62d834be02f6db863020b0a0618b72228a5c2daa080e5374f7e7f68c26a4  tests/__pycache__/test_policy.cpython-310.pyc
33982f7c9a501144a2a7994f699bd56ead448b440294bb2ede75d304c6dea7ae  tests/test_policy.py
```
