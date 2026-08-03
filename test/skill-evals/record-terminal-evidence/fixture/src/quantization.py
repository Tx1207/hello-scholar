def estimate_weight_bytes(parameter_count: int, bits: int) -> int:
    if parameter_count < 0 or bits not in {4, 8, 16, 32}:
        raise ValueError("invalid quantization inputs")
    return (parameter_count * bits + 7) // 8


def accuracy_drop(baseline: float, candidate: float) -> float:
    if not 0 <= candidate <= baseline <= 1:
        raise ValueError("accuracy values must be ordered probabilities")
    return baseline - candidate
