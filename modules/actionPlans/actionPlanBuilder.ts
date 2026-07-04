import { getProjectMissionSuggestions, getRecommendedMission } from "@/modules/projectMissions";
import type { ProjectMissionSuggestion } from "@/modules/projectMissions";
import { getMissionPlanTemplate } from "./actionPlanRules";
import {
  ACTION_PLAN_DRY_RUN_MESSAGE,
  VALIDATION_DEFAULTS,
  confidenceForPlan,
  effortFromScore,
} from "./actionPlanSummary";
import { formatActionPlanStepsText } from "./actionPlanFormatter";
import type {
  ActionPlan,
  ActionPlanBuildInput,
  ActionPlanIntent,
  PreparedActionPreview,
} from "./types";

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

const ACTION_PLAN_KEYWORDS = [
  "plan d action",
  "plan action",
  "plan d'action",
  "transforme",
  "transformer",
  "executer",
  "exécuter",
  "execution",
  "exécution",
  "aide moi a executer",
  "aide-moi a executer",
  "que dois-je faire",
  "que dois je faire",
  "comment on l execute",
  "comment l executer",
];

const ADVANCE_PREPARE_KEYWORDS = ["avance", "advance", "prepare", "preparer", "prépare", "plan"];

function matchesMissionFromText(norm: string, missions: ProjectMissionSuggestion[]): string | null {
  for (const m of missions) {
    const titleNorm = normalize(m.title);
    const words = titleNorm.split(/\s+/).filter((w) => w.length > 4);
    if (words.some((w) => norm.includes(w))) return m.id;
    if (norm.includes(normalize(m.id))) return m.id;
  }
  return null;
}

export function detectActionPlanIntent(objective: string): ActionPlanIntent {
  const norm = normalize(objective);
  const projectId = detectProjectId(norm);

  const hasPlanKeyword = ACTION_PLAN_KEYWORDS.some((k) => norm.includes(normalize(k)));
  const hasAdvancePrepare =
    ADVANCE_PREPARE_KEYWORDS.some((k) => norm.includes(k)) &&
    (projectId !== null || norm.includes("mission") || norm.includes("plan"));

  const isActionPlan = hasPlanKeyword || hasAdvancePrepare;

  let missionId: string | null = null;
  if (projectId) {
    const missions = getProjectMissionSuggestions(projectId);
    missionId = matchesMissionFromText(norm, missions);
  }

  return { isActionPlan, projectId, missionId };
}

function buildGenericPlan(input: ActionPlanBuildInput, mission: ProjectMissionSuggestion): ActionPlan {
  const tasks = mission.suggestedTasks ?? [
    "Clarifier l'objectif de la mission",
    "Identifier le livrable principal",
    "Réduire le scope à une session de travail",
  ];

  const steps = tasks.slice(0, 5).map((task, i) => ({
    id: `step-${i + 1}`,
    order: i + 1,
    title: task,
    description: `Étape ${i + 1} pour avancer sur ${mission.title}.`,
    estimatedTime: i === 0 ? "45 min" : "30 min",
    doneDefinition: `${task} — terminé quand tu peux passer à la suite.`,
  }));

  const futureActions: PreparedActionPreview[] = [
    {
      id: "fa-generic-checklist",
      label: "Préparer une checklist",
      type: "checklist",
      description: `Checklist pour ${mission.title}.`,
      requiresConfirmation: true,
      dryRunOnly: true,
    },
    {
      id: "fa-generic-cursor",
      label: "Générer un prompt Cursor",
      type: "cursor_prompt",
      description: "Prompt pour accélérer la première étape.",
      requiresConfirmation: true,
      dryRunOnly: true,
    },
  ];

  return {
    id: `plan-${input.projectId}-${mission.id}`,
    projectId: input.projectId,
    missionId: mission.id,
    title: mission.title,
    summary: mission.description,
    whyNow: mission.reason,
    expectedOutcome: `Mission « ${mission.title} » avancée avec un livrable concret.`,
    steps,
    deliverables: [
      {
        id: "del-1",
        title: "Livrable principal",
        description: `Résultat tangible pour ${input.projectName}.`,
      },
    ],
    risks: [
      {
        id: "risk-1",
        risk: "Scope trop large pour une session",
        mitigation: "Couper jusqu'à une seule étape faisable aujourd'hui.",
      },
    ],
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions,
    effort: effortFromScore(mission.effort),
    confidence: confidenceForPlan(false, mission.recommended),
  };
}

export function buildActionPlan(input: ActionPlanBuildInput): ActionPlan | null {
  const missions = getProjectMissionSuggestions(input.projectId);
  if (missions.length === 0) return null;

  let mission: ProjectMissionSuggestion | undefined;
  if (input.missionId) {
    mission = missions.find((m) => m.id === input.missionId);
  }
  if (!mission && input.missionTitle) {
    const norm = normalize(input.missionTitle);
    mission = missions.find((m) => normalize(m.title).includes(norm) || norm.includes(normalize(m.title)));
  }
  if (!mission) {
    mission = getRecommendedMission(missions);
  }
  if (!mission) return null;

  const template = getMissionPlanTemplate(mission.id);
  if (template) {
    return {
      ...template,
      id: `plan-${input.projectId}-${mission.id}`,
      projectId: input.projectId,
      missionId: mission.id,
      confidence: confidenceForPlan(true, mission.recommended),
    };
  }

  return buildGenericPlan(input, mission);
}

export function buildActionPlanForProject(
  projectId: string,
  projectName: string,
  missionId?: string
): ActionPlan | null {
  return buildActionPlan({ projectId, projectName, missionId });
}

export function getActionPlanStepsAsTasks(plan: ActionPlan): string[] {
  return formatActionPlanStepsText(plan.steps);
}

export { ACTION_PLAN_DRY_RUN_MESSAGE };
