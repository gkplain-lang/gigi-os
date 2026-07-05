import type { QueuedAction } from "@/modules/actionQueue/types";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import { QUEUED_STATUS_LABELS } from "@/modules/actionQueue/types";
import {
  buildAggregateContextFromAction,
  getExistingLifecycleForAction,
} from "@/modules/closedLoopLifecycle";
import { buildLifecycleRecord } from "@/modules/closedLoopLifecycle/closedLoopLifecycleEngine";
import { getLifecyclesByActionId } from "@/modules/closedLoopLifecycle/closedLoopLifecycleStore";
import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle/types";
import { getTodayMissionDecision } from "@/modules/missionDecision/missionDecisionStore";
import { computeProgressPercent } from "./missionOSProgress";
import {
  ACTION_FLOW_STAGE_LABELS,
  ACTION_FLOW_STATUS_LABELS,
  ACTION_FLOW_STAGES,
  mapStageToFlowStepId,
  type ActionFlowItemStatus,
  type ActionFlowStage,
} from "./missionOSActionFlow";
import { MISSION_OS_SAFETY_NOTE_V31 } from "./types";

export interface ActionFlowStageItem {
  stage: ActionFlowStage;
  label: string;
  count: number;
  isActive: boolean;
}

export interface ActionFlowGroupedAction {
  actionId: string;
  title: string;
  summary: string;
  projectName: string;
  stage: ActionFlowStage;
  stageLabel: string;
  status: ActionFlowItemStatus;
  statusLabel: string;
}

export interface ActionFlowViewModel {
  primaryActionId?: string;
  primaryActionTitle: string;
  primaryActionSummary: string;
  activeStage: ActionFlowStage;
  activeStageLabel: string;
  activeStatusLabel: string;
  primaryCtaLabel: string;
  primaryCtaRoute: string;
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
  whyThisAction: string;
  safetyNote: string;
  progressPercent: number;
  stageItems: ActionFlowStageItem[];
  groupedActions: ActionFlowGroupedAction[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  details: string[];
  blockers: string[];
  activeLifecycleId?: string;
  flowStepId: ReturnType<typeof mapStageToFlowStepId>;
}

interface FlowState {
  stage: ActionFlowStage;
  status: ActionFlowItemStatus;
  priority: number;
  why: string;
  ctaLabel: string;
  blockers: string[];
}

function resolveLifecycle(action: QueuedAction): ClosedLoopLifecycle | undefined {
  const existing = getExistingLifecycleForAction(action.id);
  if (existing && !["closed", "archived"].includes(existing.status)) return existing;
  const fromStore = getLifecyclesByActionId(action.id).find(
    (l) => !["closed", "archived"].includes(l.status)
  );
  if (fromStore) return fromStore;
  return buildLifecycleRecord({
    title: action.preparedAction.title,
    source: "action_queue",
    ctx: buildAggregateContextFromAction(action),
  });
}

function actionAnchor(actionId: string): string {
  return `/actions#action-${actionId}`;
}

function deriveFlowState(
  action: QueuedAction | undefined,
  lifecycle: ClosedLoopLifecycle | undefined,
  hasAcceptedMission: boolean
): FlowState {
  if (!action) {
    if (!hasAcceptedMission) {
      return {
        stage: "decide",
        status: "waiting_decision",
        priority: 900,
        why: "Aucune mission validée — choisis d'abord ta mission du jour.",
        ctaLabel: "Décider la mission",
        blockers: [],
      };
    }
    return {
      stage: "decide",
      status: "unclear",
      priority: 950,
      why: "Aucune action en file — prépare une action depuis un projet ou la mission.",
      ctaLabel: "Ouvrir la mission",
      blockers: [],
    };
  }

  const ctx = buildAggregateContextFromAction(action);
  const lcStatus = lifecycle?.status;
  const handoff = ctx.handoff;
  const workspace = ctx.workspace;
  const intake = ctx.intake;

  if (lcStatus === "needs_review" || lcStatus === "needs_follow_up") {
    return {
      stage: "cycle",
      status: "cycle_to_close",
      priority: 60,
      why: "Le cycle demande une review ou un suivi manuel.",
      ctaLabel: lcStatus === "needs_follow_up" ? "Traiter le retour" : "Voir le cycle complet",
      blockers: lifecycle?.risks.slice(0, 2).map((r) => r.label) ?? [],
    };
  }

  if (
    action.status === "approved" &&
    (lcStatus === "waiting_for_report" ||
      handoff?.status === "waiting_for_report" ||
      (handoff &&
        !intake &&
        ["handed_off", "copied", "ready_to_copy"].includes(handoff.status)))
  ) {
    if (intake && !ctx.executionLog) {
      return {
        stage: "report",
        status: "report_to_review",
        priority: 12,
        why: "Un rapport a été collé — applique-le au journal manuellement.",
        ctaLabel: "Traiter le rapport",
        blockers: [],
      };
    }
    return {
      stage: "report",
      status: "waiting_report",
      priority: 10,
      why: "L'action est validée — exécute manuellement puis colle le rapport.",
      ctaLabel: "Coller le rapport d'exécution",
      blockers: [],
    };
  }

  if (handoff && ["ready_to_copy", "copied", "draft"].includes(handoff.status)) {
    return {
      stage: "handoff",
      status: "ready_for_handoff",
      priority: 20,
      why: "La passation est prête — copie-la et exécute hors de Gigi.",
      ctaLabel: "Ouvrir la passation",
      blockers: [],
    };
  }

  if (workspace && workspace.status !== "archived" && !handoff) {
    return {
      stage: "handoff",
      status: "ready_for_handoff",
      priority: 30,
      why: "L'espace sécurisé est prêt — crée la passation Cursor / humain.",
      ctaLabel: "Créer la passation",
      blockers: workspace.readiness === "blocked" ? ["Espace sécurisé bloqué"] : [],
    };
  }

  if (action.status === "pending_review") {
    return {
      stage: "validate",
      status: "waiting_validation",
      priority: 40,
      why: "Gigi a préparé cette action — tu dois la valider ou la rejeter.",
      ctaLabel: "Valider l'action",
      blockers: [],
    };
  }

  if (action.status === "approved" && !ctx.executionPlan) {
    return {
      stage: "prepare",
      status: "ready_to_prepare",
      priority: 50,
      why: "Action validée — prépare le plan d'exécution avant la passation.",
      ctaLabel: "Préparer le plan d'exécution",
      blockers: [],
    };
  }

  if (action.status === "approved" && ctx.executionPlan && !workspace) {
    return {
      stage: "prepare",
      status: "ready_to_prepare",
      priority: 45,
      why: "Plan prêt — ouvre l'espace d'action sécurisé.",
      ctaLabel: "Ouvrir l'espace sécurisé",
      blockers: [],
    };
  }

  if (["rejected"].includes(action.status)) {
    return {
      stage: "done",
      status: "completed",
      priority: 800,
      why: "Action rejetée — consulte la file ou prépare une nouvelle action.",
      ctaLabel: "Voir la file complète",
      blockers: [],
    };
  }

  if (lcStatus === "closed" || lcStatus === "archived") {
    return {
      stage: "done",
      status: "completed",
      priority: 700,
      why: "Cycle terminé — choisis la suite ou une nouvelle mission.",
      ctaLabel: "Choisir la suite",
      blockers: [],
    };
  }

  if (action.status === "approved") {
    return {
      stage: "prepare",
      status: "ready_to_prepare",
      priority: 55,
      why: "Action validée — continue la préparation manuelle.",
      ctaLabel: "Continuer la préparation",
      blockers: [],
    };
  }

  return {
    stage: "validate",
    status: "unclear",
    priority: 400,
    why: "Statut à clarifier — ouvre les détails de l'action.",
    ctaLabel: "Voir l'action",
    blockers: ["Statut peu clair"],
  };
}

function resolveCtaRoute(stage: ActionFlowStage, actionId?: string): string {
  switch (stage) {
    case "decide":
      return "/#mission-decision";
    case "done":
      return "/";
    default:
      return actionId ? actionAnchor(actionId) : "/actions";
  }
}

function resolveSecondaryCta(stage: ActionFlowStage): { label: string; route: string } | undefined {
  if (stage === "decide") {
    return { label: "Voir les actions", route: "/actions" };
  }
  return { label: "Retour mission", route: "/" };
}

export function pickPrimaryActionForFlow(actionsInput?: QueuedAction[]): QueuedAction | undefined {
  const actions = actionsInput ?? loadActionQueueState().actions;
  if (!actions.length) return undefined;

  const hasAcceptedMission = Boolean(getTodayMissionDecision()?.status === "accepted");

  const scored = actions.map((action) => {
    const lifecycle = resolveLifecycle(action);
    const flow = deriveFlowState(action, lifecycle, hasAcceptedMission);
    return { action, flow };
  });

  scored.sort((a, b) => {
    if (a.flow.priority !== b.flow.priority) return a.flow.priority - b.flow.priority;
    return b.action.updatedAt.localeCompare(a.action.updatedAt);
  });

  const top = scored[0];
  if (top.flow.stage === "done" && scored.length > 1) {
    const active = scored.find((s) => s.flow.stage !== "done");
    return active?.action ?? top.action;
  }

  return top?.action;
}

function buildGroupedActions(actions: QueuedAction[]): ActionFlowGroupedAction[] {
  const hasAcceptedMission = Boolean(getTodayMissionDecision()?.status === "accepted");

  return actions.map((action) => {
    const lifecycle = resolveLifecycle(action);
    const flow = deriveFlowState(action, lifecycle, hasAcceptedMission);
    return {
      actionId: action.id,
      title: action.preparedAction.title,
      summary: action.preparedAction.summary,
      projectName: action.projectName,
      stage: flow.stage,
      stageLabel: ACTION_FLOW_STAGE_LABELS[flow.stage],
      status: flow.status,
      statusLabel: ACTION_FLOW_STATUS_LABELS[flow.status],
    };
  });
}

function countByStage(grouped: ActionFlowGroupedAction[]): Record<ActionFlowStage, number> {
  const counts = Object.fromEntries(
    ACTION_FLOW_STAGES.map((s) => [s, 0])
  ) as Record<ActionFlowStage, number>;

  for (const item of grouped) {
    if (item.stage !== "done") counts[item.stage] += 1;
  }
  return counts;
}

export function buildActionFlowViewModel(actionsInput?: QueuedAction[]): ActionFlowViewModel {
  const actions = actionsInput ?? loadActionQueueState().actions;
  const hasAcceptedMission = Boolean(getTodayMissionDecision()?.status === "accepted");
  const primaryAction = pickPrimaryActionForFlow(actions);
  const lifecycle = primaryAction ? resolveLifecycle(primaryAction) : undefined;
  const flow = deriveFlowState(primaryAction, lifecycle, hasAcceptedMission);
  const grouped = buildGroupedActions(actions);
  const stageCounts = countByStage(grouped);
  const progress = lifecycle ? computeProgressPercent(lifecycle.stageItems) : 0;

  const stageItems: ActionFlowStageItem[] = ACTION_FLOW_STAGES.filter((s) => s !== "done").map(
    (stage) => ({
      stage,
      label: ACTION_FLOW_STAGE_LABELS[stage],
      count: stageCounts[stage],
      isActive: stage === flow.stage,
    })
  );

  const isEmpty = !primaryAction && !hasAcceptedMission;
  const noActions = !primaryAction && hasAcceptedMission;

  const details: string[] = [];
  if (primaryAction) {
    details.push(`Projet : ${primaryAction.projectName}`);
    details.push(`Statut file : ${QUEUED_STATUS_LABELS[primaryAction.status]}`);
    if (lifecycle?.summary) details.push(lifecycle.summary.slice(0, 120));
  }

  const primaryRoute =
    flow.stage === "decide" || flow.stage === "done"
      ? resolveCtaRoute(flow.stage, primaryAction?.id)
      : resolveCtaRoute(flow.stage, primaryAction?.id);

  const secondary = resolveSecondaryCta(flow.stage);

  return {
    primaryActionId: primaryAction?.id,
    primaryActionTitle: primaryAction?.preparedAction.title ?? "Aucune action active",
    primaryActionSummary:
      primaryAction?.preparedAction.summary ??
      (noActions
        ? "Prépare une action depuis la mission ou un projet."
        : "Décide ta mission pour lancer le flux."),
    activeStage: flow.stage,
    activeStageLabel: ACTION_FLOW_STAGE_LABELS[flow.stage],
    activeStatusLabel: ACTION_FLOW_STATUS_LABELS[flow.status],
    primaryCtaLabel: flow.ctaLabel,
    primaryCtaRoute: primaryRoute,
    secondaryCtaLabel: secondary?.label,
    secondaryCtaRoute: secondary?.route,
    whyThisAction: flow.why,
    safetyNote: MISSION_OS_SAFETY_NOTE_V31,
    progressPercent: progress,
    stageItems,
    groupedActions: grouped,
    emptyStateTitle: isEmpty ? "Aucune action en cours" : noActions ? "File d'actions vide" : undefined,
    emptyStateDescription: isEmpty
      ? "Décide ta mission du jour, puis prépare une action — Gigi ne choisit rien à ta place."
      : noActions
        ? "Ta mission est choisie. Ajoute une action préparée depuis un projet."
        : undefined,
    details,
    blockers: flow.blockers,
    activeLifecycleId: lifecycle?.id,
    flowStepId: mapStageToFlowStepId(flow.stage),
  };
}
