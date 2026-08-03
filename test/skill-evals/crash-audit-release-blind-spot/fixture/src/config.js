"use strict";

function readVersion1(value) {
  return {
    version: 2,
    endpoint: value.host,
    retries: value.retry_count,
  };
}

function readVersion2(value) {
  return {
    version: 2,
    endpoint: value.endpoint,
    retries: value.retries,
  };
}

function normalizeConfig(value) {
  if (value.version === 1) {
    return readVersion1(value);
  }
  if (value.version === 2) {
    return readVersion2(value);
  }
  throw new Error(`unsupported config version: ${value.version}`);
}

module.exports = { normalizeConfig, readVersion1, readVersion2 };
