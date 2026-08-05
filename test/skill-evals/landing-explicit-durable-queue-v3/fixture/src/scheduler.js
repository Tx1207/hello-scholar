"use strict";

class Scheduler {
  constructor() {
    this.queues = new Map();
    this.leased = new Map();
    this.nextId = 1;
  }

  enqueue(queue, payload) {
    JSON.stringify(payload);
    const job = { id: `job-${this.nextId++}`, queue, payload, attempts: 0 };
    const pending = this.queues.get(queue) || [];
    pending.push(job);
    this.queues.set(queue, pending);
    return job.id;
  }

  lease(queue) {
    const pending = this.queues.get(queue) || [];
    const job = pending.shift() || null;
    if (job) {
      job.attempts += 1;
      this.leased.set(job.id, job);
    }
    return job;
  }

  ack(jobId) {
    return this.leased.delete(jobId);
  }

  fail(jobId) {
    const job = this.leased.get(jobId);
    if (!job) {
      return false;
    }
    this.leased.delete(jobId);
    const pending = this.queues.get(job.queue) || [];
    pending.unshift(job);
    this.queues.set(job.queue, pending);
    return true;
  }
}

module.exports = { Scheduler };
