const { discoverDocuments } = require("./document-discovery");
const { validateDocumentSet } = require("./document-validation");
const { FrontMatterError } = require("./frontmatter");
const { prepareIndexBatch, syncIndexBatch } = require("./index-generator");

function compareStrings(left, right) {
  // Purpose: provide deterministic lexical ordering; Input: two strings; Output: negative, zero, or positive comparison result.
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function sortDiagnostics(values) {
  // Purpose: return diagnostics in stable order; Input: diagnostic array; Output: sorted copy without mutating the input.
  values.sort((left, right) =>
    compareStrings(left.path, right.path)
    || compareStrings(left.code, right.code)
    || compareStrings(left.message, right.message)
  );
}

function discoveryFailure(error) {
  // Purpose: normalize an unexpected discovery exception; Input: caught error; Output: one docs diagnostic.
  if (error instanceof FrontMatterError) {
    return {
      code: "frontmatter-error",
      path: error.sourcePath,
      message: error.message,
    };
  }
  const suffix = error && error.code ? ` (${error.code})` : "";
  return {
    code: "discovery-error",
    path: ".",
    message: `document discovery failed${suffix}`,
  };
}

function buildDocsState(projectRoot) {
  // Purpose: discover and validate the current document graph; Input: project root; Output: discovery, validation, diagnostics, and counts; Side effects: reads project files.
  let discoveryResult;
  try {
    discoveryResult = discoverDocuments(projectRoot);
  } catch (error) {
    return {
      errors: [discoveryFailure(error)],
      notices: [],
      counts: { specs: 0, records: 0, indexes: 0 },
      indexStates: [],
      batch: null,
    };
  }

  const validationResult = validateDocumentSet(discoveryResult);
  if (validationResult.errors.length > 0) {
    return {
      errors: validationResult.errors,
      notices: validationResult.notices,
      counts: {
        specs: validationResult.specs.length,
        records: validationResult.records.length,
        indexes: 0,
      },
      indexStates: [],
      batch: null,
    };
  }

  const batch = prepareIndexBatch({
    projectRoot,
    validationResult,
    indexPaths: discoveryResult.indexPaths,
  });
  const errors = [...batch.errors];
  sortDiagnostics(errors);
  return {
    errors,
    notices: validationResult.notices,
    counts: {
      specs: validationResult.specs.length,
      records: validationResult.records.length,
      indexes: batch.indexStates.length,
    },
    indexStates: batch.indexStates,
    batch,
  };
}

function checkDocs({ projectRoot }) {
  // Purpose: compute read-only docs and Index freshness state; Input: project root; Output: diagnostics, Index states, and counts; Side effects: reads project files.
  const state = buildDocsState(projectRoot);
  return {
    errors: state.errors,
    notices: state.notices,
    counts: state.counts,
    indexStates: state.indexStates,
  };
}

function syncDocs({ projectRoot, fileSystem, makeToken }) {
  // Purpose: validate then atomically synchronize generated Indexes; Input: root and optional adapters; Output: write/delete summary and diagnostics; Side effects: writes Index files only when validation passes.
  const state = buildDocsState(projectRoot);
  if (state.errors.length > 0 || state.batch === null) {
    return {
      errors: state.errors,
      notices: state.notices,
      counts: state.counts,
      indexStates: state.indexStates,
      writtenPaths: [],
      deletedPaths: [],
    };
  }

  const summary = syncIndexBatch({
    projectRoot,
    batch: state.batch,
    ...(fileSystem ? { fileSystem } : {}),
    ...(makeToken ? { makeToken } : {}),
  });
  return {
    errors: [],
    notices: state.notices,
    counts: state.counts,
    indexStates: state.indexStates,
    ...summary,
  };
}

module.exports = {
  checkDocs,
  syncDocs,
};
