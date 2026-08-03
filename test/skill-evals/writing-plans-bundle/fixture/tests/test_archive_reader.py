from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from archive_reader import ExportFormatError, read_events


class ArchiveReaderTests(unittest.TestCase):
    def test_reads_plaintext_jsonl(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / "events.jsonl"
            archive.write_text('{"event_id":"e-1","kind":"created","payload":{}}\n')
            self.assertEqual("e-1", read_events(archive)[0]["event_id"])

    def test_rejects_unknown_suffix(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / "events.bin"
            archive.write_bytes(b"events")
            with self.assertRaises(ExportFormatError):
                read_events(archive)


if __name__ == "__main__":
    unittest.main()
