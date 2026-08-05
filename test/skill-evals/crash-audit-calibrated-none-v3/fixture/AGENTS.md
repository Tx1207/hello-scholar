# Project Rules

- Review the actual Git diff before making claims about scope.
- Run `python3 -B -m unittest discover -s tests` for the current formatter behavior without writing bytecode into the review tree.
- Treat `snapshots/error-output.txt` as the public output contract.
- A read-only audit must not edit, stage, or commit files.
