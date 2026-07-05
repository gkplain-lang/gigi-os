import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import type { QueuedAction } from "@/modules/actionQueue/types";
import {
  buildAggregateContextFromAction,
  getExistingLifecycleForAction,
} from "@/modules/closedLoopLifecycle";
import { buildLifecycleRecord } from "@/modules/closedLoopLifecycle/closedLoopLifecycleEngine";
import { listClosedLoopLifecycles, getLifecyclesByActionId } from "@/modules/closedLoopLifecycle/closedLoopLifecycleStore";
import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle/types";
import { generateGlobalSummary } from "@/modules/historyLearning";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import { getTodayMissionDecision } from "@/modules/missionDecision/missionDecisionStore";
import { enrichMissionOSCommandCenter } from "./missionOSCommandCenter";
import { pickPrimaryActionForFlow } from "./missionOSActionFlowViewModel";
import { mapNextStepTypeToKind, readinessFromLifecycleStatus } from "./missionOSNextStep";
import { computeProgressPercent, phaseFromNextStepType } from "./missionOSProgress";
import type { MissionOSBuildInput, MissionOSViewModel } from "./types";
import { MISSION_OS_SAFETY_NOTE_V31 } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function pickPrimaryAction(projectId?: string): QueuedAction | undefined {
  const primary = pickPrimaryActionForFlow();
  if (!primary) return undefined;
  if (projectId && primary.projectId !== projectId) {
    const actions = loadActionQueueState().actions.filter((a) => a.projectId === projectId);
    if (!actions.length) return primary;
    const inProject = actions.find((a) => a.id === primary.id);
    if (inProject) return inProject;
    return actions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  }
  return primary;
}

function pickActiveLifecycle(actionId?: string): ClosedLoopLifecycle | undefined {
  if (actionId) {
    const existing = getExistingLifecycleForAction(actionId);
    if (existing && !["closed", "archived"].includes(existing.status)) {
      return existing;
    }
    const fromStore = getLifecyclesByActionId(actionId).find(
      (l) => !["closed", "archived"].includes(l.status)
    );
    if (fromStore) return fromStore;
  }

  return listClosedLoopLifecycles().find(
    (l) => !["closed", "archived"].includes(l.status)
  );
}

function buildPreviewLifecycle(action: QueuedAction): ClosedLoopLifecycle {
  const ctx = buildAggregateContextFromAction(action);
  return buildLifecycleRecord({
    title: action.preparedAction.title,
    source: "action_queue",
    ctx,
  });
}

function resolveLifecycle(action?: QueuedAction): ClosedLoopLifecycle | undefined {
  if (!action) return pickActiveLifecycle();
  return pickActiveLifecycle(action.id) ?? buildPreviewLifecycle(action);
}

function defaultMissionView(input: MissionOSBuildInput): MissionOSViewModel {
  const decision = getTodayMissionDecision();
  const hasDecision = Boolean(decision?.status === "accepted");

  const base = {
    currentMissionTitle: input.missionTitle,
    currentMissionSummary:
      input.missionSummary ??
      "Choisis ta mission du jour pour lancer la boucle fermée.",
    currentPhase: (hasDecision ? "preparation" : "mission") as MissionOSViewModel["currentPhase"],
    readiness: (hasDecision ? "needs_preparation" : "needs_user_decision") as MissionOSViewModel["readiness"],
    progressPercent: hasDecision ? 15 : 5,
    currentStepLabel: hasDecision ? "Préparer l'action" : "Choisir la mission",
    currentStepDescription: hasDecision
      ? "Ta mission est choisie — prépare une action concrète."
      : "Compare les missions et accepte celle qui compte aujourd'hui.",
    nextActionLabel: hasDecision ? "Préparer le plan" : "Décider la mission",
    nextActionRoute: hasDecision
      ? input.projectId
        ? `/projects/${input.projectId}`
        : "/projects"
      : "/#mission-decision",
    nextActionKind: (hasDecision ? "prepare_plan" : "decide_mission") as MissionOSViewModel["nextActionKind"],
    activeProjectId: input.projectId,
    learningSummary: undefined as string | undefined,
    reasons: hasDecision
      ? ["Mission acceptée localement.", "Prochaine étape : plan et action préparée."]
      : ["Aucune mission validée pour aujourd'hui.", "Compare les candidats puis accepte manuellement."],
    risks: [] as string[],
    updatedAt: nowIso(),
  };

  return enrichMissionOSCommandCenter(base, input);
}

export function buildMissionOSViewModel(input: MissionOSBuildInput): MissionOSViewModel {
  const action = pickPrimaryAction(input.projectId);
  const lifecycle = resolveLifecycle(action);
  const historySummary = generateGlobalSummary();
  const learningSnippet =
    listHistoryEntries().length > 0
      ? historySummary.summaryText.slice(0, 160)
      : undefined;

  if (!lifecycle) {
    const enriched = defaultMissionView(input);
    return { ...enriched, learningSummary: learningSnippet };
  }

  const next = lifecycle.nextSteps[0];
  const nextType = next?.type;
  const phase = phaseFromNextStepType(nextType);
  const progress = computeProgressPercent(lifecycle.stageItems);

  const stepLabel =
    next?.label ??
    (phase === "mission" ? "Mission du jour" : "Continuer le cycle");

  const stepDescription =
    next?.description ??
    lifecycle.summary ??
    "Suis la boucle mission → préparation → exécution → retour → apprentissage.";

  const reasons = [
    next?.reason ?? "Étape déduite des données locales V2.x.",
    lifecycle.missingStages.length
      ? `Manque : ${lifecycle.missingStages.slice(0, 2).join(", ")}.`
      : "Étapes essentielles avancées.",
  ];

  if (action?.preparedAction.title && action.id !== lifecycle.actionId) {
    reasons.push(`Action active : ${action.preparedAction.title}.`);
  }

  const base = {
    currentMissionTitle: input.missionTitle || lifecycle.title,
    currentMissionSummary:
      input.missionSummary ?? lifecycle.summary.slice(0, 220),
    currentPhase: phase,
    readiness: readinessFromLifecycleStatus(lifecycle.status, nextType),
    progressPercent: progress,
    currentStepLabel: stepLabel,
    currentStepDescription: stepDescription,
    nextActionLabel: next?.targetActionLabel ?? next?.label ?? "Clarifier",
    nextActionRoute: next?.targetRoute ?? "/actions",
    nextActionKind: mapNextStepTypeToKind(nextType),
    activeLifecycleId: lifecycle.id,
    activeActionId: action?.id ?? lifecycle.actionId,
    activeProjectId: input.projectId ?? action?.projectId ?? lifecycle.projectId,
    learningSummary: learningSnippet,
    reasons,
    risks: lifecycle.risks.slice(0, 3).map((r) => r.label),
    updatedAt: lifecycle.updatedAt ?? nowIso(),
  };

  return enrichMissionOSCommandCenter(base, input);
}

export function buildMissionOSViewModelForAction(actionId: string): MissionOSViewModel | undefined {
  const action = loadActionQueueState().actions.find((a) => a.id === actionId);
  if (!action) return undefined;
  return buildMissionOSViewModel({
    missionTitle: action.preparedAction.title,
    missionSummary: action.preparedAction.summary,
    projectId: action.projectId,
  });
}

export function buildMissionOSGuidanceHints(): string[] {
  return [
    "Gigi V3 — une mission, une action, tout manuel.",
    "Ouvre / pour la mission · /actions pour exécuter · /history pour apprendre.",
    MISSION_OS_SAFETY_NOTE_V31,
  ];
}
