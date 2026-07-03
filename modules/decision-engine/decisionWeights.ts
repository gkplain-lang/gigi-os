export const DECISION_WEIGHTS = {
  businessImpact: 0.25,
  alignment: 0.2,
  completionProximity: 0.15,
  urgency: 0.15,
  clarity: 0.1,
  effortEfficiency: 0.1,
  riskOfDelay: 0.05,
} as const;

export const CRITERIA_LABELS = {
  businessImpact: "Impact business",
  alignment: "Alignement",
  completionProximity: "Proximité de finalisation",
  urgency: "Urgence",
  clarity: "Clarté",
  effortEfficiency: "Efficacité de l'effort",
  riskOfDelay: "Risque du retard",
} as const;
