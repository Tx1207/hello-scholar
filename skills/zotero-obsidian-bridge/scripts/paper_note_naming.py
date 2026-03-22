#!/usr/bin/env python3
"""Shared helpers for canonical Obsidian paper-note filenames."""

from __future__ import annotations

from dataclasses import dataclass
import re
import unicodedata

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
STOPWORDS = {
    "a",
    "an",
    "and",
    "as",
    "at",
    "by",
    "for",
    "from",
    "in",
    "into",
    "of",
    "on",
    "or",
    "over",
    "the",
    "to",
    "under",
    "with",
}
TOKEN_RE = re.compile(r"[A-Za-z0-9]+")
MAX_SHORT_TITLE_TOKENS = 8


@dataclass(frozen=True)
class NoteMetadata:
    title: str
    authors: tuple[str, ...]
    year: str


def extract_frontmatter(text: str) -> str:
    match = FRONTMATTER_RE.match(text)
    return match.group(1) if match else ""


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def _normalize_ascii(value: str) -> str:
    return unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")


def _parse_scalar(frontmatter: str, field: str) -> str | None:
    pattern = re.compile(rf"^{re.escape(field)}:\s*(.+)$", re.MULTILINE)
    match = pattern.search(frontmatter)
    if not match:
        return None
    return _strip_quotes(match.group(1))


def _parse_authors(frontmatter: str) -> tuple[str, ...]:
    authors: list[str] = []
    capture = False

    for line in frontmatter.splitlines():
        if capture:
            match = re.match(r"^\s*-\s+(.*)$", line)
            if match:
                authors.append(_strip_quotes(match.group(1)))
                continue
            if line.startswith(" ") or line.startswith("\t"):
                continue
            break

        if re.match(r"^authors:\s*$", line):
            capture = True

    return tuple(author for author in authors if author)


def parse_note_metadata(text: str) -> NoteMetadata | None:
    frontmatter = extract_frontmatter(text)
    if not frontmatter:
        return None

    title = _parse_scalar(frontmatter, "title")
    year = _parse_scalar(frontmatter, "year")
    authors = _parse_authors(frontmatter)

    if not title or not year or not authors:
        return None

    return NoteMetadata(title=title, authors=authors, year=year)


def _format_token(token: str) -> str:
    if token.islower():
        return token.capitalize()
    return token


def _tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall(_normalize_ascii(text))


def _significant_tokens(text: str) -> list[str]:
    tokens = _tokenize(text)
    significant = [
        _format_token(token)
        for token in tokens
        if token.lower() not in STOPWORDS or token.isupper() or any(ch.isdigit() for ch in token)
    ]
    if significant:
        return significant[:MAX_SHORT_TITLE_TOKENS]
    return [_format_token(token) for token in tokens[:MAX_SHORT_TITLE_TOKENS]]


def first_author_surname(authors: tuple[str, ...]) -> str:
    author = _normalize_ascii(authors[0]).strip()
    surname_part = author.split(",", 1)[0] if "," in author else author.split()[-1]
    tokens = _tokenize(surname_part)
    if not tokens:
        tokens = _tokenize(author)
    if not tokens:
        return "UnknownAuthor"
    return "".join(_format_token(token) for token in tokens)


def short_title_tokens(title: str) -> list[str]:
    if ":" in title:
        prefix, _suffix = title.split(":", 1)
        prefix_tokens = _significant_tokens(prefix)
        if 1 <= len(prefix_tokens) <= 5:
            return prefix_tokens
    return _significant_tokens(title)


def canonical_note_stem(metadata: NoteMetadata) -> str:
    year_match = re.search(r"\d{4}", metadata.year)
    year = year_match.group(0) if year_match else "Undated"
    parts = [first_author_surname(metadata.authors), year, *short_title_tokens(metadata.title)]
    return "-".join(part for part in parts if part)


def canonical_filename(metadata: NoteMetadata) -> str:
    return f"{canonical_note_stem(metadata)}.md"


def canonical_filename_from_text(text: str) -> str | None:
    metadata = parse_note_metadata(text)
    if metadata is None:
        return None
    return canonical_filename(metadata)
