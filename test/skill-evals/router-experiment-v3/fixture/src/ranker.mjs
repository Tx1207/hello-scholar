export function rankCandidates(queryTerms, candidates) {
  const wanted = new Set(queryTerms);
  return candidates
    .map((candidate) => ({
      id: candidate.id,
      score: candidate.terms.filter((term) => wanted.has(term)).length,
    }))
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
}
