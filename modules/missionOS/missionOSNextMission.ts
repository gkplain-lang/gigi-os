import type { ExecutionReview } from "@/modules/executionReviews/types";
import { listExecutionReviews } from "@/modules/executionReviews/executionReviewStore";
import { EXECUTION_REVIEW_DECISION_LABELS } from "@/modules/executionReviews/types";
import type { FollowUpActionProposal } from "@/modules/followUpActions/types";
import { listAllFollowUpProposals } from "@/modules/followUpActions/followUpActionStore";
import { generateGlobalSummary, listHistoryEntries } from "@/modules/historyLearning";
import type { HistoryLearningEntry } from "@/modules/historyLearning/types";
import { HISTORY_OUTCOME_LABELS } from "@/modules/historyLearning/types";
import {
  getBestDailyMissionRecommendation,
  getDefaultScoreableMissions,
  listMissionFeedbackSignals,
} from "@/modules/missionFeedback";
import type { MissionRecommendationScore } from "@/modules/missionFeedback/types";
import { MISSION_DECISION_LABELS } from "@/modules/missionFeedback/types";
import { listClosedLoopLifecycles } from "@/modules/closedLoopLifecycle/closedLoopLifecycleStore";
import { listExecutionReportIntakes } from "@/modules/executionReportIntake/executionReportIntakeStore";
import type {
  MissionLearningSignal,
  NextMissionRecommendationKind,
} from "./missionOSLearningTypes";

export interface NextMissionRecommendation {
  kind: NextMissionRecommendationKind;
  missionTitle?: string;
  missionReason?: string;
  missionRoute: string;
  actionLabel: string;
  actionRoute: string;
  confidenceLabel?: string;
}

function latestEntry(entries: HistoryLearningEntry[]): HistoryLearningEntry | undefined {
  return [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

function latestReview(): ExecutionReview | undefined {
  return [...listExecutionReviews()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )[0];
}

function latestFollowUp(): FollowUpActionProposal | undefined {
  return [...listAllFollowUpProposals()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )[0];
}

function mapReviewToSignals(review: ExecutionReview): MissionLearningSignal[] {
  switch (review.decision) {
    case "completed_confirmed":
      return ["completed", "successful_pattern"];
    case "needs_fix":
      return ["needs_fix", "follow_up_needed"];
    case "needs_retry":
      return ["needs_retry"];
    case "needs_new_action":
      return ["follow_up_needed", "next_mission_ready"];
    case "abandoned_confirmed":
      return ["blocked", "unclear"];
    default:
      return ["unclear"];
  }
}

function mapFollowUpToKind(followUp: FollowUpActionProposal): NextMissionRecommendationKind {
  switch (followUp.type) {
    case "fix":
    case "retry":
      return "correction_recommended";
    case "document":
      return "documentation_recommended";
    case "clarify":
      return "clarification_recommended";
    case "new_action":
    case "finalize":
      return "next_mission_probable";
    default:
      return "next_mission_unclear";
  }
}

export function resolveNextMissionRecommendation(
  completedMissionIds: string[] = []
): NextMissionRecommendation {
  const followUp = latestFollowUp();
  const review = latestReview();
  const best = getBestDailyMissionRecommendation(completedMissionIds);

  if (followUp && followUp.status === "proposed") {
    const kind = mapFollowUpToKind(followUp);
    return {
      kind,
      missionTitle: followUp.title,
      missionReason: followUp.rationale,
      missionRoute: followUp.metadata?.projectId
        ? `/projects/${followUp.metadata.projectId}`
        : "/actions",
      actionLabel:
        kind === "correction_recommended"
          ? "Traiter le retour"
          : kind === "documentation_recommended"
            ? "Voir l'historique"
            : "Ouvrir les actions",
      actionRoute:
        kind === "documentation_recommended" ? "/history" : "/actions",
      confidenceLabel: followUp.riskLevel === "low" ? "Confiance moyenne" : "À valider manuellement",
    };
  }

  if (review) {
    if (review.decision === "needs_fix" || review.decision === "needs_retry") {
      return {
        kind: "correction_recommended",
        missionTitle: review.summary.slice(0, 80),
        missionReason: review.recommendedNextActions[0]?.description ?? review.summary,
        missionRoute: "/actions",
        actionLabel: "Traiter la review",
        actionRoute: "/actions",
        confidenceLabel: `${review.confidence}% confiance review`,
      };
    }
    if (review.decision === "completed_confirmed") {
      const rec = buildFromMissionScore(best);
      if (rec) return rec;
    }
  }

  const fromScore = buildFromMissionScore(best);
  if (fromScore) return fromScore;

  return {
    kind: "next_mission_unclear",
    missionRoute: "/#mission-decision",
    actionLabel: "Choisir la prochaine mission",
    actionRoute: "/#mission-decision",
    missionReason: "Pas assez de signaux — décide manuellement ta prochaine mission.",
  };
}

function buildFromMissionScore(
  best: MissionRecommendationScore | undefined
): NextMissionRecommendation | undefined {
  if (!best) return undefined;

  const catalog = getDefaultScoreableMissions().find((m) => m.missionId === best.missionId);
  const missionTitle =
    catalog?.title ??
    best.missionId.replace(/^mission-/, "").replace(/-/g, " ");

  return {
    kind:
      best.decision === "needs_clarification"
        ? "clarification_recommended"
        : "next_mission_probable",
    missionTitle,
    missionReason: best.reasons[0] ?? "Score basé sur l'historique local.",
    missionRoute: best.projectId ? `/projects/${best.projectId}` : "/#mission-decision",
    actionLabel: "Choisir la prochaine mission",
    actionRoute: "/#mission-decision",
    confidenceLabel: `${Math.round(best.confidence)}% · ${MISSION_DECISION_LABELS[best.decision]}`,
  };
}

export function collectLearningContext(projectId?: string) {
  const entries = listHistoryEntries(projectId ? { projectId } : undefined);
  const globalSummary = generateGlobalSummary(projectId);
  const recentEntry = latestEntry(entries);
  const review = latestReview();
  const followUp = latestFollowUp();
  const lifecycles = listClosedLoopLifecycles().filter(
    (l) => !["closed", "archived"].includes(l.status)
  );
  const intakes = listExecutionReportIntakes(3);
  const feedbackSignals = listMissionFeedbackSignals(
    projectId ? { projectId } : undefined
  ).slice(0, 5);

  return {
    entries,
    globalSummary,
    recentEntry,
    review,
    followUp,
    activeLifecycle: lifecycles[0],
    recentIntake: intakes[0],
    feedbackSignals,
  };
}

export function deriveLearningSignals(ctx: ReturnType<typeof collectLearningContext>): MissionLearningSignal[] {
  const signals = new Set<MissionLearningSignal>();

  if (ctx.recentEntry) {
    if (ctx.recentEntry.outcome === "success" || ctx.recentEntry.status === "completed") {
      signals.add("completed");
    }
    if (ctx.recentEntry.outcome === "blocked" || ctx.recentEntry.status === "blocked") {
      signals.add("blocked");
    }
    if (ctx.recentEntry.status === "needs_follow_up") signals.add("follow_up_needed");
    if (ctx.recentEntry.signals.some((s) => s.type === "recurring_pattern")) {
      signals.add("recurring_blocker");
    }
    if (ctx.recentEntry.signals.some((s) => s.type === "fix_created")) {
      signals.add("needs_fix");
    }
    if (ctx.recentEntry.signals.some((s) => s.type === "retry_needed")) {
      signals.add("needs_retry");
    }
  }

  if (ctx.review) {
    mapReviewToSignals(ctx.review).forEach((s) => signals.add(s));
  }

  if (ctx.followUp?.type === "document") signals.add("documentation_needed");
  if (ctx.followUp && ["fix", "retry", "new_action"].includes(ctx.followUp.type)) {
    signals.add("follow_up_needed");
  }

  if (ctx.globalSummary.recurringPatterns.length > 0) signals.add("recurring_blocker");
  if (ctx.globalSummary.completedCount > 0) signals.add("successful_pattern");

  ctx.feedbackSignals.forEach((s) => {
    if (s.type === "documentation_needed") signals.add("documentation_needed");
    if (s.type === "recurring_blocker") signals.add("recurring_blocker");
    if (s.type === "follow_up_required") signals.add("follow_up_needed");
  });

  if (signals.size === 0) signals.add("unclear");

  return [...signals].slice(0, 5);
}

export function buildWhatHappened(ctx: ReturnType<typeof collectLearningContext>): string {
  if (ctx.recentIntake) {
    return `Dernier rapport reçu : ${ctx.recentIntake.title.replace(/^Intake · /, "")}.`;
  }
  if (ctx.review) {
    return `Dernière review : ${EXECUTION_REVIEW_DECISION_LABELS[ctx.review.decision]} — ${ctx.review.summary.slice(0, 120)}`;
  }
  if (ctx.recentEntry) {
    return `${ctx.recentEntry.title} — ${HISTORY_OUTCOME_LABELS[ctx.recentEntry.outcome]}.`;
  }
  if (ctx.activeLifecycle) {
    return `Cycle actif : ${ctx.activeLifecycle.title.replace(/^Cycle · /, "")} (${ctx.activeLifecycle.status}).`;
  }
  return "Aucun rapport ou review récent — commence un cycle depuis /actions.";
}

export { mapReviewToSignals, buildFromMissionScore };
