export interface ScoreCriterion {
  key: string;
  label: string;
  score: number;
  weight: number;
}

export interface DecisionExplanation {
  missionTitle: string;
  projectName: string;
  finalScore: number;
  reasoning: string;
  criteria: ScoreCriterion[];
  alternatives: AlternativeConsidered[];
}

export interface AlternativeConsidered {
  projectName: string;
  reason: string;
}
