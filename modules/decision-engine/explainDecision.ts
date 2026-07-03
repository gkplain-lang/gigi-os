import { buildScoreCriteria } from "./calculateMissionScore";
import type { DecisionExplanation } from "./decisionTypes";

const MOCK_SCORES = {
  businessImpact: 9,
  alignment: 9,
  completionProximity: 10,
  urgency: 8,
  clarity: 9,
  effortEfficiency: 8,
  riskOfDelay: 6,
};

export function explainDecision(): DecisionExplanation {
  const criteria = buildScoreCriteria(MOCK_SCORES);
  const finalScore = 87;

  return {
    missionTitle: "Finaliser la page de vente Buildy Clear.",
    projectName: "Buildy Clear",
    finalScore,
    reasoning:
      "Le projet est presque prêt, la prochaine étape est claire, et finaliser la page de vente débloque le lancement — trafic, visibilité, premières ventes.",
    criteria,
    alternatives: [
      {
        projectName: "Buildy Crafts",
        reason: "Stratégique, mais pas le chemin le plus rapide vers le revenu aujourd'hui.",
      },
      {
        projectName: "Linko",
        reason: "Important, mais en pause.",
      },
      {
        projectName: "1Millimètre",
        reason: "Expérimental.",
      },
      {
        projectName: "Le Dernier Souvenir",
        reason: "Idée créative future.",
      },
      {
        projectName: "Gigi OS",
        reason: "Infrastructure — utile, mais pas l'action revenu du jour.",
      },
    ],
  };
}
