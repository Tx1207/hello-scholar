"use strict";

const { authorize, normalizeLegacyPolicy } = require("./access-policy");

function authorizeLegacy(actor, resource, persistedPolicy) {
  return authorize(
    {
      actorId: actor.id,
      actorRole: actor.role,
      resource,
    },
    normalizeLegacyPolicy(persistedPolicy)
  ).allowed;
}

module.exports = { authorizeLegacy };
