import type {
  AiActionType,
  AiBrainResponse,
  AiProviderJsonResponse,
  AiSafetyLevel,
  AiSafetyResult,
} from "./types";

const BLOCKED_PHRASES = [
  "envoyer un email",
  "send email",
  "publier",
  "publish",
  "supprimer",
  "delete",
  "effacer",
  "n8n",
  "github api",
  "stripe",
  "paiement",
  "payment",
  "facturer",
  "webhook",
  "automatiser",
  "execute",
  "exécuter",
  "lancer l'agent",
  "launch agent",
];

const CONFIRMATION_PHRASES = [
  "commit",
  "push",
  "deploy",
  "déployer",
  "modifier le statut",
  "change status",
  "archiver",
  "archive",
];

export function createBlockedSafety(warnings: string[]): AiSafetyResult {
  return {
    level: "blocked",
    requiresConfirmation: true,
    blockedActions: ["external_action"],
    warnings,
  };
}

export function evaluateTextSafety(text: string): AiSafetyResult {
  const norm = text.toLowerCase();
  const warnings: string[] = [];

  for (const phrase of BLOCKED_PHRASES) {
    if (norm.includes(phrase)) {
      warnings.push(`Contenu sensible détecté : « ${phrase} »`);
    }
  }

  if (warnings.length > 0) {
    return createBlockedSafety(warnings);
  }

  for (const phrase of CONFIRMATION_PHRASES) {
    if (norm.includes(phrase)) {
      warnings.push(`Action potentiellement sensible : « ${phrase} »`);
    }
  }

  if (warnings.length > 0) {
    return {
      level: "needs_confirmation",
      requiresConfirmation: true,
      blockedActions: [],
      warnings,
    };
  }

  return {
    level: "safe",
    requiresConfirmation: false,
    blockedActions: [],
    warnings: [],
  };
}

export function mergeSafety(
  parsed: AiProviderJsonResponse["safety"],
  message: string
): AiSafetyResult {
  const textSafety = evaluateTextSafety(message);

  const level: AiSafetyLevel =
    parsed?.level === "blocked" || textSafety.level === "blocked"
      ? "blocked"
      : parsed?.level === "needs_confirmation" || textSafety.level === "needs_confirmation"
        ? "needs_confirmation"
        : "safe";

  const blockedActions = new Set<AiActionType>([
    ...(parsed?.blockedActions ?? []),
    ...textSafety.blockedActions,
  ]);

  if (level === "blocked") {
    blockedActions.add("external_action");
  }

  return {
    level,
    requiresConfirmation: Boolean(parsed?.requiresConfirmation) || textSafety.requiresConfirmation,
    blockedActions: [...blockedActions],
    warnings: [...textSafety.warnings],
  };
}

export function assertResponseSafe(response: AiBrainResponse): AiBrainResponse {
  if (response.safety.level === "blocked") {
    return {
      ...response,
      message:
        "Je peux suggérer une mission, mais pas exécuter d'action externe. Voici une orientation sûre.",
    };
  }
  return response;
}

export const AI_SAFETY_RULES_SUMMARY = [
  "L'IA ne peut pas exécuter d'action",
  "Suggestions uniquement en V0.5",
  "Actions externes bloquées",
  "Une seule mission prioritaire",
  "Pas de suppression, paiement, publication ou email",
];
