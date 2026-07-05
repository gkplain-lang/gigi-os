import { generateGlobalSummary } from "@/modules/historyLearning";
import {
  MISSION_LEARNING_SAFETY_NOTE,
  MISSION_LEARNING_SIGNAL_LABELS,
  NEXT_MISSION_KIND_LABELS,
  type MissionLearningViewModel,
} from "./missionOSLearningTypes";
import {
  buildWhatHappened,
  collectLearningContext,
  deriveLearningSignals,
  resolveNextMissionRecommendation,
} from "./missionOSNextMission";

export interface BuildMissionLearningInput {
  projectId?: string;
  completedMissionIds?: string[];
}

function buildWhatGigiLearned(
  ctx: ReturnType<typeof collectLearningContext>,
  signals: ReturnType<typeof deriveLearningSignals>
): string {
  const parts: string[] = [];

  if (ctx.globalSummary.topLearnings.length > 0) {
    parts.push(ctx.globalSummary.topLearnings[0]);
  } else if (ctx.recentEntry?.learnings[0]?.content) {
    parts.push(ctx.recentEntry.learnings[0].content);
  }

  if (ctx.globalSummary.recurringPatterns.length > 0) {
    parts.push(`Motif récurrent : ${ctx.globalSummary.recurringPatterns[0]}.`);
  }

  if (ctx.review?.findings[0]) {
    parts.push(ctx.review.findings[0].description.slice(0, 140));
  }

  if (ctx.followUp) {
    parts.push(`${FOLLOW_UP_HINT(ctx.followUp.type)} : ${ctx.followUp.rationale.slice(0, 100)}`);
  }

  if (parts.length === 0) {
    if (signals.includes("completed")) {
      return "Un cycle s'est bien terminé localement — tu peux capitaliser sur ce pattern.";
    }
    if (signals.includes("blocked") || signals.includes("recurring_blocker")) {
      return "Un blocage revient — clarifie ou réduis la prochaine action avant d'enchaîner.";
    }
    return "Peu de signaux archivés — archive un retour depuis /actions ou ajoute une note sur /history.";
  }

  return parts.join(" ");
}

function FOLLOW_UP_HINT(type: string): string {
  switch (type) {
    case "fix":
      return "Correction suggérée";
    case "document":
      return "Documentation suggérée";
    case "retry":
      return "Relance suggérée";
    case "clarify":
      return "Clarification suggérée";
    default:
      return "Suite suggérée";
  }
}

function buildWhatChanged(
  ctx: ReturnType<typeof collectLearningContext>,
  recommendation: ReturnType<typeof resolveNextMissionRecommendation>
): string {
  if (recommendation.kind === "correction_recommended") {
    return "La priorité passe au retour / correction — pas à une nouvelle mission large.";
  }
  if (recommendation.kind === "documentation_recommended") {
    return "Documente la leçon avant d'ajouter une nouvelle automatisation ou mission.";
  }
  if (recommendation.kind === "clarification_recommended") {
    return "Clarifie le résultat attendu avant de relancer un cycle complet.";
  }
  if (ctx.globalSummary.completedCount > 0 && recommendation.kind === "next_mission_probable") {
    return "Un cycle récent est positif — tu peux envisager la mission suivante sans auto-accepter.";
  }
  if (ctx.activeLifecycle) {
    return "Un cycle est encore ouvert — termine-le manuellement avant d'en ouvrir un autre.";
  }
  return "Rien ne change automatiquement — tu décides de la suite.";
}

function buildOutcomeLabel(signals: ReturnType<typeof deriveLearningSignals>): string {
  if (signals.includes("completed")) return "Résultat positif";
  if (signals.includes("needs_fix") || signals.includes("needs_retry")) return "Correction à prévoir";
  if (signals.includes("blocked") || signals.includes("recurring_blocker")) return "Blocage détecté";
  if (signals.includes("follow_up_needed")) return "Suite nécessaire";
  if (signals.includes("documentation_needed")) return "Documentation utile";
  return "En cours de clarification";
}

function buildSourceLabels(ctx: ReturnType<typeof collectLearningContext>): string[] {
  const sources: string[] = [];
  if (ctx.recentEntry) sources.push("Historique");
  if (ctx.review) sources.push("Review");
  if (ctx.followUp) sources.push("Suivi");
  if (ctx.recentIntake) sources.push("Rapport");
  if (ctx.activeLifecycle) sources.push("Cycle");
  if (ctx.feedbackSignals.length > 0) sources.push("Feedback mission");
  return sources.length ? sources : ["Synthèse locale"];
}

function buildRiskOrBlocker(ctx: ReturnType<typeof collectLearningContext>): string | undefined {
  if (ctx.review?.findings.some((f) => f.severity === "critical")) {
    return ctx.review.findings.find((f) => f.severity === "critical")?.title;
  }
  if (ctx.globalSummary.blockedCount > 0) {
    return `${ctx.globalSummary.blockedCount} entrée(s) bloquée(s) dans l'historique.`;
  }
  const blockerSignal = ctx.feedbackSignals.find((s) => s.type === "recurring_blocker");
  if (blockerSignal) return blockerSignal.label;
  return undefined;
}

export function buildMissionLearningViewModel(
  input: BuildMissionLearningInput = {}
): MissionLearningViewModel {
  const ctx = collectLearningContext(input.projectId);
  const signals = deriveLearningSignals(ctx);
  const recommendation = resolveNextMissionRecommendation(input.completedMissionIds ?? []);
  const globalSummary = generateGlobalSummary(input.projectId);
  const signalLabels = signals.map((s) => MISSION_LEARNING_SIGNAL_LABELS[s]);
  const whatGigiLearned = buildWhatGigiLearned(ctx, signals);
  const hasLearning =
    ctx.entries.length > 0 ||
    Boolean(ctx.review) ||
    Boolean(ctx.followUp) ||
    Boolean(ctx.recentIntake);

  return {
    title: hasLearning ? "Ce que Gigi a appris" : "Apprentissage en attente",
    summary: globalSummary.summaryText,
    outcomeLabel: buildOutcomeLabel(signals),
    learningSignals: signals,
    signalLabels,
    whatHappened: buildWhatHappened(ctx),
    whatGigiLearned,
    whatChanged: buildWhatChanged(ctx, recommendation),
    riskOrBlocker: buildRiskOrBlocker(ctx),
    recommendedNextMissionTitle: recommendation.missionTitle,
    recommendedNextMissionReason: recommendation.missionReason,
    recommendedNextMissionRoute: recommendation.missionRoute,
    recommendedNextActionLabel: recommendation.actionLabel,
    recommendedNextActionRoute: recommendation.actionRoute,
    recommendationKind: recommendation.kind,
    recommendationKindLabel: NEXT_MISSION_KIND_LABELS[recommendation.kind],
    confidenceLabel: recommendation.confidenceLabel,
    sourceLabels: buildSourceLabels(ctx),
    safetyNote: MISSION_LEARNING_SAFETY_NOTE,
    updatedAt: ctx.recentEntry?.updatedAt ?? ctx.review?.updatedAt ?? new Date().toISOString(),
    hasLearning,
  };
}

export function getRecentLearningSignals(limit = 5): { label: string; description: string }[] {
  const ctx = collectLearningContext();
  const signals = deriveLearningSignals(ctx);
  const items: { label: string; description: string }[] = [];

  signals.forEach((s) => {
    items.push({
      label: MISSION_LEARNING_SIGNAL_LABELS[s],
      description: ctx.globalSummary.topLearnings[items.length] ?? buildWhatHappened(ctx).slice(0, 80),
    });
  });

  if (ctx.globalSummary.recurringPatterns.length > 0) {
    items.push({
      label: "Motif récurrent",
      description: ctx.globalSummary.recurringPatterns[0],
    });
  }

  return items.slice(0, limit);
}
