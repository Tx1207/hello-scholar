"use strict";

const { authorize } = require("./access-policy");

function previewPolicy(requests, policy) {
  return requests.map((request) => authorize(request, policy, { shadowMode: true }));
}

module.exports = { previewPolicy };
