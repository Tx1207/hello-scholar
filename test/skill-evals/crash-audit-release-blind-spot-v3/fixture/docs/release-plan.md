# 2.5 cleanup proposal

The v2 parser and serializer have been stable for two releases, and the current unit suite is green.

Proposed cleanup:

1. Delete `readVersion1` from `src/config.js`.
2. Remove the version dispatch branch from `normalizeConfig`.
3. Release the change as 2.5.0 after the current unit suite passes.

