"""Build a deterministic in-memory term index for paper titles."""


def build_term_index(titles: dict[str, str]) -> dict[str, tuple[str, ...]]:
    terms: dict[str, set[str]] = {}
    for paper_id, title in titles.items():
        for term in title.lower().split():
            terms.setdefault(term, set()).add(paper_id)
    return {
        term: tuple(sorted(paper_ids))
        for term, paper_ids in sorted(terms.items())
    }
