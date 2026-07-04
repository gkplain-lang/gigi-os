import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import {
  DECISION_CONTRACT_RULES,
  DECISION_JSON_SCHEMA_HINT,
} from "./decisionQuality/decisionContract";
import type { AiBrainRequest } from "./types";

const SYSTEM_PROMPT = `Tu es Gigi, assistant de décision pour Gigi OS — pas une todo-list.
Tu choisis, tranches et réduis la dispersion. Une seule mission prioritaire.
Règles strictes :
- Propose UNE SEULE mission prioritaire du jour
- Format décision : mission + pourquoi + 3 tâches + quoi ignorer + risque principal + prochaine étape
- Ne repropose jamais une mission déjà terminée (voir completedMissionIds)
- Ne déclenche aucune action (email, publish, delete, payment, n8n, GitHub API, sync, restore)
- Ne dis jamais que tu as synchronisé, restauré ou modifié quoi que ce soit
- Suggère seulement — l'utilisateur décide
- Ne propose pas 5 projets en même temps
- Réponds en JSON strict uniquement, en français
- confidence entre 0 et 1
- Si requestedProjectId est présent : la mission principale DOIT être dans CE projet exactement
- Utilise memoryContext pour comprendre l'état — ne pas ignorer le contexte mémoire
- Si conflit local/Supabase : revue manuelle, jamais restore automatique`;

function buildLegacyPayload(request: AiBrainRequest) {
  const recentHistory = request.history.slice(0, 5).map((h) => ({
    title: h.title.slice(0, 120),
    type: h.type,
    date: h.date,
  }));

  const projects = request.projects.slice(0, 12).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    priority: p.priority,
    progress: p.progress,
  }));

  const memory = request.memoryStatus
    ? {
        mode: request.memoryStatus.mode,
        label: request.memoryStatus.label,
        lastBackupAt: request.memoryStatus.lastBackupAt,
      }
    : null;

  return {
    currentMission: {
      id: request.currentMission.id,
      title: request.currentMission.title,
      projectId: request.currentMission.projectId,
      status: request.currentMission.status,
    },
    projects,
    completedMissionIds: request.completedMissionIds,
    postponedMissionIds: request.postponedMissionIds,
    rejectedMissionIds: request.rejectedMissionIds,
    recentHistory,
    memory,
  };
}

export function buildAiPromptPayload(request: AiBrainRequest) {
  const projectLockRules = request.requestedProjectId
    ? [
        `PROJET VERROUILLÉ : ${request.requestedProjectName ?? request.requestedProjectId} (${request.requestedProjectId})`,
        "Tu DOIS recommander une mission dans CE projet uniquement.",
        "Tu n'as PAS le droit de remplacer par Buildy Clear ou un autre projet en mission principale.",
        `recommendedMission.projectId DOIT être exactement "${request.requestedProjectId}".`,
        "Tu peux mentionner Buildy Clear seulement en note secondaire (alternative ou notNow) si pertinent.",
        "L'alternative peut être un autre projet, mais la mission principale reste dans le projet demandé.",
      ]
    : [];

  const memoryContextRules = request.memoryContext
    ? [
        "Utilise memoryContext pour comprendre l'état actuel.",
        "Respecte completedMissionIds, postponedMissionIds et rejectedMissionIds.",
        "Une seule mission prioritaire.",
        ...(request.memoryContext.warnings ?? []),
      ]
    : [];

  const legacy = buildLegacyPayload(request);

  return {
    promise: "Une action. Aucun bruit.",
    userMessage: request.userMessage.slice(0, 800),
    requestedProjectId: request.requestedProjectId ?? null,
    requestedProjectName: request.requestedProjectName ?? null,
    intentLock: request.intentLock ?? null,
    projectLockRules,
    memoryContext: request.memoryContext ?? null,
    memoryContextRules,
    ...(!request.memoryContext ? legacy : {}),
    projectNames: PROJECT_NAMES,
    rules: [
      "Une mission prioritaire seulement",
      "Pas une todo-list — choisir et trancher",
      "Pas d'action automatique",
      "Pas de sync ni restore",
      "Respecter missions terminées",
      "Exactement 3 tâches concrètes",
      "Inclure notNow, primaryRisk, nextStep",
      ...DECISION_CONTRACT_RULES.slice(0, 4),
    ],
    decisionContract: DECISION_CONTRACT_RULES,
  };
}

export function buildOpenAiMessages(request: AiBrainRequest) {
  const payload = buildAiPromptPayload(request);

  const userContent = `Contexte Gigi OS (JSON) :
${JSON.stringify(payload)}

Réponds avec ce JSON strict :
${DECISION_JSON_SCHEMA_HINT}`;

  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: userContent },
  ];
}

export { SYSTEM_PROMPT };
