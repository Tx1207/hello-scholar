# feature-flag-core

`feature-flag-core` is an internal Python library used by services in this repository. Its supported application entry point is:

```python
from src.feature_flags import FlagService, FlagStore
```

Flag data is stored as the current boolean map shown in `data/flags.json`. No package is published, and no class named `LegacyFlagAdapter` has been documented as a supported integration.

Run the suite with:

```text
python3 -B -m unittest discover -s tests
```
