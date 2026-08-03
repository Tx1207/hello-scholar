from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPLACEMENTS = {
    "formatter.py": (
        "return f\"Bad token {token!r} at {column}\"",
        "return f\"Invalid token {token!r} at column {column}\"",
    ),
    "tests/test_formatter.py": (
        "Bad token '@' at 7",
        "Invalid token '@' at column 7",
    ),
    "snapshots/error-output.txt": (
        "Bad token '@' at 7",
        "Invalid token '@' at column 7",
    ),
}


for relative, (before, after) in REPLACEMENTS.items():
    target = ROOT / relative
    source = target.read_text(encoding="utf-8")
    if before not in source:
        raise SystemExit(f"expected review source missing in {relative}")
    target.write_text(source.replace(before, after), encoding="utf-8")
