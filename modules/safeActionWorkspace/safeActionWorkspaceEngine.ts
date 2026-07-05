import type { QueuedAction } from "@/modules/actionQueue/types";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import type { ExecutionLog } from "@/modules/executionLogs/types";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import type { FollowUpActionProposal } from "@/modules/followUpActions/types";
import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge/types";
import type { HistoryLearningEntry } from "@/modules/historyLearning/types";
import { getCachedExecutionPlan } from "@/modules/executionPlans/executionPlanBuilder";
import { getExecutionLogByQueuedActionId } from "@/modules/executionLogs/executionLogStore";
import { getExecutionReviewByLogId } from "@/modules/executionReviews/executionReviewStore";
import { getProposalsByReviewId } from "@/modules/followUpActions/followUpActionStore";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import {
  getMissionPlanBridgeById,
  listMissionPlanBridges,
  MISSION_PLAN_BRIDGE_ID_PREFIX,
} from "@/modules/missionPlanBridge";
import type {
  SafeActionWorkspace,
  SafeActionWorkspaceChecklistItem,
  SafeActionWorkspaceReadiness,
  SafeActionWorkspaceRisk,
  SafeActionWorkspaceSection,
  SafeActionWorkspaceStatus,
} from "./types";
import {
  DEFAULT_SAFETY_CHECKLIST,
  SAFE_ACTION_WORKSPACE_DISCLAIMER,
  SAFE_ACTION_WORKSPACE_ID_PREFIX,
} from "./types";

export interface WorkspaceAggregateContext {
  action: QueuedAction;
  executionPlan?: ExecutionPlan;
  executionLog?: ExecutionLog;
  executionReview?: ExecutionReview;
  followUps: FollowUpActionProposal[];
  bridge?: MissionPlanBridgeRecord;
  historyEntries: HistoryLearningEntry[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function findBridgeForQueuedAction(
  action: QueuedAction
): MissionPlanBridgeRecord | undefined {
  const byQueue = listMissionPlanBridges().find((b) => b.queueItemId === action.id);
  if (byQueue) return byQueue;

  const sourceId = action.sourceActionId;
  if (!sourceId?.includes(MISSION_PLAN_BRIDGE_ID_PREFIX)) return undefined;

  let candidateId = sourceId;
  while (candidateId.startsWith(MISSION_PLAN_BRIDGE_ID_PREFIX)) {
    const found = getMissionPlanBridgeById(candidateId);
    if (found) return found;
    candidateId = candidateId.slice(MISSION_PLAN_BRIDGE_ID_PREFIX.length);
  }
  return undefined;
}

export function aggregateContextFromQueuedAction(
  action: QueuedAction
): WorkspaceAggregateContext {
  const executionPlan = getCachedExecutionPlan(action.id);
  const executionLog = getExecutionLogByQueuedActionId(action.id);
  const executionReview = executionLog
    ? getExecutionReviewByLogId(executionLog.id)
    : undefined;
  const followUps = executionReview ? getProposalsByReviewId(executionReview.id) : [];
  const bridge = findBridgeForQueuedAction(action);
  const historyEntries = listHistoryEntries(
    action.projectId ? { projectId: action.projectId } : undefined
  ).slice(0, 5);

  return {
    action,
    executionPlan,
    executionLog,
    executionReview,
    followUps,
    bridge,
    historyEntries,
  };
}

export function buildDefaultChecklist(
  existing?: SafeActionWorkspaceChecklistItem[]
): SafeActionWorkspaceChecklistItem[] {
  return DEFAULT_SAFETY_CHECKLIST.map((item, i) => {
    const prev = existing?.find((e) => e.label === item.label);
    return {
      id: prev?.id ?? `check-${i + 1}`,
      label: item.label,
      completed: prev?.completed ?? false,
      required: item.required,
      description: item.description,
    };
  });
}

function mapSeverityToRiskLevel(severity: string): SafeActionWorkspaceRisk["level"] {
  if (severity === "critical") return "critical";
  if (severity === "warning") return "high";
  return "medium";
}

export function buildWorkspaceRisks(ctx: WorkspaceAggregateContext): SafeActionWorkspaceRisk[] {
  const risks: SafeActionWorkspaceRisk[] = [];

  ctx.executionPlan?.risks.forEach((r, i) => {
    risks.push({
      id: `plan-risk-${i}`,
      level: "medium",
      label: r.risk,
      description: r.mitigation,
      relatedId: ctx.executionPlan?.id,
    });
  });

  ctx.bridge?.risks.forEach((r) => {
    risks.push({
      id: r.id,
      level: mapSeverityToRiskLevel(r.severity),
      label: r.label,
      description: r.description,
      mitigation: r.mitigation,
      relatedId: ctx.bridge?.id,
    });
  });

  ctx.action.preparedAction.safetyNotes.forEach((note, i) => {
    risks.push({
      id: `prep-safety-${i}`,
      level: "medium",
      label: "Garde-fou action préparée",
      description: note,
    });
  });

  if (ctx.executionLog?.status === "blocked") {
    risks.push({
      id: "log-blocked",
      level: "critical",
      label: "Blocage signalé dans le log",
      description: "Un blocage a été enregistré manuellement — relire avant de continuer.",
      relatedId: ctx.executionLog.id,
    });
  }

  const failedTests = ctx.executionLog?.entries.filter((e) => e.type === "test_failed") ?? [];
  if (failedTests.length > 0) {
    risks.push({
      id: "log-test-failed",
      level: "high",
      label: "Test échoué signalé",
      description: failedTests[failedTests.length - 1]?.title ?? "Échec de test dans le log.",
      relatedId: ctx.executionLog?.id,
    });
  }

  if (risks.length === 0) {
    risks.push({
      id: "risk-default",
      level: "low",
      label: "Exécution manuelle",
      description: "Gigi ne vérifie pas le repo — valide le périmètre toi-même.",
    });
  }

  return risks;
}

export function buildWorkspacePrerequisites(ctx: WorkspaceAggregateContext): string[] {
  const items: string[] = [];
  ctx.executionPlan?.prerequisites.forEach((p) => items.push(p.label));
  if (ctx.action.status === "pending_review") {
    items.push("Action encore en pending_review — valider manuellement si tu veux exécuter.");
  }
  if (ctx.action.status === "approved") {
    items.push("Action validée localement — exécution manuelle uniquement.");
  }
  if (!ctx.executionPlan) {
    items.push("Plan d'exécution V2.0 non généré — prépare-le depuis la carte action si besoin.");
  }
  return items;
}

export function buildManualNextSteps(ctx: WorkspaceAggregateContext): string[] {
  const fallback = [
    "Relire le plan et la checklist.",
    "Ouvrir Cursor manuellement si pertinent.",
    "Appliquer la correction avec validation humaine.",
    "Relancer build/tests manuellement.",
    "Ajouter le résultat dans le log V2.1.",
    "Générer une review V2.2.",
  ];

  if (ctx.executionPlan?.steps.length) {
    return ctx.executionPlan.steps.slice(0, 6).map((s, i) => `${i + 1}. ${s.title}`);
  }

  if (ctx.bridge?.planDraft?.steps.length) {
    return ctx.bridge.planDraft.steps.slice(0, 6).map((s) => `${s.order}. ${s.title}`);
  }

  return fallback;
}

export function buildWorkspaceSections(ctx: WorkspaceAggregateContext): SafeActionWorkspaceSection[] {
  const ts = nowIso();
  const { action, executionPlan, executionLog, executionReview, followUps, bridge, historyEntries } =
    ctx;

  const sections: SafeActionWorkspaceSection[] = [
    {
      id: "sec-action",
      type: "action_summary",
      title: "Action préparée",
      content: `${action.preparedAction.title}\n\n${action.preparedAction.summary}\n\nStatut file : ${action.status}`,
      status: "available",
      relatedId: action.id,
      createdAt: ts,
    },
    {
      id: "sec-project",
      type: "project_context",
      title: "Projet",
      content: `${action.projectName} (${action.projectId})`,
      status: "available",
      relatedId: action.projectId,
      createdAt: ts,
    },
  ];

  if (bridge) {
    sections.push({
      id: "sec-bridge",
      type: "mission_context",
      title: "Origine · Bridge V2.7",
      content: `Mission acceptée : ${bridge.missionTitle}\n${bridge.missionDescription ?? ""}`,
      status: "available",
      relatedId: bridge.id,
      createdAt: ts,
    });
  }

  sections.push({
    id: "sec-plan",
    type: "execution_plan",
    title: "Plan d'exécution V2.0",
    content: executionPlan
      ? `${executionPlan.title}\n${executionPlan.summary}\nStatut : ${executionPlan.status}\nÉtapes : ${executionPlan.steps.length}`
      : "Plan non généré — crée-le depuis la carte action (action validée).",
    status: executionPlan ? "available" : "missing",
    relatedId: executionPlan?.id,
    createdAt: ts,
  });

  sections.push({
    id: "sec-log",
    type: "execution_logs",
    title: "Journal V2.1",
    content: executionLog
      ? `Statut : ${executionLog.status}\nEntrées : ${executionLog.entries.length}${executionLog.finalReport ? `\nRapport : ${executionLog.finalReport.slice(0, 200)}` : ""}`
      : "Aucun log — démarre le suivi manuel depuis le plan d'exécution.",
    status: executionLog ? "available" : "missing",
    relatedId: executionLog?.id,
    createdAt: ts,
  });

  sections.push({
    id: "sec-review",
    type: "execution_review",
    title: "Review V2.2",
    content: executionReview
      ? `Décision : ${executionReview.decision}\n${executionReview.summary}`
      : "Aucune review — génère-la après le log.",
    status: executionReview ? "available" : "missing",
    relatedId: executionReview?.id,
    createdAt: ts,
  });

  if (followUps.length > 0) {
    sections.push({
      id: "sec-followups",
      type: "follow_ups",
      title: "Follow-ups V2.3",
      content: followUps
        .map((f) => `• ${f.title} (${f.type}, ${f.status}) — ${f.rationale}`)
        .join("\n"),
      status: "available",
      createdAt: ts,
    });
  }

  if (historyEntries.length > 0) {
    sections.push({
      id: "sec-history",
      type: "history",
      title: "Historique V2.4",
      content: historyEntries
        .map((h) => `• ${h.title} — ${h.outcome}`)
        .join("\n"),
      status: "available",
      createdAt: ts,
    });
  }

  if (ctx.executionPlan?.commands.length) {
    sections.push({
      id: "sec-commands",
      type: "manual_steps",
      title: "Commandes théoriques (copier uniquement)",
      content: ctx.executionPlan.commands
        .map((c) => `$ ${c.command} — ${c.description}`)
        .join("\n"),
      status: "available",
      relatedId: ctx.executionPlan.id,
      createdAt: ts,
    });
  }

  sections.push({
    id: "sec-safety",
    type: "safety",
    title: "Sécurité",
    content: SAFE_ACTION_WORKSPACE_DISCLAIMER,
    status: "available",
    createdAt: ts,
  });

  return sections;
}

export function computeWorkspaceReadiness(
  ctx: WorkspaceAggregateContext,
  checklist: SafeActionWorkspaceChecklistItem[]
): SafeActionWorkspaceReadiness {
  const { action, executionPlan, executionLog, executionReview, followUps } = ctx;
  const summaryLen = action.preparedAction.summary?.length ?? 0;
  const hasPlan = Boolean(executionPlan || ctx.bridge?.planDraft);
  const risks = buildWorkspaceRisks(ctx);
  const hasCriticalRisk = risks.some((r) => r.level === "critical" || r.level === "high");

  if (executionLog?.status === "blocked") return "blocked";
  if (executionReview?.decision === "needs_fix") {
    const criticalFinding = executionReview.findings.some((f) => f.severity === "critical");
    if (criticalFinding) return "blocked";
    return "risky";
  }

  const untreatedFix = followUps.some(
    (f) =>
      (f.type === "fix" || f.type === "retry") &&
      f.status === "proposed" &&
      f.riskLevel === "high"
  );
  if (untreatedFix) return "risky";

  if (executionLog?.entries.some((e) => e.type === "test_failed")) return "risky";

  if (hasCriticalRisk && !checklist.filter((c) => c.required).every((c) => c.completed)) {
    return "risky";
  }

  if (action.status === "rejected" || action.status === "needs_revision") return "unclear";

  if (executionLog?.status === "completed_manually" && !executionLog.finalReport) {
    return "unclear";
  }

  if (summaryLen < 20 && !hasPlan) return "missing_context";
  if (!hasPlan && checklist.every((c) => !c.completed)) return "missing_context";

  if (hasPlan || action.preparedAction.summary.length > 20) return "ready";

  return "missing_context";
}

export function mapReadinessToStatus(
  readiness: SafeActionWorkspaceReadiness,
  action: QueuedAction,
  executionLog?: ExecutionLog
): SafeActionWorkspaceStatus {
  if (readiness === "blocked") return "blocked";
  if (readiness === "missing_context") return "needs_context";
  if (executionLog?.status === "completed_manually") return "completed_manually";
  if (executionLog?.status === "started") return "manually_running";
  if (action.status === "pending_review") return "in_review";
  return "ready";
}

export function buildWorkspaceSummary(
  ctx: WorkspaceAggregateContext,
  readiness: SafeActionWorkspaceReadiness
): string {
  const title = ctx.action.preparedAction.title;
  switch (readiness) {
    case "ready":
      return `« ${title} » — contexte agrégé localement. Relis la checklist avant exécution manuelle.`;
    case "missing_context":
      return `« ${title} » — contexte incomplet (plan ou objectif manquant). Complète avant d'exécuter.`;
    case "risky":
      return `« ${title} » — risques ou signaux d'échec détectés localement. Relis plan et log avant toute action.`;
    case "blocked":
      return `« ${title} » — blocage signalé. Résous ou documente avant de continuer.`;
    case "unclear":
      return `« ${title} » — données locales ambiguës. Clarifie le statut avant exécution.`;
    default:
      return `Workspace pour « ${title} ».`;
  }
}

export function createWorkspaceFromContext(
  ctx: WorkspaceAggregateContext,
  existing?: SafeActionWorkspace
): SafeActionWorkspace {
  const timestamp = nowIso();
  const checklist = buildDefaultChecklist(existing?.validationChecklist);
  const readiness = computeWorkspaceReadiness(ctx, checklist);
  const risks = buildWorkspaceRisks(ctx);
  const sections = buildWorkspaceSections(ctx);

  const source = ctx.bridge
    ? "mission_plan_bridge"
    : ctx.executionPlan
      ? "execution_plan"
      : "action_queue";

  return {
    id: existing?.id ?? generateId(SAFE_ACTION_WORKSPACE_ID_PREFIX),
    title: `Workspace · ${ctx.action.preparedAction.title}`,
    status: mapReadinessToStatus(readiness, ctx.action, ctx.executionLog),
    source,
    readiness,
    actionId: ctx.action.id,
    preparedActionId: ctx.action.preparedAction.id,
    executionPlanId: ctx.executionPlan?.id,
    executionLogId: ctx.executionLog?.id,
    executionReviewId: ctx.executionReview?.id,
    followUpActionIds: ctx.followUps.map((f) => f.id),
    historyEntryIds: ctx.historyEntries.map((h) => h.id),
    missionDecisionId: ctx.bridge?.missionDecisionId,
    missionPlanBridgeId: ctx.bridge?.id,
    projectId: ctx.action.projectId,
    missionId: ctx.bridge?.missionId,
    summary: buildWorkspaceSummary(ctx, readiness),
    sections,
    risks,
    prerequisites: buildWorkspacePrerequisites(ctx),
    validationChecklist: checklist,
    manualNextSteps: buildManualNextSteps(ctx),
    safetyNotes: [
      SAFE_ACTION_WORKSPACE_DISCLAIMER,
      ...ctx.action.preparedAction.safetyNotes,
    ],
    userNotes: existing?.userNotes ?? [],
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    metadata: {
      queueStatus: ctx.action.status,
      projectName: ctx.action.projectName,
    },
  };
}

export function createWorkspaceFromBridgeRecord(
  bridge: MissionPlanBridgeRecord
): SafeActionWorkspace | undefined {
  if (!bridge.queueItemId) return undefined;
  const action = loadActionQueueState().actions.find((a) => a.id === bridge.queueItemId);
  if (!action) return undefined;
  return createWorkspaceFromContext(aggregateContextFromQueuedAction(action));
}
