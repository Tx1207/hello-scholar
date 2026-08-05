export function routePrompt(prompt, confidence, threshold) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("benchmark") || normalized.includes("evaluate")) {
    return confidence >= threshold ? "experiment" : "design";
  }
  if (normalized.includes("design") || normalized.includes("architect")) {
    return "design";
  }
  return confidence >= threshold ? "fast" : "design";
}

export function scoreThreshold(cases, threshold) {
  const correct = cases.filter((item) =>
    routePrompt(item.prompt, item.confidence, threshold) === item.expected
  ).length;
  return { threshold, correct, total: cases.length, accuracy: correct / cases.length };
}
