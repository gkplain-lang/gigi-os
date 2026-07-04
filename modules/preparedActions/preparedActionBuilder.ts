import type { ActionPlan, PreparedActionPreview } from "@/modules/actionPlans/types";
import type { PreparedActionType as PlanPreviewType } from "@/modules/actionPlans/types";
import {
  buildBodyForType,
  defaultTypeForProject,
  getRelatedFiles,
  getSafetyNotes,
  getSuggestedCommands,
  inferTypeFromSourceId,
  PREPARED_VALIDATION_DEFAULTS,
} from "./preparedActionRules";
import { PREPARED_ACTION_DRY_RUN_MESSAGE } from "./preparedActionSummary";
import type {
  PreparedAction,
  PreparedActionBuildInput,
  PreparedActionIntent,
  PreparedActionType,
} from "./types";
import { PREPARED_ACTION_TYPE_LABELS } from "./types";

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
  if (/1 ?millimetre|millimetre|1mm/.test(norm)) return "1millimetre";
  if (/dernier souvenir|souvenir/.test(norm)) return "le-dernier-souvenir";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const TYPE_KEYWORDS: { type: PreparedActionType; keywords: string[] }[] = [
  { type: "cursor_prompt", keywords: ["prompt cursor", "cursor prompt", "prompt pour cursor", "donne moi le prompt"] },
  { type: "checklist", keywords: ["checklist", "check list", "liste de verification", "fais moi une checklist"] },
  { type: "branch_plan", keywords: ["branche git", "branch plan", "plan de branche", "prepare la branche", "prépare la branche"] },
  { type: "file_draft", keywords: ["brouillon", "file draft", "draft fichier"] },
  { type: "content_plan", keywords: ["plan de contenu", "content plan", "contenu tiktok"] },
  { type: "research_plan", keywords: ["plan de recherche", "liste de donnees", "liste data", "research plan"] },
  { type: "collaborator_brief", keywords: ["brief", "collaborateur", "briefing"] },
  { type: "pr_plan", keywords: ["plan de pr", "pull request", "pr plan"] },
  { type: "manual_task", keywords: ["tache manuelle", "manual task"] },
];

const PREPARED_ACTION_TRIGGERS = [
  "prepare l action",
  "prépare l'action",
  "prepare l'action",
  "prepare le prompt",
  "prépare le prompt",
  "prepare ce que tu peux",
  "prépare ce que tu peux",
  "action preparee",
  "action préparée",
  "genere l action",
  "génère l'action",
  "generer l action",
];

function mapPreviewType(type: PlanPreviewType): PreparedActionType {
  if (type === "research_plan") return "research_plan";
  return type as PreparedActionType;
}

export function detectPreparedActionIntent(objective: string): PreparedActionIntent {
  const norm = normalize(objective);
  const projectId = detectProjectId(norm);

  let type: PreparedActionType | null = null;
  for (const entry of TYPE_KEYWORDS) {
    if (entry.keywords.some((k) => norm.includes(normalize(k)))) {
      type = entry.type;
      break;
    }
  }

  const hasTrigger = PREPARED_ACTION_TRIGGERS.some((k) => norm.includes(normalize(k)));
  const isPreparedAction = type !== null || hasTrigger;

  return {
    isPreparedAction,
    projectId,
    type,
    sourceActionId: null,
  };
}

export function buildPreparedAction(input: PreparedActionBuildInput): PreparedAction {
  const body = buildBodyForType(input);
  const typeLabel = PREPARED_ACTION_TYPE_LABELS[input.type];
  const relatedFiles = getRelatedFiles(input.projectId);
  const commands = getSuggestedCommands(input.type, input.projectId);

  return {
    id: `prep-${input.projectId}-${input.type}-${input.sourceActionId ?? "default"}`,
    projectId: input.projectId,
    actionPlanId: input.actionPlanId,
    sourceActionId: input.sourceActionId,
    type: input.type,
    title: `${typeLabel} — ${input.projectName}`,
    summary: input.planTitle
      ? `${typeLabel} pour « ${input.planTitle} » — prêt à copier-coller.`
      : `${typeLabel} pour ${input.projectName} — prêt à copier-coller.`,
    body,
    copyLabel: `Copier ${typeLabel.toLowerCase()}`,
    target: input.planTitle,
    relatedFiles,
    commands,
    safetyNotes: getSafetyNotes(input.type),
    validationRequired: PREPARED_VALIDATION_DEFAULTS,
    dryRunOnly: true,
    requiresConfirmation: true,
  };
}

export function buildPreparedActionFromPreview(
  plan: ActionPlan,
  preview: PreparedActionPreview,
  projectName: string
): PreparedAction {
  const inferred = inferTypeFromSourceId(preview.id);
  const type = inferred ?? mapPreviewType(preview.type);

  return buildPreparedAction({
    projectId: plan.projectId,
    projectName,
    type,
    actionPlanId: plan.id,
    sourceActionId: preview.id,
    planTitle: plan.title,
    planSummary: plan.summary,
    missionId: plan.missionId,
  });
}

export function buildPreparedActionForProject(
  projectId: string,
  projectName: string,
  type?: PreparedActionType | null,
  options?: { plan?: ActionPlan; sourceActionId?: string }
): PreparedAction {
  const resolvedType = type ?? defaultTypeForProject(projectId);

  if (options?.plan && options.sourceActionId) {
    const preview = options.plan.possibleFutureActions.find((a) => a.id === options.sourceActionId);
    if (preview) {
      return buildPreparedActionFromPreview(options.plan, preview, projectName);
    }
  }

  return buildPreparedAction({
    projectId,
    projectName,
    type: resolvedType,
    actionPlanId: options?.plan?.id,
    sourceActionId: options?.sourceActionId,
    planTitle: options?.plan?.title,
    planSummary: options?.plan?.summary,
    missionId: options?.plan?.missionId,
  });
}

export function getProjectPrepareHref(
  projectId: string,
  sourceActionId: string,
  planMissionId?: string
): string {
  const params = new URLSearchParams();
  if (planMissionId) params.set("plan", planMissionId);
  params.set("prepare", sourceActionId);
  const qs = params.toString();
  return `/projects/${projectId}${qs ? `?${qs}` : ""}`;
}

export { PREPARED_ACTION_DRY_RUN_MESSAGE };
