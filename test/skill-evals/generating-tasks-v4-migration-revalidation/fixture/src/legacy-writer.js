const legacyCodec = require("../vendor/legacy-properties-codec");

function writeLegacyConfig(config) {
  return legacyCodec.stringify({
    endpoint: config.endpoint,
    retries: config.retries,
  });
}

module.exports = { writeLegacyConfig };
