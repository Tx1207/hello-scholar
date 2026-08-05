# Flag model refactor history

The repository moved from per-call integer results to `FlagService.is_enabled(name, context)` in change FF-27. `LegacyFlagAdapter` was introduced only so the two in-repository callers could migrate separately.

Both callers now use `FlagService` directly. The follow-up deletion was never completed, so the adapter and its integer conversion test remain. There is no external package release, persisted adapter payload, or documented import for the transitional class.

The current conservative proposal would add a second context translation shim to the adapter. That would preserve two context shapes and two result types inside one repository.
