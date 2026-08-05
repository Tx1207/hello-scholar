"""Estimate quantized model memory without loading model weights."""


def estimate_weight_bytes(parameter_count: int, bits: int) -> int:
    if parameter_count <= 0:
        raise ValueError("parameter_count must be positive")
    if bits not in {4, 8, 16}:
        raise ValueError("bits must be one of 4, 8, or 16")
    return (parameter_count * bits + 7) // 8


def estimate_peak_bytes(parameter_count: int, bits: int, batch_size: int) -> int:
    if batch_size <= 0:
        raise ValueError("batch_size must be positive")
    weights = estimate_weight_bytes(parameter_count, bits)
    activation_bytes = batch_size * 64 * 1024 * 1024
    return weights + activation_bytes
