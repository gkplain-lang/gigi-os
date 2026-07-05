import type { ExecutionCapability } from "./types";
import type { SandboxConnectorDefinition, SandboxConnectorId } from "./manualBridgeTypes";

const CONNECTOR_DISCLAIMER =
  "Connecteur non actif en V4.2 — préparation et pont manuel uniquement. Aucune exécution réelle.";

export const SANDBOX_CONNECTOR_REGISTRY: SandboxConnectorDefinition[] = [
  {
    id: "shell",
    label: "Shell (sandbox)",
    description: "Commandes shell préparables en texte — jamais lancées par Gigi.",
    status: "manual_bridge_only",
    capability: "shell_command",
    riskLevel: "critical",
    requiredPermissionScope: "Validation humaine + dry-run local",
    preparableTaskExamples: ["Lister des commandes à copier", "Préparer un script de vérification"],
    limitations: ["Aucun exec/spawn", "Aucune commande lancée depuis Gigi"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "file_write",
    label: "Écriture fichier (sandbox)",
    description: "Plans de modification fichier — copie manuelle uniquement.",
    status: "manual_bridge_only",
    capability: "file_write",
    riskLevel: "high",
    requiredPermissionScope: "Scope fichier explicite + rollback",
    preparableTaskExamples: ["Checklist de fichiers à éditer", "Diff textuel à appliquer"],
    limitations: ["Aucune écriture depuis Gigi", "Rollback documenté obligatoire"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "git",
    label: "Git (sandbox)",
    description: "Étapes Git en texte — l'utilisateur exécute hors Gigi.",
    status: "manual_bridge_only",
    capability: "git_operation",
    riskLevel: "high",
    requiredPermissionScope: "Branche cible + validation humaine",
    preparableTaskExamples: ["git status / diff / commit (texte)", "Plan de branche"],
    limitations: ["Aucun git réel depuis Gigi"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "github",
    label: "GitHub (sandbox)",
    description: "Préparation PR/issues — aucun appel API GitHub.",
    status: "manual_bridge_only",
    capability: "github_operation",
    riskLevel: "critical",
    requiredPermissionScope: "Repo + permission dry-run V4.1",
    preparableTaskExamples: ["Corps de PR à coller", "Checklist review humaine"],
    limitations: ["Aucun Octokit", "Token jamais stocké dans Gigi"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "n8n",
    label: "n8n (sandbox)",
    description: "Workflows décrits en étapes — aucun déclenchement n8n.",
    status: "manual_bridge_only",
    capability: "n8n_workflow",
    riskLevel: "critical",
    requiredPermissionScope: "Workflow ID + validation humaine",
    preparableTaskExamples: ["Étapes workflow à reproduire", "Payload JSON à copier"],
    limitations: ["Aucun webhook n8n", "Clé API jamais stockée"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "browser",
    label: "Navigateur (sandbox)",
    description: "Actions navigateur décrites — pas d'automation.",
    status: "manual_bridge_only",
    capability: "browser_action",
    riskLevel: "high",
    requiredPermissionScope: "URLs listées + contrôle humain",
    preparableTaskExamples: ["Checklist clics manuels", "URLs à ouvrir"],
    limitations: ["Aucun Puppeteer/Playwright"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "email",
    label: "Email (sandbox)",
    description: "Brouillons email locaux — aucun envoi.",
    status: "manual_bridge_only",
    capability: "email_draft",
    riskLevel: "medium",
    requiredPermissionScope: "Destinataire validé par l'humain",
    preparableTaskExamples: ["Corps d'email à copier", "Objet + checklist envoi"],
    limitations: ["Aucun SMTP/API email"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "calendar",
    label: "Calendrier (sandbox)",
    description: "Brouillons événement — aucune création calendar réelle.",
    status: "manual_bridge_only",
    capability: "calendar_draft",
    riskLevel: "medium",
    requiredPermissionScope: "Créneau validé par l'humain",
    preparableTaskExamples: ["Texte d'invitation", "Agenda à créer manuellement"],
    limitations: ["Aucune API calendar"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
  {
    id: "external_api",
    label: "API externe (sandbox)",
    description: "Requêtes décrites en texte — aucun fetch depuis Gigi.",
    status: "manual_bridge_only",
    capability: "external_api",
    riskLevel: "critical",
    requiredPermissionScope: "Endpoint + validation humaine",
    preparableTaskExamples: ["curl exemple (texte)", "Payload JSON à tester manuellement"],
    limitations: ["Aucun fetch/axios", "Credentials jamais stockés"],
    disclaimer: CONNECTOR_DISCLAIMER,
  },
];

const CAPABILITY_TO_CONNECTOR: Record<ExecutionCapability, SandboxConnectorId> = {
  shell_command: "shell",
  file_write: "file_write",
  git_operation: "git",
  github_operation: "github",
  n8n_workflow: "n8n",
  browser_action: "browser",
  email_draft: "email",
  calendar_draft: "calendar",
  external_api: "external_api",
  file_read: "file_write",
  local_only: "external_api",
  documentation_only: "external_api",
};

export function getSandboxConnectorRegistry(): SandboxConnectorDefinition[] {
  return [...SANDBOX_CONNECTOR_REGISTRY];
}

export function getSandboxConnectorById(
  id: SandboxConnectorId
): SandboxConnectorDefinition | undefined {
  return SANDBOX_CONNECTOR_REGISTRY.find((c) => c.id === id);
}

export function getBlockedConnectorIds(): SandboxConnectorId[] {
  return SANDBOX_CONNECTOR_REGISTRY.filter(
    (c) => c.status === "blocked" || c.status === "manual_bridge_only"
  ).map((c) => c.id);
}

export function connectorIdForCapability(
  capability: ExecutionCapability
): SandboxConnectorId {
  return CAPABILITY_TO_CONNECTOR[capability] ?? "external_api";
}

export function primaryConnectorForCapabilities(
  capabilities: ExecutionCapability[]
): SandboxConnectorId {
  const priority: ExecutionCapability[] = [
    "shell_command",
    "github_operation",
    "n8n_workflow",
    "external_api",
    "git_operation",
    "file_write",
    "browser_action",
    "email_draft",
    "calendar_draft",
    "file_read",
    "local_only",
    "documentation_only",
  ];
  for (const cap of priority) {
    if (capabilities.includes(cap)) return connectorIdForCapability(cap);
  }
  return "external_api";
}
