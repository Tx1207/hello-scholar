# model-config-sdk

Version 3.x exposes `loadModelConfig(value)` from the package root. It accepts both `model-config-v1.schema.json` and `model-config-v2.schema.json`; v1 support is promised for the full 3.x release line because training and evaluation workers persist these files between runs.

The normalized result has this shape:

```js
{ schemaVersion: 2, model: "research-small", limits: { maxTokens: 4096 } }
```

Consumers should not import files under `src/internal/`. Run the suite with `npm test`.
