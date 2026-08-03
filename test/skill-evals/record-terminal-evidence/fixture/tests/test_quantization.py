from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from quantization import accuracy_drop, estimate_weight_bytes


class QuantizationTests(unittest.TestCase):
    def test_estimates_packed_weight_bytes(self) -> None:
        self.assertEqual(500, estimate_weight_bytes(1000, 4))
        self.assertEqual(1000, estimate_weight_bytes(1000, 8))

    def test_accuracy_drop_is_positive_for_regression(self) -> None:
        self.assertAlmostEqual(0.041, accuracy_drop(0.842, 0.801))


if __name__ == "__main__":
    unittest.main()
