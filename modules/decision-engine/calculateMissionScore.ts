import { CRITERIA_LABELS, DECISION_WEIGHTS } from "./decisionWeights";
import type { ScoreCriterion } from "./decisionTypes";

interface RawScores {
  businessImpact: number;
  alignment: number;
  completionProximity: number;
  urgency: number;
  clarity: number;
  effortEfficiency: number;
  riskOfDelay: number;
}

export function calculateMissionScore(scores: RawScores): number {
  const weighted =
    scores.businessImpact * DECISION_WEIGHTS.businessImpact +
    scores.alignment * DECISION_WEIGHTS.alignment +
    scores.completionProximity * DECISION_WEIGHTS.completionProximity +
    scores.urgency * DECISION_WEIGHTS.urgency +
    scores.clarity * DECISION_WEIGHTS.clarity +
    scores.effortEfficiency * DECISION_WEIGHTS.effortEfficiency +
    scores.riskOfDelay * DECISION_WEIGHTS.riskOfDelay;

  return Math.round(weighted * 10);
}

export function buildScoreCriteria(scores: RawScores): ScoreCriterion[] {
  return (Object.keys(CRITERIA_LABELS) as Array<keyof typeof CRITERIA_LABELS>).map(
    (key) => ({
      key,
      label: CRITERIA_LABELS[key],
      score: scores[key],
      weight: DECISION_WEIGHTS[key],
    })
  );
}
