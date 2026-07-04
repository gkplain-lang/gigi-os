import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import type { AiBrainRequest } from "./types";

const SYSTEM_PROMPT = `Tu es Gigi, assistant de décision pour Gigi OS.
Règles strictes :
- Propose UNE SEULE mission prioritaire
- Ne repropose jamais une mission déjà terminée
- Ne déclenche aucune action (email, publish, delete, payment, n8n, GitHub API)
- Suggère seulement — l'utilisateur décide
- Tu peux dire "pas maintenant" pour les autres projets
- Réponds en JSON strict uniquement, en français
- confidence entre 0 et 1
- Si requestedProjectId est présent dans le contexte : la mission principale DOIT être dans CE projet exactement. Tu n'as pas le droit de substituer Buildy Clear ou un autre projet. L'alternative peut être ailleurs.`;

export function buildAiPromptPayload(request: AiBrainRequest) {
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

  return {
    promise: "Une action. Aucun bruit.",
    userMessage: request.userMessage.slice(0, 800),
    requestedProjectId: request.requestedProjectId ?? null,
    requestedProjectName: request.requestedProjectName ?? null,
    intentLock: request.intentLock ?? null,
    projectLockRules,
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
    projectNames: PROJECT_NAMES,
    rules: [
      "Une mission prioritaire seulement",
      "Pas d'action automatique",
      "Respecter missions terminées",
      "Peut proposer alternative",
      "Peut lister notNow",
    ],
  };
}

export function buildOpenAiMessages(request: AiBrainRequest) {
  const payload = buildAiPromptPayload(request);

  const userContent = `Contexte Gigi OS (JSON) :
${JSON.stringify(payload)}

Réponds avec ce JSON strict :
{
  "intent": "focus|revenue|project_specific|alternative|general|unclear",
  "message": "message court à l'utilisateur",
  "recommendedMission": {
    "title": "...",
    "projectId": "...",
    "reason": "...",
    "tasks": ["...", "...", "..."]
  },
  "alternative": { "title": "...", "reason": "...", "projectId": "..." },
  "notNow": ["projet — raison courte"],
  "confidence": 0.0,
  "safety": {
    "level": "safe",
    "requiresConfirmation": false,
    "blockedActions": []
  }
}`;

  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: userContent },
  ];
}

export { SYSTEM_PROMPT };
