export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function calculateScore(evaluation, weights) {
  let totalScore = 0;
  let totalWeight = 0;
  Object.values(weights).forEach((weight) => {
    totalWeight += weight;
  });
  Object.entries(evaluation).map(([key, score]) => {
    totalScore += score * (weights[key] / totalWeight);
  });
  return totalScore.toFixed(1);
}

export function calculateEvaluationKeyValue(evaluation) {
  let width = 0;
  Object.keys(evaluation).forEach((key) => {
    if (width < key.length) {
      width = key.length;
    }
  });
  width = width * 10 + 15;
  return width;
}
