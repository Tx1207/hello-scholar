# config-migrate

`config-migrate inspect <path>` reads version 1 and version 2 project configuration files and prints the normalized version 2 view without changing the source file.

The 2.x release line continues to accept persisted version 1 files. Removing version 1 reads requires a major release and a documented migration path because projects may keep these files outside the repository.

Run the test suite with:

```text
npm test
```
