# Error message formatter

This package formats tokenizer errors for command-line users. The exact public message is captured in `snapshots/error-output.txt` and verified by the test suite.

The formatter has no persistence, network, migration, plugin, or compatibility layer. Run all tests with:

```text
python3 -B -m unittest discover -s tests
```
