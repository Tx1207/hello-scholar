# Base-to-final Tree Evidence

- Base commit: `caaeee712879aedb076e9f528489d503b64919f6`
- Final `HEAD`: `caaeee712879aedb076e9f528489d503b64919f6`

## Committed diff: `base..HEAD`

No output.

## Index diff: `HEAD..index`

No output.

## Working-tree diff: `index..working tree`

```diff
diff --git a/formatter.py b/formatter.py
index a4f67af..045ccda 100644
--- a/formatter.py
+++ b/formatter.py
@@ -1,4 +1,4 @@
 def format_invalid_token(token: str, column: int) -> str:
     if column < 1:
         raise ValueError("column must be positive")
-    return f"Bad token {token!r} at {column}"
+    return f"Invalid token {token!r} at column {column}"
diff --git a/snapshots/error-output.txt b/snapshots/error-output.txt
index 0ce57db..45410d3 100644
--- a/snapshots/error-output.txt
+++ b/snapshots/error-output.txt
@@ -1 +1 @@
-Bad token '@' at 7
+Invalid token '@' at column 7
diff --git a/tests/test_formatter.py b/tests/test_formatter.py
index 4a80eda..c7ac146 100644
--- a/tests/test_formatter.py
+++ b/tests/test_formatter.py
@@ -5,7 +5,7 @@ from formatter import format_invalid_token
 
 class FormatterTests(unittest.TestCase):
     def test_formats_invalid_token_for_cli_users(self):
-        self.assertEqual("Bad token '@' at 7", format_invalid_token("@", 7))
+        self.assertEqual("Invalid token '@' at column 7", format_invalid_token("@", 7))
 
     def test_rejects_non_positive_columns(self):
         with self.assertRaisesRegex(ValueError, "column must be positive"):
```

## Untracked files

No output.

## Final tracked and untracked file hashes

```text
4165f604dabfc30e34a7c38a12adb83986e5a32c5acc640da3452fd95433401d  AGENTS.md
132a3c9763c8707bb3857b3aa640c1462faeb557d08b68eb8b8294f73610c69d  README.md
738016a15bd1af096bad6f1a8d3d4f5b5e92e079ed974fd604e469d256f1e46b  formatter.py
98413079ac99cb5d60ed5e39d56e7645f9d7c81d0d76641ed828e08697fefad5  scripts/prepare_review.py
5e48573e6cc75e0de0e13b1b7cf98e24b2e52cb3eb0b70c2fb9e7d308b3b3f34  snapshots/error-output.txt
11282b2b37c62e42d87988dbe58b3114e4c6221d41a1cf392b293c99ceae68ab  tests/test_formatter.py
```
