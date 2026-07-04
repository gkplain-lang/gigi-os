import {
  MISSION_CATALOG,
  PROJECT_NAMES,
  type CatalogMission,
} from "@/modules/conversation/missionCatalog";
import type { NotNowItem } from "@/modules/conversation/conversationTypes";
import type { Mission } from "@/modules/missions/missionTypes";
import type { AiBrainRequest, AiBrainResponse } from "../types";
import { REQUIRED_TASK_COUNT } from "./decisionContract";

const NOT_NOW_ORDER = [
  "buildy-clear",
  "buildy-crafts",
  "linko",
  "1millimetre",
  "le-dernier-souvenir",
  "gigi-os",
];

const NOT_NOW_BASE: Record<string, string> = {
  "buildy-clear": "important pour le revenu, mais pas maintenant",
  "buildy-crafts": "stratégique long terme — pas la priorité du jour",
  linko: "en pause",
  "1millimetre": "expérimental",
  "le-dernier-souvenir": "idée future",
  "gigi-os": "infrastructure",
};

const DEFAULT_RISKS: Record<string, string> = {
  "buildy-clear": "Rester sans page de vente claire retarde tout revenu.",
  "buildy-crafts": "Ouvrir trop de fronts dilue l'avancement concret du jour.",
  linko: "Relancer Linko sans cadre peut disperser ton énergie.",
  "1millimetre": "Perdre le fil sur un projet expérimental sans livrable.",
  "le-dernier-souvenir": "S'éparpiller sur le créatif avant les bases business.",
  "gigi-os": "Passer trop de temps sur l'outil au lieu de vendre.",
};

function catalogForMission(mission: Mission): CatalogMission | undefined {
  return MISSION_CATALOG.find((m) => m.id === mission.id);
}

function defaultTasks(mission: Mission, catalog?: CatalogMission): string[] {
  if (catalog?.subtasks && catalog.subtasks.length >= REQUIRED_TASK_COUNT) {
    return catalog.subtasks.slice(0, REQUIRED_TASK_COUNT);
  }
  return [
    `${mission.title.replace(/\.$/, "")} — poser la première petite étape`,
    "Avancer 45 minutes, sans rien ouvrir d'autre",
    "Noter où tu t'arrêtes pour reprendre facilement",
  ];
}

export function normalizeTasks(mission: Mission, tasks?: string[] | null): [string, string, string] {
  const catalog = catalogForMission(mission);
  const base = (tasks ?? []).map((t) => t.trim()).filter(Boolean);
  const pool = base.length >= REQUIRED_TASK_COUNT ? base : [...base, ...defaultTasks(mission, catalog)];

  const normalized = pool.slice(0, REQUIRED_TASK_COUNT);
  while (normalized.length < REQUIRED_TASK_COUNT) {
    normalized.push("Clôturer cette étape et noter la suite logique.");
  }

  return [normalized[0], normalized[1], normalized[2]];
}

export function buildIgnoreToday(
  selectedProjectId: string,
  existing?: NotNowItem[] | null
): NotNowItem[] {
  if (existing && existing.length > 0) {
    return existing.slice(0, 6);
  }

  return NOT_NOW_ORDER.filter((id) => id !== selectedProjectId).map((id) => ({
    projectName: PROJECT_NAMES[id] ?? id,
    reason: NOT_NOW_BASE[id] ?? "pas maintenant",
  }));
}

export function buildPrimaryRisk(
  mission: Mission,
  existing?: string | null,
  warning?: string | null
): string {
  const trimmed = existing?.trim() || warning?.trim();
  if (trimmed) return trimmed.slice(0, 240);
  return (
    DEFAULT_RISKS[mission.projectId] ??
    "Ne pas avancer aujourd'hui repousse la clarté et la traction."
  );
}

export function buildNextStep(mission: Mission, catalog?: CatalogMission): string {
  const projectName = PROJECT_NAMES[mission.projectId] ?? mission.projectName;
  const sibling = MISSION_CATALOG.filter(
    (m) => m.projectId === mission.projectId && m.id !== mission.id
  ).sort((a, b) => b.score - a.score)[0];

  if (sibling) {
    return `Après cette mission : « ${sibling.title.replace(/\.$/, "")} » dans ${projectName}.`;
  }

  if (catalog?.subtasks && catalog.subtasks.length > 0) {
    return `Après exécution : enchaîner sur la suite logique de ${projectName} ou valider la mission comme terminée.`;
  }

  return `Après exécution : marquer la mission terminée et choisir la prochaine action dans ${projectName}.`;
}

export function formatDecisionFields(
  mission: Mission,
  options: {
    reason?: string | null;
    tasks?: string[] | null;
    notNow?: NotNowItem[] | null;
    primaryRisk?: string | null;
    nextStep?: string | null;
    warning?: string | null;
  } = {}
): {
  reason: string;
  tasks: [string, string, string];
  notNow: NotNowItem[];
  primaryRisk: string;
  nextStep: string;
} {
  const catalog = catalogForMission(mission);
  return {
    reason: (options.reason ?? mission.reason ?? "C'est le mouvement le plus clair aujourd'hui.").slice(
      0,
      320
    ),
    tasks: normalizeTasks(mission, options.tasks),
    notNow: buildIgnoreToday(mission.projectId, options.notNow),
    primaryRisk: buildPrimaryRisk(mission, options.primaryRisk, options.warning),
    nextStep: (options.nextStep?.trim() || buildNextStep(mission, catalog)).slice(0, 240),
  };
}

export function enrichAiBrainDecision(
  response: AiBrainResponse,
  _request: AiBrainRequest
): AiBrainResponse {
  const mission = response.recommendedMission;
  if (!mission) return response;

  const formatted = formatDecisionFields(mission, {
    reason: response.reason,
    tasks: response.tasks,
    notNow: response.notNow,
    primaryRisk: response.primaryRisk,
    nextStep: response.nextStep,
  });

  return {
    ...response,
    reason: formatted.reason,
    tasks: [...formatted.tasks],
    notNow: formatted.notNow,
    primaryRisk: formatted.primaryRisk,
    nextStep: formatted.nextStep,
  };
}
