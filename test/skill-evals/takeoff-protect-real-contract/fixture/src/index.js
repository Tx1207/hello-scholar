"use strict";

const { LegacyModelConfig } = require("./internal/legacy-model");

function loadModelConfig(value) {
  if (value.schema_version === 1) {
    return new LegacyModelConfig(value).toCurrent();
  }
  if (value.schemaVersion === 2) {
    return {
      schemaVersion: 2,
      model: value.model,
      limits: { maxTokens: value.limits.maxTokens },
    };
  }
  throw new Error("unsupported model config schema version");
}

module.exports = { loadModelConfig };
