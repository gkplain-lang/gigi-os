import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import type { QueuedAction } from "@/modules/actionQueue/types";
import type { PreparedAction } from "@/modules/preparedActions/types";
import { buildRulesForType, DEFAULT_EXPECTED_REPORT, DEFAULT_SAFETY_NOTES } from "./executionPlanRules";
import type {
  ExecutionPlan,
  ExecutionPlanBuildInput,
  ExecutionPlanIntent,
  ExecutionPlansState,
} from "./types";
import { EXECUTION_PLANS_STORAGE_KEY } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function generatePlanId(queuedActionId: string): string {
  return `explan-${queuedActionId}-${Date.now()}`;
}

export function buildExecutionPlanFromInput(input: ExecutionPlanBuildInput): ExecutionPlan {
  const timestamp = nowIso();
  const rules = buildRulesForType(input);

  return {
    id: generatePlanId(input.queuedActionId),
    queuedActionId: input.queuedActionId,
    projectId: input.projectId,
    projectName: input.projectName,
    title: `Exécution — ${input.preparedActionTitle}`,
    summary: `Plan d'exécution sécurisé pour « ${input.preparedActionTitle} » — ${input.preparedActionSummary}`,
    executionMode: rules.executionMode,
    status: "ready_for_manual_execution",
    objective: rules.objective,
    prerequisites: [
      {
        id: "pre-1",
        label: "Action validée dans /actions",
        description: "Cette action a été approuvée manuellement avant exécution.",
      },
      {
        id: "pre-2",
        label: "Environnement local prêt",
        description: "Repo cloné, dépendances installées, pas de changements non commités non voulus.",
      },
    ],
    targetFiles: rules.targetFiles,
    steps: rules.steps,
    commands: rules.commands,
    tests: rules.tests,
    risks: rules.risks,
    rollbackPlan: rules.rollbackPlan,
    validationChecklist: rules.validationChecklist,
    expectedReport: [...DEFAULT_EXPECTED_REPORT],
    safetyNotes: [...DEFAULT_SAFETY_NOTES],
    createdAt: timestamp,
    updatedAt: timestamp,
    dryRunOnly: true,
    requiresFinalConfirmation: true,
  };
}

export function buildExecutionPlanFromQueuedAction(action: QueuedAction): ExecutionPlan {
  const pa = action.preparedAction;
  return buildExecutionPlanFromInput({
    queuedActionId: action.id,
    projectId: action.projectId,
    projectName: action.projectName,
    preparedActionType: pa.type,
    preparedActionTitle: pa.title,
    preparedActionSummary: pa.summary,
    preparedActionBody: pa.body,
    relatedFiles: pa.relatedFiles,
    suggestedCommands: pa.commands,
  });
}

export function buildExecutionPlanFromPreparedAction(
  prepared: PreparedAction,
  projectName: string,
  queuedActionId = `sim-${prepared.id}`
): ExecutionPlan {
  return buildExecutionPlanFromInput({
    queuedActionId,
    projectId: prepared.projectId,
    projectName,
    preparedActionType: prepared.type,
    preparedActionTitle: prepared.title,
    preparedActionSummary: prepared.summary,
    preparedActionBody: prepared.body,
    relatedFiles: prepared.relatedFiles,
    suggestedCommands: prepared.commands,
  });
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const EXECUTION_KEYWORDS = [
  "plan d execution",
  "plan d'execution",
  "prepare l execution",
  "prépare l'exécution",
  "prepare l'execution",
  "preparer l execution",
  "comment j execute",
  "comment executer",
  "comment exécuter",
  "lance l action",
  "lancer l action",
  "action validee",
  "action validée",
  "qu est ce que je fais maintenant",
  "execution plan",
  "executer cette action",
  "exécuter cette action",
];

export function detectExecutionPlanIntent(objective: string): ExecutionPlanIntent {
  const norm = normalize(objective);
  const isExecutionPlan = EXECUTION_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return {
    isExecutionPlan,
    projectId: detectProjectId(norm),
  };
}

export function loadExecutionPlansState(): ExecutionPlansState {
  if (typeof window === "undefined") return { plans: [] };
  try {
    const raw = localStorage.getItem(EXECUTION_PLANS_STORAGE_KEY);
    if (!raw) return { plans: [] };
    const parsed = JSON.parse(raw) as ExecutionPlansState;
    if (!parsed?.plans) return { plans: [] };
    return parsed;
  } catch {
    return { plans: [] };
  }
}

export function saveExecutionPlan(plan: ExecutionPlan): void {
  if (typeof window === "undefined") return;
  try {
    const state = loadExecutionPlansState();
    const filtered = state.plans.filter((p) => p.queuedActionId !== plan.queuedActionId);
    const next: ExecutionPlansState = {
      plans: [plan, ...filtered],
      lastUpdatedAt: plan.updatedAt,
    };
    localStorage.setItem(EXECUTION_PLANS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getCachedExecutionPlan(queuedActionId: string): ExecutionPlan | undefined {
  return loadExecutionPlansState().plans.find((p) => p.queuedActionId === queuedActionId);
}

export function findApprovedQueuedActions(projectId?: string): QueuedAction[] {
  const queue = loadActionQueueState();
  return queue.actions.filter(
    (a) => a.status === "approved" && (!projectId || a.projectId === projectId)
  );
}

export function findFirstApprovedQueuedAction(projectId?: string): QueuedAction | undefined {
  return findApprovedQueuedActions(projectId)[0];
}

export function markPlanCompletedManually(planId: string): void {
  if (typeof window === "undefined") return;
  try {
    const state = loadExecutionPlansState();
    const next: ExecutionPlansState = {
      plans: state.plans.map((p) =>
        p.id === planId
          ? { ...p, status: "completed_manually" as const, updatedAt: nowIso() }
          : p
      ),
      lastUpdatedAt: nowIso(),
    };
    localStorage.setItem(EXECUTION_PLANS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
