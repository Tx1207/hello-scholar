# Config Upgrader

The CLI upgrades a version-1 JSON service config to version 2 on stdout. Unknown top-level keys must be rejected rather than silently discarded because a misspelled safety option could otherwise vanish during migration.
