"use strict";

function buildCacheKey(namespace, value) {
  if (typeof namespace !== "string" || namespace.length === 0) {
    throw new TypeError("namespace must be a non-empty string");
  }
  return `${namespace}:${JSON.stringify(value)}`;
}

module.exports = { buildCacheKey };
