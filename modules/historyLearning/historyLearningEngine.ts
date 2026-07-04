import type { ExecutionLog } from "@/modules/executionLogs/types";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import type { FollowUpActionProposal } from "@/modules/followUpActions/types";
import type {
  HistoryLearningEntry,
  HistoryLearningEntryStatus,
  HistoryLearningOutcome,
  HistoryLearningSignal,
  HistoryLearningSignalType,
  HistoryLearningSeverity,
  RecommendedFutureBehavior,
  HistoryLearningNote,
} from "./types";
import { listHistoryEntries } from "./historyLearningStore";

function nowIso(): string {
  return new Date().toISOString();
}

function signalId(type: string, n: number): string {
  return `hlsig-${type}-${n}-${Date.now()}`;
}

function mapReviewToStatusOutcome(
  decision: ExecutionReview["decision"]
): { status: HistoryLearningEntryStatus; outcome: HistoryLearningOutcome } {
  switch (decision) {
    case "completed_confirmed":
      return { status: "completed", outcome: "success" };
    case "needs_fix":
      return { status: "needs_follow_up", outcome: "partial_success" };
    case "needs_retry":
      return { status: "needs_follow_up", outcome: "partial_success" };
    case "needs_new_action":
      return { status: "needs_follow_up", outcome: "partial_success" };
    case "abandoned_confirmed":
      return { status: "abandoned", outcome: "abandoned" };
    case "unclear":
    default:
      return { status: "unclear", outcome: "unclear" };
  }
}

function severityForFinding(type: string): HistoryLearningSeverity {
  if (type === "failed_test") return "critical";
  if (type === "blocker" || type === "fix_required") return "warning";
  if (type === "completion_signal" || type === "manual_commit") return "success";
  return "info";
}

export function buildSignalsFromSources(
  review: ExecutionReview,
  log?: ExecutionLog,
  followUps?: FollowUpActionProposal[]
): HistoryLearningSignal[] {
  const signals: HistoryLearningSignal[] = [];
  let i = 1;
  const ts = nowIso();

  for (const finding of review.findings) {
    let type: HistoryLearningSignalType = "learning_note";
    if (finding.type === "failed_test") type = "failed_test";
    else if (finding.type === "blocker") type = "blocker";
    else if (finding.type === "fix_required") type = "fix_created";
    else if (finding.type === "missing_report") type = "missing_report";
    else if (finding.type === "completion_signal") type = "completed_action";
    else if (finding.type === "manual_commit") type = "manual_commit";

    signals.push({
      id: signalId(type, i++),
      type,
      label: finding.title,
      description: finding.description,
      severity: severityForFinding(finding.type),
      relatedId: finding.relatedEntryId,
      createdAt: ts,
    });
  }

  if (review.decision === "completed_confirmed") {
    signals.push({
      id: signalId("decision_confirmed", i++),
      type: "decision_confirmed",
      label: "Review : terminé confirmé",
      description: review.summary,
      severity: "success",
      createdAt: ts,
    });
  }

  if (review.decision === "needs_fix" || review.decision === "needs_retry") {
    signals.push({
      id: signalId("retry_needed", i++),
      type: review.decision === "needs_fix" ? "fix_created" : "retry_needed",
      label: review.decision === "needs_fix" ? "Correction nécessaire" : "Relance recommandée",
      description: review.summary,
      severity: "warning",
      createdAt: ts,
    });
  }

  if (log) {
    const failed = log.entries.filter((e) => e.type === "test_failed");
    const blocked = log.entries.filter((e) => e.type === "blocked");
    if (failed.length && !signals.some((s) => s.type === "failed_test")) {
      signals.push({
        id: signalId("failed_test", i++),
        type: "failed_test",
        label: "Test échoué dans le journal",
        description: failed[0].title,
        severity: "critical",
        relatedId: failed[0].id,
        createdAt: ts,
      });
    }
    if (blocked.length && !signals.some((s) => s.type === "blocker")) {
      signals.push({
        id: signalId("blocker", i++),
        type: "blocker",
        label: "Blocage dans le journal",
        description: blocked[0].description ?? blocked[0].title,
        severity: "warning",
        relatedId: blocked[0].id,
        createdAt: ts,
      });
    }
    if (log.entries.some((e) => e.type === "manual_commit")) {
      signals.push({
        id: signalId("manual_commit", i++),
        type: "manual_commit",
        label: "Commit manuel déclaré",
        description: "L'utilisateur a indiqué un commit manuel.",
        severity: "success",
        createdAt: ts,
      });
    }
    if (
      (log.status === "completed_manually" || log.finalReport) &&
      !log.finalReport?.trim() &&
      !signals.some((s) => s.type === "missing_report")
    ) {
      signals.push({
        id: signalId("missing_report", i++),
        type: "missing_report",
        label: "Rapport final manquant",
        description: "Action marquée terminée sans rapport détaillé.",
        severity: "warning",
        createdAt: ts,
      });
    }
  }

  for (const fp of followUps ?? []) {
    if (fp.status === "dismissed") continue;
    signals.push({
      id: signalId("follow_up_created", i++),
      type: "follow_up_created",
      label: `Follow-up : ${fp.title}`,
      description: fp.objective,
      severity: "info",
      relatedId: fp.id,
      createdAt: ts,
    });
  }

  return detectRecurringPatterns(signals);
}

function detectRecurringPatterns(signals: HistoryLearningSignal[]): HistoryLearningSignal[] {
  const existing = listHistoryEntries();
  const allSignals = [
    ...signals,
    ...existing.flatMap((e) => e.signals),
  ];

  const counts: Partial<Record<HistoryLearningSignalType, number>> = {};
  for (const s of allSignals) {
    if (s.type === "blocker" || s.type === "failed_test" || s.type === "fix_created") {
      counts[s.type] = (counts[s.type] ?? 0) + 1;
    }
  }

  const result = [...signals];
  for (const [type, count] of Object.entries(counts)) {
    if ((count ?? 0) >= 2) {
      result.push({
        id: signalId("recurring_pattern", result.length + 1),
        type: "recurring_pattern",
        label: `Motif récurrent : ${type}`,
        description: `Ce signal apparaît ${count} fois dans l'historique local.`,
        severity: "warning",
        createdAt: nowIso(),
      });
    }
  }
  return result;
}

export function buildLearningsFromSignals(signals: HistoryLearningSignal[]): HistoryLearningNote[] {
  const learnings: HistoryLearningNote[] = [];
  const ts = nowIso();
  let i = 1;

  if (signals.some((s) => s.type === "failed_test")) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Build et tests",
      content: "Toujours relancer le build après modification et déclarer le résultat dans le journal.",
      createdAt: ts,
    });
  }
  if (signals.some((s) => s.type === "blocker")) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Blocages",
      content: "Documenter la cause du blocage avant de marquer terminé — facilite les reviews suivantes.",
      createdAt: ts,
    });
  }
  if (signals.some((s) => s.type === "missing_report")) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Rapport final",
      content: "Ajouter un rapport final avant de considérer l'action terminée.",
      createdAt: ts,
    });
  }
  if (signals.some((s) => s.type === "recurring_pattern")) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Motif récurrent détecté",
      content: "Un même type de problème revient — envisager une action préventive ou une checklist dédiée.",
      createdAt: ts,
    });
  }
  if (signals.some((s) => s.type === "follow_up_created")) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Suites d'actions",
      content: "Les follow-up actions aident à ne pas perdre le fil après une review.",
      createdAt: ts,
    });
  }
  if (learnings.length === 0) {
    learnings.push({
      id: `hllearn-${i++}`,
      title: "Trace locale",
      content: "Cette entrée enrichit l'historique pour de futures recommandations (V2.5).",
      createdAt: ts,
    });
  }
  return learnings;
}

export function buildRecommendedBehaviors(
  signals: HistoryLearningSignal[],
  outcome: HistoryLearningOutcome
): RecommendedFutureBehavior[] {
  const behaviors: RecommendedFutureBehavior[] = [];
  let i = 1;

  if (signals.some((s) => s.type === "failed_test")) {
    behaviors.push({
      id: `hlrec-${i++}`,
      label: "Demander un résultat de build explicite",
      description: "Pour les actions techniques, inclure test OK/KO dans le journal.",
      appliesTo: "execution_log",
      confidence: 0.75,
    });
  }
  if (signals.some((s) => s.type === "blocker" || s.type === "fix_created")) {
    behaviors.push({
      id: `hlrec-${i++}`,
      label: "Générer une follow-up corrective",
      description: "Pour les blocages TypeScript ou build, proposer une action fix dédiée.",
      appliesTo: "follow_up_action",
      confidence: 0.7,
    });
  }
  if (outcome === "success") {
    behaviors.push({
      id: `hlrec-${i++}`,
      label: "Archiver après confirmation",
      description: "Quand completed_confirmed, archiver pour libérer l'attention.",
      appliesTo: "history_learning",
      confidence: 0.8,
    });
  }
  if (signals.some((s) => s.type === "recurring_pattern")) {
    behaviors.push({
      id: `hlrec-${i++}`,
      label: "Anticiper les blocages récurrents",
      description: "Prioriser une mission qui adresse le motif récurrent (V2.5).",
      appliesTo: "mission_recommendation",
      confidence: 0.65,
    });
  }
  return behaviors;
}

export function buildEntryFromReview(
  review: ExecutionReview,
  log?: ExecutionLog,
  followUps?: FollowUpActionProposal[]
): Omit<HistoryLearningEntry, "id" | "createdAt" | "updatedAt"> {
  const { status, outcome } = mapReviewToStatusOutcome(review.decision);
  const signals = buildSignalsFromSources(review, log, followUps);
  const learnings = buildLearningsFromSignals(signals);
  const recommendedFutureBehavior = buildRecommendedBehaviors(signals, outcome);

  const projectName = review.metadata?.projectName ?? log?.projectName;
  const title = projectName
    ? `Exécution — ${projectName} (${review.decision})`
    : `Review d'exécution (${review.decision})`;

  return {
    title,
    summary: review.summary,
    status,
    outcome,
    source: "execution_review",
    sourceActionId: review.actionId,
    sourceExecutionPlanId: review.executionPlanId,
    sourceExecutionLogId: review.executionLogId,
    sourceExecutionReviewId: review.id,
    sourceFollowUpActionIds: followUps?.map((f) => f.id),
    projectId: review.metadata?.projectId ?? log?.projectId,
    signals,
    learnings,
    recommendedFutureBehavior,
    metadata: {
      projectName,
      reviewDecision: review.decision,
    },
  };
}

export function buildEntryFromLog(log: ExecutionLog): Omit<HistoryLearningEntry, "id" | "createdAt" | "updatedAt"> {
  let status: HistoryLearningEntryStatus = "unclear";
  let outcome: HistoryLearningOutcome = "unclear";

  if (log.status === "completed_manually") {
    status = "completed";
    outcome = "success";
  } else if (log.status === "abandoned") {
    status = "abandoned";
    outcome = "abandoned";
  } else if (log.status === "blocked" || log.status === "needs_fix") {
    status = "blocked";
    outcome = "blocked";
  } else if (log.status === "started") {
    status = "needs_follow_up";
    outcome = "partial_success";
  }

  const pseudoReview: ExecutionReview = {
    id: `pseudo-${log.id}`,
    executionLogId: log.id,
    executionPlanId: log.executionPlanId,
    actionId: log.queuedActionId,
    decision: "unclear",
    confidence: 40,
    summary: `Journal d'exécution — ${log.projectName}`,
    findings: [],
    validationChecklist: [],
    recommendedNextActions: [],
    createdAt: log.updatedAt,
    updatedAt: log.updatedAt,
    sourceLogStatus: log.status,
    sourceLogEntryCount: log.entries.length,
    metadata: { projectId: log.projectId, projectName: log.projectName },
  };

  const signals = buildSignalsFromSources(pseudoReview, log);
  return {
    title: `Journal — ${log.projectName}`,
    summary: log.finalReport ?? `Suivi manuel avec ${log.entries.length} entrée(s).`,
    status,
    outcome,
    source: "execution_log",
    sourceActionId: log.queuedActionId,
    sourceExecutionPlanId: log.executionPlanId,
    sourceExecutionLogId: log.id,
    projectId: log.projectId,
    signals,
    learnings: buildLearningsFromSignals(signals),
    recommendedFutureBehavior: buildRecommendedBehaviors(signals, outcome),
    metadata: { projectName: log.projectName },
  };
}

export function buildEntryFromFollowUp(
  proposal: FollowUpActionProposal
): Omit<HistoryLearningEntry, "id" | "createdAt" | "updatedAt"> {
  const signals: HistoryLearningSignal[] = [
    {
      id: signalId("follow_up_created", 1),
      type: "follow_up_created",
      label: proposal.title,
      description: proposal.rationale,
      severity: "info",
      relatedId: proposal.id,
      createdAt: nowIso(),
    },
  ];

  return {
    title: `Follow-up — ${proposal.title}`,
    summary: proposal.objective,
    status: "needs_follow_up",
    outcome: "partial_success",
    source: "follow_up_action",
    sourceActionId: proposal.sourceActionId,
    sourceExecutionPlanId: proposal.sourceExecutionPlanId,
    sourceExecutionLogId: proposal.sourceExecutionLogId,
    sourceExecutionReviewId: proposal.sourceReviewId,
    sourceFollowUpActionIds: [proposal.id],
    projectId: proposal.metadata?.projectId,
    signals,
    learnings: buildLearningsFromSignals(signals),
    recommendedFutureBehavior: buildRecommendedBehaviors(signals, "partial_success"),
    metadata: { projectName: proposal.metadata?.projectName },
  };
}

export function createEntryId(): string {
  return `hlentry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
