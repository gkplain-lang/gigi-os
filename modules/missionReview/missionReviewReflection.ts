import type {
  DailyMissionReview,
  MissionExecutionReflection,
  NextDecision,
  OutcomeStatus,
} from "./missionReviewTypes";
import { NEXT_DECISION_LABELS, OUTCOME_STATUS_LABELS } from "./missionReviewTypes";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function generateRecommendedNextDecision(review: Pick<
  DailyMissionReview,
  "outcomeStatus" | "blockers" | "whatWasDone" | "nextDecision"
>): { decision: NextDecision; action: string; reason: string } {
  const { outcomeStatus, blockers, nextDecision } = review;

  if (nextDecision !== "continue_same_mission") {
    return {
      decision: nextDecision,
      action: NEXT_DECISION_LABELS[nextDecision],
      reason: `Décision choisie : ${NEXT_DECISION_LABELS[nextDecision]}.`,
    };
  }

  if (outcomeStatus === "blocked" || blockers.trim().length > 0) {
    return {
      decision: "clarify_next_step",
      action: NEXT_DECISION_LABELS.clarify_next_step,
      reason: "Blocage signalé — clarifier avant de continuer.",
    };
  }

  if (outcomeStatus === "completed") {
    return {
      decision: "mark_complete",
      action: NEXT_DECISION_LABELS.mark_complete,
      reason: "Outcome terminé — boucler la mission du jour.",
    };
  }

  if (outcomeStatus === "unclear") {
    return {
      decision: "choose_new_mission",
      action: NEXT_DECISION_LABELS.choose_new_mission,
      reason: "Mission floue — repartir du composer.",
    };
  }

  if (outcomeStatus === "partially_done") {
    return {
      decision: "continue_same_mission",
      action: NEXT_DECISION_LABELS.continue_same_mission,
      reason: "Progression partielle — reprendre demain avec focus.",
    };
  }

  return {
    decision: nextDecision,
    action: NEXT_DECISION_LABELS[nextDecision],
    reason: "Continuer sur la base de ta revue locale.",
  };
}

export function generateExecutionReflection(
  review: DailyMissionReview
): MissionExecutionReflection {
  const recommended = generateRecommendedNextDecision(review);
  const outcomeLabel = OUTCOME_STATUS_LABELS[review.outcomeStatus];

  let signal = "Revue locale enregistrée.";
  if (review.outcomeStatus === "completed") signal = "Focus gagné — mission bouclée localement.";
  else if (review.outcomeStatus === "blocked") signal = "Blocage identifié — décision humaine requise.";
  else if (review.outcomeStatus === "partially_done") signal = "Progression partielle — continuer ou pivoter.";
  else if (review.outcomeStatus === "unclear") signal = "Clarté insuffisante — repartir du composer.";

  return {
    id: newId("mr-reflection"),
    reviewId: review.id,
    title: `Réflexion · ${review.missionTitle}`,
    summary: `Bilan local : ${outcomeLabel}. ${review.whatWasDone.slice(0, 120) || "Pas de détail fourni."}`,
    signal,
    recommendation: recommended.action,
    reason: recommended.reason,
    createdAt: nowIso(),
  };
}

export function computeFocusScore(review: Pick<
  DailyMissionReview,
  "outcomeStatus" | "progressLevel" | "blockers"
>): number {
  const base = review.progressLevel;
  const outcomeBonus: Record<OutcomeStatus, number> = {
    completed: 20,
    partially_done: 10,
    blocked: -5,
    skipped: 0,
    unclear: -10,
  };
  const blockerPenalty = review.blockers.trim().length > 20 ? -5 : 0;
  return Math.max(0, Math.min(100, base + outcomeBonus[review.outcomeStatus] + blockerPenalty));
}
