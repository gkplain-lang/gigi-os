import type { QueuedAction } from "@/modules/actionQueue/types";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import { getCachedExecutionPlan } from "@/modules/executionPlans/executionPlanBuilder";
import type { ExecutionLog } from "@/modules/executionLogs/types";
import { getExecutionLogByQueuedActionId } from "@/modules/executionLogs/executionLogStore";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import { getExecutionReviewByLogId } from "@/modules/executionReviews/executionReviewStore";
import type { FollowUpActionProposal } from "@/modules/followUpActions/types";
import { getProposalsByReviewId } from "@/modules/followUpActions/followUpActionStore";
import type { HistoryLearningEntry } from "@/modules/historyLearning/types";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import type { MissionFeedbackSignal } from "@/modules/missionFeedback/types";
import { listMissionFeedbackSignals } from "@/modules/missionFeedback/missionFeedbackStore";
import type { MissionDecision } from "@/modules/missionDecision/types";
import { getMissionDecisionById } from "@/modules/missionDecision/missionDecisionStore";
import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge/types";
import {
  findBridgeForQueuedAction,
} from "@/modules/safeActionWorkspace/safeActionWorkspaceEngine";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace/types";
import { getSafeActionWorkspaceByActionId } from "@/modules/safeActionWorkspace/safeActionWorkspaceStore";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff/types";
import { getHandoffsBySourceActionId } from "@/modules/manualExecutionHandoff/manualExecutionHandoffStore";
import type { ExecutionReportIntake } from "@/modules/executionReportIntake/types";
import { getIntakesBySourceActionId } from "@/modules/executionReportIntake/executionReportIntakeStore";
import type {
  ClosedLoopLifecycle,
  ClosedLoopLifecycleHealth,
  ClosedLoopLifecycleLearning,
  ClosedLoopLifecycleNextStep,
  ClosedLoopLifecycleNextStepType,
  ClosedLoopLifecycleRisk,
  ClosedLoopLifecycleSource,
  ClosedLoopLifecycleStage,
  ClosedLoopLifecycleStageItem,
  ClosedLoopLifecycleStageStatus,
  ClosedLoopLifecycleStatus,
} from "./types";
import {
  CLOSED_LOOP_LIFECYCLE_ID_PREFIX,
  CLOSED_LOOP_LIFECYCLE_STAGE_LABELS,
  ESSENTIAL_STAGES,
  STAGE_ORDER,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface LifecycleAggregateContext {
  action?: QueuedAction;
  executionPlan?: ExecutionPlan;
  executionLog?: ExecutionLog;
  executionReview?: ExecutionReview;
  followUps: FollowUpActionProposal[];
  bridge?: MissionPlanBridgeRecord;
  missionDecision?: MissionDecision;
  workspace?: SafeActionWorkspace;
  handoff?: ManualExecutionHandoff;
  intake?: ExecutionReportIntake;
  historyEntries: HistoryLearningEntry[];
  feedbackSignals: MissionFeedbackSignal[];
}

export function resolveActionById(actionId: string): QueuedAction | undefined {
  return loadActionQueueState().actions.find((a) => a.id === actionId);
}

export function buildAggregateContextFromAction(action: QueuedAction): LifecycleAggregateContext {
  const executionPlan = getCachedExecutionPlan(action.id);
  const executionLog = getExecutionLogByQueuedActionId(action.id);
  const executionReview = executionLog ? getExecutionReviewByLogId(executionLog.id) : undefined;
  const followUps = executionReview ? getProposalsByReviewId(executionReview.id) : [];
  const bridge = findBridgeForQueuedAction(action);
  const missionDecision = bridge?.missionDecisionId
    ? getMissionDecisionById(bridge.missionDecisionId)
    : undefined;
  const workspace = getSafeActionWorkspaceByActionId(action.id);
  const handoff = getHandoffsBySourceActionId(action.id)[0];
  const intake = getIntakesBySourceActionId(action.id)[0];
  const historyEntries = listHistoryEntries(
    action.projectId ? { projectId: action.projectId } : undefined
  ).filter((e) => e.sourceActionId === action.id);
  const feedbackSignals = listMissionFeedbackSignals({
    projectId: action.projectId,
  }).filter((s) =>
    historyEntries.some((h) => h.id === s.relatedHistoryEntryId)
  );

  return {
    action,
    executionPlan,
    executionLog,
    executionReview,
    followUps,
    bridge,
    missionDecision,
    workspace,
    handoff,
    intake,
    historyEntries,
    feedbackSignals,
  };
}

export function buildAggregateContextFromWorkspace(
  workspace: SafeActionWorkspace
): LifecycleAggregateContext {
  if (!workspace.actionId) {
    return {
      followUps: [],
      historyEntries: [],
      feedbackSignals: [],
      workspace,
    };
  }
  const action = resolveActionById(workspace.actionId);
  if (!action) {
    return {
      followUps: [],
      historyEntries: [],
      feedbackSignals: [],
      workspace,
      executionPlan: workspace.executionPlanId
        ? getCachedExecutionPlan(workspace.actionId)
        : undefined,
    };
  }
  const ctx = buildAggregateContextFromAction(action);
  return { ...ctx, workspace: workspace ?? ctx.workspace };
}

export function buildAggregateContextFromHandoff(
  handoff: ManualExecutionHandoff
): LifecycleAggregateContext {
  if (handoff.sourceActionId) {
    const action = resolveActionById(handoff.sourceActionId);
    if (action) return { ...buildAggregateContextFromAction(action), handoff };
  }
  return { followUps: [], historyEntries: [], feedbackSignals: [], handoff };
}

export function buildAggregateContextFromIntake(
  intake: ExecutionReportIntake
): LifecycleAggregateContext {
  if (intake.sourceActionId) {
    const action = resolveActionById(intake.sourceActionId);
    if (action) return { ...buildAggregateContextFromAction(action), intake };
  }
  return { followUps: [], historyEntries: [], feedbackSignals: [], intake };
}

function stageStatus(
  completed: boolean,
  blocked = false,
  optional = false
): ClosedLoopLifecycleStageStatus {
  if (blocked) return "blocked";
  if (completed) return "completed";
  if (optional) return "optional";
  return "missing";
}

function buildStageItems(ctx: LifecycleAggregateContext, userClosed: boolean): ClosedLoopLifecycleStageItem[] {
  const { action, bridge, missionDecision, executionPlan, workspace, handoff, intake, executionLog, executionReview, followUps, historyEntries, feedbackSignals } = ctx;

  const checks: Record<ClosedLoopLifecycleStage, { done: boolean; blocked?: boolean; optional?: boolean; relatedId?: string; desc: string }> = {
    mission_decided: {
      done: Boolean(missionDecision?.selectedCandidateId || bridge?.missionDecisionId),
      relatedId: missionDecision?.id ?? bridge?.missionDecisionId,
      desc: "Une mission a été acceptée via le centre de décision ou le bridge.",
    },
    plan_created: {
      done: Boolean(bridge?.planDraft || action?.sourcePlanId || executionPlan),
      relatedId: bridge?.id,
      desc: "Un plan d'action ou bridge mission → plan existe.",
    },
    action_prepared: {
      done: Boolean(action?.preparedAction),
      relatedId: action?.sourceActionId,
      desc: "Une action préparée est disponible.",
    },
    action_queued: {
      done: Boolean(action),
      relatedId: action?.id,
      desc: "L'action est dans la file de validation.",
    },
    action_approved: {
      done: action?.status === "approved" || action?.status === "copied",
      relatedId: action?.id,
      desc: "L'action a été validée manuellement.",
    },
    execution_plan_created: {
      done: Boolean(executionPlan),
      relatedId: executionPlan?.id,
      desc: "Un plan d'exécution sécurisé V2.0 existe.",
    },
    workspace_created: {
      done: Boolean(workspace),
      relatedId: workspace?.id,
      desc: "Un Safe Action Workspace V2.8 agrège le contexte.",
    },
    handoff_created: {
      done: Boolean(handoff),
      relatedId: handoff?.id,
      desc: "Un handoff manuel V2.9 a été préparé.",
    },
    report_intake_created: {
      done: Boolean(intake?.rawReport?.trim()),
      relatedId: intake?.id,
      desc: "Un rapport d'exécution a été collé (V2.10).",
    },
    log_updated: {
      done: Boolean(executionLog && executionLog.entries.length > 0) || intake?.status === "applied_to_log",
      blocked: executionLog?.status === "blocked",
      relatedId: executionLog?.id,
      desc: "Le journal d'exécution V2.1 contient des entrées.",
    },
    review_created: {
      done: Boolean(executionReview) || intake?.status === "review_generated",
      relatedId: executionReview?.id,
      desc: "Une review V2.2 a été générée localement.",
    },
    follow_up_created: {
      done: followUps.length > 0,
      optional: executionReview?.decision === "completed_confirmed",
      relatedId: followUps[0]?.id,
      desc: "Des actions de suivi V2.3 ont été proposées.",
    },
    history_archived: {
      done: historyEntries.some((e) => e.status === "archived" || e.outcome),
      optional: true,
      relatedId: historyEntries[0]?.id,
      desc: "L'historique V2.4 enregistre ce cycle.",
    },
    mission_feedback_updated: {
      done: feedbackSignals.length > 0,
      optional: true,
      relatedId: feedbackSignals[0]?.id,
      desc: "Le feedback mission V2.5 a capté un signal.",
    },
    cycle_closed: {
      done: userClosed,
      desc: "L'utilisateur a fermé le cycle manuellement.",
    },
  };

  return STAGE_ORDER.map((stage, order) => {
    const c = checks[stage];
    return {
      id: id("stage-"),
      stage,
      status: stageStatus(c.done, c.blocked, c.optional),
      label: CLOSED_LOOP_LIFECYCLE_STAGE_LABELS[stage],
      description: c.desc,
      relatedId: c.relatedId,
      completedAt: c.done ? nowIso() : undefined,
      required: !c.optional && stage !== "cycle_closed",
      order,
    };
  });
}

function computeCompletedAndMissing(items: ClosedLoopLifecycleStageItem[]): {
  completedStages: ClosedLoopLifecycleStage[];
  missingStages: ClosedLoopLifecycleStage[];
  currentStage?: ClosedLoopLifecycleStage;
} {
  const completedStages = items.filter((i) => i.status === "completed").map((i) => i.stage);
  const missingStages = items
    .filter((i) => i.status === "missing" && i.required)
    .map((i) => i.stage);
  const current = items.find((i) => i.status === "missing" || i.status === "available");
  return { completedStages, missingStages, currentStage: current?.stage };
}

function determineHealth(
  ctx: LifecycleAggregateContext,
  items: ClosedLoopLifecycleStageItem[],
  review?: ExecutionReview
): ClosedLoopLifecycleHealth {
  if (ctx.executionLog?.status === "blocked" || ctx.intake?.decision === "blocked") return "blocked";
  if (items.some((i) => i.status === "blocked")) return "blocked";

  const hasFailedReview = review && ["needs_fix", "needs_retry", "needs_new_action"].includes(review.decision);
  const hasTestFail = ctx.intake?.decision === "tests_failed" || ctx.intake?.decision === "needs_fix";
  if (hasFailedReview || hasTestFail) return "risky";

  const essentialMissing = ESSENTIAL_STAGES.filter((s) =>
    items.find((i) => i.stage === s && i.status !== "completed")
  );
  if (essentialMissing.length > 0) return "incomplete";

  const unclearCount = items.filter((i) => i.status === "unclear").length;
  if (unclearCount > 2) return "unclear";

  return "healthy";
}

function determineStatus(
  ctx: LifecycleAggregateContext,
  items: ClosedLoopLifecycleStageItem[],
  userClosed: boolean,
  health: ClosedLoopLifecycleHealth
): ClosedLoopLifecycleStatus {
  if (userClosed) return "closed";

  if (health === "blocked") return "blocked";
  if (health === "unclear") return "unclear";

  const hasHandoff = Boolean(ctx.handoff);
  const hasIntake = Boolean(ctx.intake?.rawReport?.trim());
  const hasLog = Boolean(ctx.executionLog?.entries.length);
  const hasReview = Boolean(ctx.executionReview);

  if (hasHandoff && !hasIntake) return "waiting_for_report";
  if ((ctx.workspace || ctx.handoff) && !hasIntake && !hasLog) return "waiting_for_execution";

  if (hasLog && !hasReview) return "needs_review";
  if (hasReview && ["needs_fix", "needs_retry", "needs_new_action"].includes(ctx.executionReview!.decision)) {
    if (ctx.followUps.length === 0) return "needs_follow_up";
  }

  const hasHistory = ctx.historyEntries.length > 0;
  const hasFeedback = ctx.feedbackSignals.length > 0;
  if (hasReview && hasHistory && hasFeedback && health !== "incomplete") return "learning_ready";

  const nextMissing = items.find((i) => i.status === "missing" && i.required);
  if (nextMissing) return "waiting_for_user";

  return "active";
}

function buildNextSteps(
  ctx: LifecycleAggregateContext,
  items: ClosedLoopLifecycleStageItem[],
  userClosed: boolean
): ClosedLoopLifecycleNextStep[] {
  if (userClosed) return [];

  const steps: ClosedLoopLifecycleNextStep[] = [];
  const ts = nowIso();

  const add = (
    type: ClosedLoopLifecycleNextStepType,
    label: string,
    description: string,
    reason: string,
    priority: number,
    route?: string,
    actionLabel?: string,
    relatedId?: string
  ) => {
    steps.push({
      id: id("nstep-"),
      type,
      label,
      description,
      reason,
      priority,
      targetRoute: route,
      targetActionLabel: actionLabel,
      relatedId,
      manualOnly: true,
      createdAt: ts,
    });
  };

  if (!ctx.missionDecision && !ctx.bridge) {
    add("choose_mission", "Choisir une mission", "Accepte une mission via le centre de décision.", "Aucune mission liée.", 1, "/");
    return steps;
  }

  if (ctx.bridge && !ctx.action) {
    add("add_to_queue", "Ajouter à la file", "Transforme le bridge en action queue.", "Bridge sans action queue.", 1, "/actions");
    return steps;
  }

  if (!ctx.action) return steps;

  if (ctx.action.status === "pending_review") {
    add("approve_action", "Valider l'action", "Approuve l'action dans la file.", "Action en attente de validation.", 1, "/actions", "Valider");
    return steps;
  }

  if (!ctx.executionPlan) {
    add("create_execution_plan", "Créer plan d'exécution", "Génère le plan V2.0.", "Plan d'exécution absent.", 1, "/actions", "Préparer exécution");
    return steps;
  }

  if (!ctx.workspace) {
    add("create_workspace", "Créer workspace", "Ouvre le Safe Action Workspace.", "Workspace absent.", 1, "/actions", "Ouvrir workspace");
    return steps;
  }

  if (!ctx.handoff) {
    add("create_handoff", "Créer handoff", "Prépare le paquet de passation V2.9.", "Handoff absent.", 1, "/actions", "Créer handoff");
    return steps;
  }

  if (!ctx.intake?.rawReport?.trim()) {
    add("paste_report", "Coller le rapport", "Importe le rapport d'exécution V2.10.", "Rapport non collé.", 1, "/actions", "Coller rapport");
    return steps;
  }

  if (ctx.intake && ctx.intake.status !== "applied_to_log" && ctx.intake.proposedLogEntries.length > 0) {
    add("apply_report_to_log", "Appliquer au log", "Valide l'application des entrées proposées.", "Rapport parsé mais log non mis à jour.", 1, "/actions", "Appliquer au log");
    return steps;
  }

  if (ctx.executionLog && !ctx.executionReview) {
    add("generate_review", "Générer review", "Crée une review V2.2 locale.", "Log présent sans review.", 1, "/actions", "Générer review");
    return steps;
  }

  if (
    ctx.executionReview &&
    ["needs_fix", "needs_retry", "needs_new_action"].includes(ctx.executionReview.decision) &&
    ctx.followUps.length === 0
  ) {
    add("create_follow_up", "Créer follow-up", "Propose une action corrective V2.3.", "Review indique un suivi nécessaire.", 1, "/actions");
    return steps;
  }

  if (ctx.executionReview && ctx.historyEntries.length === 0) {
    add("archive_learning", "Archiver l'apprentissage", "Enrichis l'historique V2.4.", "Historique non alimenté.", 2, "/history");
  }

  if (ctx.historyEntries.length > 0 && ctx.feedbackSignals.length === 0) {
    add("update_mission_feedback", "Mettre à jour feedback mission", "Régénère le feedback V2.5.", "Feedback mission absent.", 2, "/history");
  }

  const essentialDone = ESSENTIAL_STAGES.every((s) =>
    items.find((i) => i.stage === s)?.status === "completed"
  );
  if (essentialDone && ctx.executionReview) {
    add("close_cycle", "Fermer le cycle", "Marque le cycle comme clos manuellement.", "Étapes essentielles complètes.", 1, "/actions", "Fermer cycle");
  }

  if (steps.length === 0) {
    add("clarify_status", "Clarifier le statut", "Relis les étapes et notes du cycle.", "Statut ambigu.", 3, "/actions");
  }

  return steps.sort((a, b) => a.priority - b.priority);
}

function buildRisks(ctx: LifecycleAggregateContext): ClosedLoopLifecycleRisk[] {
  const risks: ClosedLoopLifecycleRisk[] = [
    {
      id: id("risk-"),
      label: "Données déclaratives",
      description: "Ce cycle est basé sur des données locales non vérifiées techniquement.",
      severity: "info",
    },
  ];

  if (ctx.intake?.decision === "tests_failed" || ctx.intake?.decision === "needs_fix") {
    risks.push({
      id: id("risk-"),
      label: "Test échoué déclaré",
      description: "Le rapport intake signale un échec ou une correction nécessaire.",
      severity: "warning",
      relatedId: ctx.intake.id,
    });
  }

  if (ctx.executionLog?.status === "blocked") {
    risks.push({
      id: id("risk-"),
      label: "Blocage dans le log",
      description: "Le journal d'exécution indique un blocage.",
      severity: "critical",
      relatedId: ctx.executionLog.id,
    });
  }

  if (ctx.executionReview?.decision === "needs_fix") {
    risks.push({
      id: id("risk-"),
      label: "Review : correction nécessaire",
      description: ctx.executionReview.summary,
      severity: "warning",
      relatedId: ctx.executionReview.id,
    });
  }

  return risks;
}

function buildLearnings(ctx: LifecycleAggregateContext): ClosedLoopLifecycleLearning[] {
  const learnings: ClosedLoopLifecycleLearning[] = [];

  ctx.historyEntries.forEach((h) => {
    learnings.push({
      id: id("learn-"),
      label: h.title,
      description: h.signals?.map((s) => s.label).join(" · ") || h.outcome || "Entrée historique",
      source: "history",
      confidence: 70,
      relatedId: h.id,
    });
  });

  ctx.feedbackSignals.forEach((s) => {
    learnings.push({
      id: id("learn-"),
      label: s.label,
      description: s.type,
      source: "mission_feedback",
      confidence: s.confidence,
      relatedId: s.id,
    });
  });

  if (ctx.intake?.parsedReport.finalSummary) {
    learnings.push({
      id: id("learn-"),
      label: "Rapport final",
      description: ctx.intake.parsedReport.finalSummary,
      source: "intake",
      confidence: ctx.intake.confidence,
      relatedId: ctx.intake.id,
    });
  }

  if (ctx.executionReview?.recommendedNextActions.length) {
    learnings.push({
      id: id("learn-"),
      label: "Recommandation review",
      description: ctx.executionReview.recommendedNextActions[0]?.label ?? "",
      source: "review",
      confidence: ctx.executionReview.confidence,
      relatedId: ctx.executionReview.id,
    });
  }

  return learnings.slice(0, 8);
}

function buildSummaryText(
  ctx: LifecycleAggregateContext,
  status: ClosedLoopLifecycleStatus,
  missingStages: ClosedLoopLifecycleStage[],
  nextSteps: ClosedLoopLifecycleNextStep[]
): string {
  const title = ctx.action?.preparedAction.title ?? "Action";
  const parts: string[] = [`Cycle : ${title}.`, `Statut : ${status}.`];

  if (ctx.handoff && ctx.intake) {
    parts.push("Handoff transmis et rapport collé.");
  } else if (ctx.handoff) {
    parts.push("Handoff préparé — rapport en attente.");
  }

  if (ctx.executionLog?.entries.length) {
    parts.push(`Journal : ${ctx.executionLog.entries.length} entrée(s).`);
  }

  if (ctx.executionReview) {
    parts.push(`Review : ${ctx.executionReview.decision}.`);
  }

  if (missingStages.length) {
    parts.push(`Manque : ${missingStages.slice(0, 3).map((s) => CLOSED_LOOP_LIFECYCLE_STAGE_LABELS[s]).join(", ")}.`);
  }

  if (nextSteps[0]) {
    parts.push(`Prochaine étape : ${nextSteps[0].label}.`);
  }

  parts.push("Données locales déclaratives — aucune vérif repo.");
  return parts.join(" ");
}

export interface LifecycleBuildInput {
  title: string;
  source: ClosedLoopLifecycleSource;
  ctx: LifecycleAggregateContext;
  userClosed?: boolean;
  userNotes?: string[];
  existing?: ClosedLoopLifecycle;
}

export function buildLifecycleRecord(input: LifecycleBuildInput): ClosedLoopLifecycle {
  const { ctx, userClosed = false } = input;
  const timestamp = nowIso();
  const stageItems = buildStageItems(ctx, userClosed);
  const { completedStages, missingStages, currentStage } = computeCompletedAndMissing(stageItems);
  const health = determineHealth(ctx, stageItems, ctx.executionReview);
  const status = determineStatus(ctx, stageItems, userClosed, health);
  const nextSteps = buildNextSteps(ctx, stageItems, userClosed);
  const risks = buildRisks(ctx);
  const learnings = buildLearnings(ctx);
  const summary = buildSummaryText(ctx, status, missingStages, nextSteps);

  return {
    id: input.existing?.id ?? `${CLOSED_LOOP_LIFECYCLE_ID_PREFIX}${Date.now()}`,
    title: input.title,
    status: input.existing?.status === "archived" ? "archived" : status,
    health,
    source: input.source,
    projectId: ctx.action?.projectId ?? ctx.workspace?.projectId,
    missionId: ctx.workspace?.missionId ?? ctx.bridge?.missionId,
    actionId: ctx.action?.id,
    missionDecisionId: ctx.missionDecision?.id ?? ctx.bridge?.missionDecisionId,
    missionPlanBridgeId: ctx.bridge?.id,
    executionPlanId: ctx.executionPlan?.id ?? ctx.workspace?.executionPlanId,
    workspaceId: ctx.workspace?.id,
    handoffId: ctx.handoff?.id,
    reportIntakeId: ctx.intake?.id,
    executionLogId: ctx.executionLog?.id ?? ctx.workspace?.executionLogId,
    executionReviewId: ctx.executionReview?.id ?? ctx.workspace?.executionReviewId,
    followUpActionIds: ctx.followUps.map((f) => f.id),
    historyEntryIds: ctx.historyEntries.map((h) => h.id),
    missionFeedbackSignalIds: ctx.feedbackSignals.map((s) => s.id),
    completedStages,
    missingStages,
    stageItems,
    currentStage,
    nextSteps,
    summary,
    risks,
    learnings,
    userNotes: input.userNotes ?? input.existing?.userNotes ?? [],
    userClosed,
    createdAt: input.existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    closedAt: userClosed ? input.existing?.closedAt ?? timestamp : undefined,
    archivedAt: input.existing?.archivedAt,
    metadata: input.existing?.metadata ?? {},
  };
}

export function recalculateLifecycleRecord(lifecycle: ClosedLoopLifecycle): ClosedLoopLifecycle {
  let ctx: LifecycleAggregateContext = { followUps: [], historyEntries: [], feedbackSignals: [] };

  if (lifecycle.actionId) {
    const action = resolveActionById(lifecycle.actionId);
    if (action) ctx = buildAggregateContextFromAction(action);
  }

  return buildLifecycleRecord({
    title: lifecycle.title,
    source: lifecycle.source,
    ctx,
    userClosed: lifecycle.userClosed,
    userNotes: lifecycle.userNotes,
    existing: lifecycle,
  });
}
