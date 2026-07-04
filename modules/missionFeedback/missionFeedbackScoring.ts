import type {
  MissionFeedbackSignal,
  MissionRecommendationDecision,
  MissionRecommendationScore,
  ScoreableMission,
} from "./types";

const SCORE_RULES: Record<
  MissionFeedbackSignal["type"],
  { delta: number; reason?: string; risk?: string }
> = {
  unblocker: { delta: 15, reason: "Cette mission résout un blocage identifié localement." },
  high_impact: { delta: 15, reason: "Historique local avec impact positif confirmé." },
  often_completed: { delta: 20, reason: "Des exécutions similaires se terminent souvent avec succès." },
  follow_up_required: { delta: 10, reason: "Une action de suivi est déjà claire dans l'historique." },
  recurring_blocker: {
    delta: -20,
    risk: "Blocage récurrent non résolu sur ce projet.",
  },
  often_abandoned: {
    delta: -15,
    risk: "Ce type de mission est souvent abandonné.",
  },
  too_vague: {
    delta: -15,
    risk: "Mission perçue comme trop floue dans l'historique.",
  },
  needs_smaller_scope: {
    delta: -10,
    risk: "Scope trop large — risque de dispersion.",
  },
  needs_clearer_validation: {
    delta: -10,
    risk: "Validation ou rapport final souvent insuffisant.",
  },
  test_required: {
    delta: -5,
    risk: "Un test explicite doit être défini avant de considérer terminé.",
  },
  manual_review_required: {
    delta: -5,
    risk: "Correction manuelle probable — prévoir du temps de review.",
  },
  documentation_needed: { delta: 0, reason: "Documenter le résultat améliorera les prochaines recommandations." },
  low_impact: { delta: -8, risk: "Feedback manuel : faible utilité perçue." },
};

function decisionFromScore(score: number): MissionRecommendationDecision {
  if (score >= 80) return "strongly_recommended";
  if (score >= 60) return "recommended";
  if (score >= 40) return "neutral";
  if (score >= 20) return "needs_clarification";
  return "not_recommended";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function signalsForMission(
  signals: MissionFeedbackSignal[],
  mission: ScoreableMission
): MissionFeedbackSignal[] {
  return signals.filter(
    (s) =>
      s.missionId === mission.missionId ||
      (s.projectId === mission.projectId && !s.missionId) ||
      (s.projectId === mission.projectId && s.missionId === mission.missionId)
  );
}

function buildSuggestedRefinement(
  mission: ScoreableMission,
  missionSignals: MissionFeedbackSignal[]
): string | undefined {
  if (missionSignals.some((s) => s.type === "too_vague" || s.type === "needs_clearer_validation")) {
    return `Définir précisément le résultat attendu pour « ${mission.title} », le test à relancer et le critère de « terminé ».`;
  }
  if (missionSignals.some((s) => s.type === "needs_smaller_scope")) {
    return `Découper « ${mission.title} » en une étape plus petite (≤ 30 min) avec une validation claire.`;
  }
  if (missionSignals.some((s) => s.type === "test_required")) {
    return `Préciser quel test ou build relancer manuellement après « ${mission.title} ».`;
  }
  return undefined;
}

export function scoreMissionFromSignals(
  mission: ScoreableMission,
  signals: MissionFeedbackSignal[]
): MissionRecommendationScore {
  const relevant = signalsForMission(signals, mission);
  const projectSignals = signals.filter(
    (s) => s.projectId === mission.projectId && !s.missionId
  );
  const combined = [...relevant, ...projectSignals];

  let score = 50;
  const reasons: string[] = [];
  const risks: string[] = [];
  let confidenceSum = 0;
  let confidenceCount = 0;

  for (const signal of combined) {
    const rule = SCORE_RULES[signal.type];
    if (!rule) continue;
    score += rule.delta;
    if (rule.reason && !reasons.includes(rule.reason)) reasons.push(rule.reason);
    if (rule.risk && !risks.includes(rule.risk)) risks.push(rule.risk);
    confidenceSum += signal.confidence;
    confidenceCount += 1;
  }

  if (combined.length === 0) {
    reasons.push("Peu de données locales — score neutre par défaut.");
  }

  const finalScore = clampScore(score);
  const confidence =
    confidenceCount > 0 ? Math.round(confidenceSum / confidenceCount) : 40;

  return {
    missionId: mission.missionId,
    projectId: mission.projectId,
    score: finalScore,
    decision: decisionFromScore(finalScore),
    reasons: reasons.slice(0, 5),
    risks: risks.slice(0, 4),
    suggestedRefinement: buildSuggestedRefinement(mission, combined),
    confidence,
    updatedAt: new Date().toISOString(),
  };
}

export function scoreAllMissions(
  missions: ScoreableMission[],
  signals: MissionFeedbackSignal[]
): MissionRecommendationScore[] {
  return missions
    .map((m) => scoreMissionFromSignals(m, signals))
    .sort((a, b) => b.score - a.score);
}

export function getTopScoredMission(
  scores: MissionRecommendationScore[]
): MissionRecommendationScore | undefined {
  return scores[0];
}
