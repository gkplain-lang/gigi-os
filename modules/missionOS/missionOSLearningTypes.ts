export type MissionLearningSignal =
  | "completed"
  | "blocked"
  | "needs_fix"
  | "needs_retry"
  | "follow_up_needed"
  | "documentation_needed"
  | "unclear"
  | "successful_pattern"
  | "recurring_blocker"
  | "next_mission_ready";

export type NextMissionRecommendationKind =
  | "next_mission_probable"
  | "correction_recommended"
  | "documentation_recommended"
  | "clarification_recommended"
  | "next_mission_unclear";

export interface MissionLearningViewModel {
  title: string;
  summary: string;
  outcomeLabel: string;
  learningSignals: MissionLearningSignal[];
  signalLabels: string[];
  whatHappened: string;
  whatGigiLearned: string;
  whatChanged: string;
  riskOrBlocker?: string;
  recommendedNextMissionTitle?: string;
  recommendedNextMissionReason?: string;
  recommendedNextMissionRoute: string;
  recommendedNextActionLabel: string;
  recommendedNextActionRoute: string;
  recommendationKind: NextMissionRecommendationKind;
  recommendationKindLabel: string;
  confidenceLabel?: string;
  sourceLabels: string[];
  safetyNote: string;
  updatedAt: string;
  hasLearning: boolean;
}

export const MISSION_LEARNING_SIGNAL_LABELS: Record<MissionLearningSignal, string> = {
  completed: "Terminé",
  blocked: "Bloqué",
  needs_fix: "Correction nécessaire",
  needs_retry: "Relance recommandée",
  follow_up_needed: "Suite à préparer",
  documentation_needed: "Documentation utile",
  unclear: "Statut à clarifier",
  successful_pattern: "Pattern qui fonctionne",
  recurring_blocker: "Blocage récurrent",
  next_mission_ready: "Suite mission prête",
};

export const NEXT_MISSION_KIND_LABELS: Record<NextMissionRecommendationKind, string> = {
  next_mission_probable: "Prochaine mission probable",
  correction_recommended: "Correction recommandée",
  documentation_recommended: "Documentation recommandée",
  clarification_recommended: "Clarification recommandée",
  next_mission_unclear: "Mission suivante non claire",
};

export const MISSION_LEARNING_SAFETY_NOTE =
  "Gigi synthétise tes données locales. Il ne crée ni n'accepte aucune mission automatiquement.";
