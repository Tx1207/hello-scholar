function normalizeScore(value, maximum) {
  // Purpose: normalize an observed score into the closed unit interval; Input: observed value and positive maximum; Output: normalized number; Errors: rejects invalid maximum.
  if (!Number.isFinite(maximum) || maximum <= 0) {
    throw new RangeError("maximum must be positive");
  }
  return Math.max(0, Math.min(1, value / maximum));
}

function weightedTotal(scores, weights) {
  // Purpose: combine normalized dimensions by configured weights; Input: score and weight maps; Output: weighted total; Errors: rejects missing score dimensions.
  return Object.entries(weights).reduce((total, [dimension, weight]) => {
    if (!Object.hasOwn(scores, dimension)) {
      throw new Error(`missing score: ${dimension}`);
    }
    return total + scores[dimension] * weight;
  }, 0);
}

module.exports = { normalizeScore, weightedTotal };
