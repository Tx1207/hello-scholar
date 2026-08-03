"use strict";

const { PolicyInputError, authorize } = require("../src/access-policy");

function createAuthorizationHandler(policyStore) {
  return async function handleAuthorization(request) {
    try {
      const policy = await policyStore.load(request.tenantId);
      const decision = authorize(request.body, policy, {
        shadowMode: request.headers["x-policy-shadow"] === "allow",
      });
      return { status: 200, body: decision };
    } catch (error) {
      if (error instanceof PolicyInputError) {
        return { status: 400, body: { code: error.code } };
      }
      throw error;
    }
  };
}

module.exports = { createAuthorizationHandler };
