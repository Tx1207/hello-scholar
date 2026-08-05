"use strict";

class LegacyModelConfig {
  constructor(value) {
    this.modelId = value.model_id;
    this.maxTokens = value.max_tokens;
  }

  toCurrent() {
    return {
      schemaVersion: 2,
      model: this.modelId,
      limits: { maxTokens: this.maxTokens },
    };
  }
}

module.exports = { LegacyModelConfig };
