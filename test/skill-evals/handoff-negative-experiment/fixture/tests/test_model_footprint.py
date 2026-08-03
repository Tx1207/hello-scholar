from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from model_footprint import estimate_peak_bytes, estimate_weight_bytes


class ModelFootprintTests(unittest.TestCase):
    def test_weight_estimate_uses_quantization_bits(self) -> None:
        self.assertEqual(500, estimate_weight_bytes(1000, 4))
        self.assertEqual(1000, estimate_weight_bytes(1000, 8))

    def test_peak_estimate_includes_batch_activations(self) -> None:
        self.assertGreater(
            estimate_peak_bytes(1000, 8, 2),
            estimate_peak_bytes(1000, 8, 1),
        )

    def test_rejects_invalid_inputs(self) -> None:
        with self.assertRaises(ValueError):
            estimate_weight_bytes(0, 8)
        with self.assertRaises(ValueError):
            estimate_peak_bytes(1000, 8, 0)


if __name__ == "__main__":
    unittest.main()
