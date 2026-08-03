#!/usr/bin/env python3
"""Static guards for function contract comments owned by this upgrade."""

from __future__ import annotations

import ast
from pathlib import Path
import re
import unittest


REPO_ROOT = Path(__file__).resolve().parents[1]
PYTHON_OWNER_FILES = tuple(
    Path(value)
    for value in (
        "test/skill_eval_contract.py",
        "test/test_eval_proposal_batch.py",
        "test/test_no_systematic_debugging_skill.py",
        "test/test_skill_eval_contract.py",
    )
)
JAVASCRIPT_OWNER_FILES = tuple(
    Path(value)
    for value in (
        "src/frontmatter.js",
        "src/document-discovery.js",
        "src/document-validation.js",
        "src/index-generator.js",
        "src/docs.js",
        "src/cli.js",
        "src/fs-ops.js",
        "test/test_cli_docs.js",
        "test/test_document_discovery.js",
        "test/test_document_validation.js",
        "test/test_frontmatter.js",
        "test/test_index_generator.js",
    )
)
REQUIRED_MARKERS = ("Purpose:", "Input:", "Output:")
JAVASCRIPT_FUNCTION_HEADER = re.compile(
    r"(?m)^[ \t]*(?:async[ \t]+)?function[ \t]+"
    r"(?P<name>[A-Za-z_$][A-Za-z0-9_$]*)[ \t]*\([^)]*\)[ \t]*\{"
)
JAVASCRIPT_CONSTRUCTOR_HEADER = re.compile(
    r"(?m)^[ \t]*(?P<name>constructor)[ \t]*\([^)]*\)[ \t]*\{"
)
JAVASCRIPT_METHOD_HEADER = re.compile(
    r"(?m)^[ \t]+(?!(?:if|for|while|switch|catch|with|constructor)\b)"
    r"(?P<name>[A-Za-z_$][A-Za-z0-9_$]*)[ \t]*\([^\r\n)]*\)[ \t]*\{"
)
JAVASCRIPT_ARROW_HEADER = re.compile(
    r"(?m)^[ \t]*(?:const|let|var)[ \t]+"
    r"(?P<name>[A-Za-z_$][A-Za-z0-9_$]*)[ \t]*=[ \t]*"
    r"(?:async[ \t]+)?(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)[ \t]*=>"
)


class FunctionContractCommentTests(unittest.TestCase):
    def test_python_owner_functions_start_with_contract_docstrings(self) -> None:
        """Purpose: enforce Python function contracts in owner files; Input: repository source files; Output: none; Errors: assertion failures identify missing fields."""
        for relative_path in PYTHON_OWNER_FILES:
            source_path = REPO_ROOT / relative_path
            tree = ast.parse(source_path.read_text(encoding="utf-8"), source_path)
            functions = [
                node
                for node in ast.walk(tree)
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
                and not node.name.startswith("test_")
            ]
            self.assertTrue(functions, f"{relative_path}: expected owner functions")
            for function in functions:
                with self.subTest(path=relative_path, function=function.name):
                    docstring = ast.get_docstring(function, clean=False)
                    self.assertIsNotNone(
                        docstring,
                        f"{relative_path}:{function.lineno} {function.name} must start with a contract docstring",
                    )
                    for marker in REQUIRED_MARKERS:
                        self.assertIn(
                            marker,
                            docstring,
                            f"{relative_path}:{function.lineno} {function.name} is missing {marker}",
                        )

    def test_javascript_owner_functions_start_with_contract_comments(self) -> None:
        """Purpose: enforce JavaScript function contracts in owner files; Input: repository source files; Output: none; Errors: assertion failures identify expression bodies or missing fields."""
        for relative_path in JAVASCRIPT_OWNER_FILES:
            source = (REPO_ROOT / relative_path).read_text(encoding="utf-8")
            declarations: list[tuple[str, int, int]] = []
            for pattern in (
                JAVASCRIPT_FUNCTION_HEADER,
                JAVASCRIPT_CONSTRUCTOR_HEADER,
                JAVASCRIPT_METHOD_HEADER,
            ):
                declarations.extend(
                    (match.group("name"), match.start(), match.end())
                    for match in pattern.finditer(source)
                )
            for match in JAVASCRIPT_ARROW_HEADER.finditer(source):
                body_start = match.end()
                while body_start < len(source) and source[body_start] in " \t":
                    body_start += 1
                self.assertLess(
                    body_start,
                    len(source),
                    f"{relative_path}: {match.group('name')} has no arrow body",
                )
                self.assertEqual(
                    source[body_start],
                    "{",
                    f"{relative_path}: {match.group('name')} needs a block body so its contract is the first body comment",
                )
                declarations.append((match.group("name"), match.start(), body_start + 1))

            self.assertTrue(declarations, f"{relative_path}: expected owner functions")
            for name, declaration_start, body_start in declarations:
                line_number = source.count("\n", 0, declaration_start) + 1
                first_line = re.match(r"\r?\n([^\r\n]*)", source[body_start:])
                with self.subTest(path=relative_path, function=name):
                    self.assertIsNotNone(
                        first_line,
                        f"{relative_path}:{line_number} {name} contract must be on the first body line",
                    )
                    comment = first_line.group(1).strip()
                    self.assertTrue(
                        comment.startswith("//"),
                        f"{relative_path}:{line_number} {name} must start with a contract comment",
                    )
                    for marker in REQUIRED_MARKERS:
                        self.assertIn(
                            marker,
                            comment,
                            f"{relative_path}:{line_number} {name} is missing {marker}",
                        )


if __name__ == "__main__":
    unittest.main()
