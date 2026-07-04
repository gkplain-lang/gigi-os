export const REQUIRED_TASK_COUNT = 3;

export const DECISION_CONTRACT_RULES = [
  "Gigi n'est pas une todo-list — il choisit, tranche et réduit la dispersion.",
  "Une seule mission prioritaire du jour.",
  "Un projet clair si possible.",
  "Justification courte (pourquoi cette mission).",
  "Exactement 3 tâches concrètes et actionnables.",
  "Liste ce qu'il faut ignorer aujourd'hui (notNow).",
  "Un risque principal si la mission n'est pas faite (primaryRisk).",
  "Une prochaine étape après exécution (nextStep).",
  "Ne propose pas 5 projets en même temps.",
  "Respecte memoryContext et le projet explicitement demandé.",
  "Ne dis jamais qu'une action a déjà été exécutée (sync, restore, publish, etc.).",
];

export const DECISION_JSON_SCHEMA_HINT = `{
  "intent": "...",
  "message": "message court",
  "recommendedMission": {
    "title": "...",
    "projectId": "...",
    "reason": "...",
    "tasks": ["tâche 1", "tâche 2", "tâche 3"]
  },
  "notNow": ["Projet — raison courte"],
  "primaryRisk": "risque principal si mission non faite",
  "nextStep": "prochaine étape après exécution",
  "alternative": { "title": "...", "reason": "...", "projectId": "..." },
  "confidence": 0.0,
  "safety": { "level": "safe", "requiresConfirmation": false, "blockedActions": [] }
}`;
