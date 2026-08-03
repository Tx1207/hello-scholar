class CachePolicy {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new TypeError("capacity must be a positive integer");
    }
    this.capacity = capacity;
    this.entries = new Map();
  }

  get(key) {
    if (!this.entries.has(key)) {
      return undefined;
    }
    const value = this.entries.get(key);
    this.entries.delete(key);
    this.entries.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.entries.has(key)) {
      this.entries.delete(key);
    }
    this.entries.set(key, value);
    if (this.entries.size <= this.capacity) {
      return null;
    }
    const evicted = this.entries.keys().next().value;
    this.entries.delete(evicted);
    return evicted;
  }
}

module.exports = { CachePolicy };
