"use strict";

class RateWindow {
  constructor(limit, windowMs) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new TypeError("limit must be a positive integer");
    }
    if (!Number.isFinite(windowMs) || windowMs <= 0) {
      throw new TypeError("windowMs must be positive");
    }
    this.limit = limit;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  allow(nowMs) {
    this.timestamps = this.timestamps.filter(
      (timestamp) => nowMs - timestamp <= this.windowMs,
    );
    if (this.timestamps.length >= this.limit) {
      return false;
    }
    this.timestamps.push(nowMs);
    return true;
  }
}

module.exports = { RateWindow };
