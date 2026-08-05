from dataclasses import dataclass


@dataclass(frozen=True)
class Candidate:
    candidate_id: str
    lexical_score: float
    feature_score: float


class RankingPipeline:
    def rank(self, candidates: list[Candidate], confidence: float) -> list[str]:
        def score(candidate: Candidate) -> float:
            if confidence < 0.45:
                return candidate.lexical_score
            return candidate.lexical_score * 0.65 + candidate.feature_score * 0.35

        ranked = sorted(enumerate(candidates), key=lambda item: (-score(item[1]), item[0]))
        return [candidate.candidate_id for _, candidate in ranked]
