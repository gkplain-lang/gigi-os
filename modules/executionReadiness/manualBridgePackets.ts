import type { ExecutionReadinessRequest } from "./types";
import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
  upsertExecutionReadinessRequest,
} from "./executionReadinessStore";
import type {
  ManualBridgeAuditEntry,
  ManualExecutionPacket,
  ManualExecutionPacketStatus,
  SandboxConnectorId,
} from "./manualBridgeTypes";
import { MANUAL_BRIDGE_PACKET_TTL_DAYS, EXECUTION_READINESS_V42_DISCLAIMER } from "./manualBridgeTypes";
import {
  getSandboxConnectorById,
  primaryConnectorForCapabilities,
} from "./manualBridgeRegistry";
import { getManualBridgeDisclaimer } from "./manualBridgePolicy";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function packetAudit(
  type: ManualBridgeAuditEntry["type"],
  message: string,
  status?: ManualExecutionPacketStatus
): ManualBridgeAuditEntry {
  return { id: newId("mb-audit"), at: nowIso(), type, message, status };
}

function computePacketExpiresAt(fromIso: string): string {
  const date = new Date(fromIso);
  date.setDate(date.getDate() + MANUAL_BRIDGE_PACKET_TTL_DAYS);
  return date.toISOString();
}

function secretNamesForConnector(connectorId: SandboxConnectorId): string[] {
  const map: Partial<Record<SandboxConnectorId, string[]>> = {
    github: ["GITHUB_TOKEN (nom seulement — jamais stocké dans Gigi)"],
    n8n: ["N8N_API_KEY (nom seulement — jamais stocké dans Gigi)"],
    external_api: ["API_KEY (nom seulement — jamais stocké dans Gigi)"],
    email: ["SMTP ou OAuth credentials (noms seulement — jamais stockés)"],
    calendar: ["Calendar OAuth (nom seulement — jamais stocké)"],
  };
  return map[connectorId] ?? [];
}

function copyableForConnector(connectorId: SandboxConnectorId, title: string): string[] {
  const templates: Record<SandboxConnectorId, string[]> = {
    shell: [
      "# Exemple — copier et exécuter manuellement hors Gigi\n# cd /chemin/projet\n# votre-commande-ici",
    ],
    file_write: [
      `# Fichiers à éditer manuellement pour : ${title}\n# 1. Ouvrir l'éditeur\n# 2. Appliquer les changements\n# 3. Sauvegarder`,
    ],
    git: [
      "# Copier hors Gigi — aucune exécution depuis Aegis\ngit status\ngit diff\ngit add -p\ngit commit -m \"...\"",
    ],
    github: [
      "# PR manuelle — aucun appel API GitHub depuis Gigi\n# gh pr create --title \"...\" --body \"...\"\n# ou via l'interface GitHub",
    ],
    n8n: [
      "# Workflow n8n — déclencher manuellement dans n8n\n# Ne pas appeler depuis Gigi",
    ],
    browser: [
      "# Ouvrir manuellement dans le navigateur\n# URL : (à compléter)\n# Vérifier visuellement avant de continuer",
    ],
    email: [
      "Objet : (à compléter)\n\nCorps :\n(Brouillon à copier dans ton client email)",
    ],
    calendar: [
      "Titre événement : (à compléter)\nDate/heure : (à compléter)\nCréer manuellement dans ton calendrier",
    ],
    external_api: [
      "# curl exemple — tester manuellement, jamais depuis Gigi\n# curl -X GET 'https://api.example.com/...' -H 'Authorization: Bearer <TON_TOKEN>'",
    ],
  };
  return templates[connectorId] ?? templates.external_api;
}

function buildManualSteps(
  request: Pick<ExecutionReadinessRequest, "requiredChecks"> | undefined,
  connectorId: SandboxConnectorId
): string[] {
  const connector = getSandboxConnectorById(connectorId);
  const checks = request?.requiredChecks?.length
    ? request.requiredChecks.slice(0, 4)
    : ["Validation humaine requise"];
  return [
    "Lire le paquet complet et la checklist pré-vol.",
    "Valider que les permissions locales (V4.1) couvrent la simulation prévue.",
    ...checks,
    `Connecteur ${connector?.label ?? connectorId} : sandbox — exécution manuelle hors Gigi.`,
    "Appliquer les instructions copiables une par une.",
    "Documenter le résultat et marquer « fait par l'humain » si terminé.",
  ];
}

export function listManualExecutionPackets(limit?: number): ManualExecutionPacket[] {
  const packets = loadExecutionReadinessState().manualBridgePackets ?? [];
  const sorted = [...packets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getManualExecutionPacketById(id: string): ManualExecutionPacket | undefined {
  return listManualExecutionPackets().find((p) => p.id === id);
}

export function getEffectivePacketStatus(
  packet: ManualExecutionPacket
): ManualExecutionPacketStatus {
  if (packet.status === "cancelled" || packet.status === "marked_done_by_human") {
    return packet.status;
  }
  if (packet.expiresAt && new Date(packet.expiresAt).getTime() <= Date.now()) {
    return "expired";
  }
  return packet.status;
}

export function syncExpiredManualBridgePackets(): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  const state = loadExecutionReadinessState();
  const packets = state.manualBridgePackets ?? [];
  const updated = packets.map((packet) => {
    if (["cancelled", "marked_done_by_human", "expired"].includes(packet.status)) {
      return packet;
    }
    if (!packet.expiresAt || new Date(packet.expiresAt).getTime() > Date.now()) {
      return packet;
    }
    count += 1;
    return {
      ...packet,
      status: "expired" as const,
      updatedAt: nowIso(),
      auditTrail: [
        packetAudit("expired", "Paquet expiré localement (TTL 7 jours) — aucune exécution."),
        ...packet.auditTrail,
      ],
    };
  });
  if (count > 0) {
    saveExecutionReadinessState({
      ...state,
      manualBridgePackets: updated,
      lastUpdatedAt: nowIso(),
    });
  }
  return count;
}

function savePacket(packet: ManualExecutionPacket): ManualExecutionPacket {
  const state = loadExecutionReadinessState();
  const existing = state.manualBridgePackets ?? [];
  saveExecutionReadinessState({
    ...state,
    manualBridgePackets: [packet, ...existing.filter((p) => p.id !== packet.id)],
    lastUpdatedAt: packet.updatedAt,
  });
  return packet;
}

export interface CreateManualPacketInput {
  title?: string;
  sourceRequestId?: string;
  connectorId?: SandboxConnectorId;
}

export function createManualExecutionPacket(
  input: CreateManualPacketInput = {}
): ManualExecutionPacket | undefined {
  const timestamp = nowIso();
  let request: ExecutionReadinessRequest | undefined;
  if (input.sourceRequestId) {
    request = loadExecutionReadinessState().requests.find((r) => r.id === input.sourceRequestId);
  }

  const connectorId =
    input.connectorId ??
    (request
      ? primaryConnectorForCapabilities(request.requestedCapabilities)
      : "external_api");
  const connector = getSandboxConnectorById(connectorId);
  if (!connector) return undefined;

  const capability = connector.capability;
  const title =
    input.title ??
    (request
      ? `Paquet manuel · ${request.title.replace(/^Readiness · /, "")}`
      : `Paquet manuel · ${connector.label}`);

  const packet: ManualExecutionPacket = {
    id: newId("mb-packet"),
    title,
    connectorId,
    capability,
    status: "ready_for_human_review",
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: computePacketExpiresAt(timestamp),
    sourceRequestId: input.sourceRequestId,
    riskLevel: request?.riskLevel ?? connector.riskLevel,
    humanGoal:
      request?.summary ??
      `Préparer une exécution manuelle via ${connector.label} — validation humaine requise.`,
    preflightChecklist: request?.requiredChecks.length
      ? [...request.requiredChecks]
      : [
          "Comprendre le périmètre et les risques",
          "Vérifier qu'aucun secret n'est stocké dans Gigi",
          "Confirmer le plan de rollback",
        ],
    manualSteps: buildManualSteps(request, connectorId),
    copyableCommands: copyableForConnector(connectorId, title),
    copyableInstructions: [
      connector.description,
      ...connector.limitations.map((l) => `Limitation : ${l}`),
    ],
    requiredSecretsNames: secretNamesForConnector(connectorId),
    rollbackPlan: request?.rollbackPlan.length
      ? [...request.rollbackPlan]
      : ["Annuler les changements manuels", "Restaurer depuis backup si nécessaire"],
    expectedOutcome:
      request?.expectedChanges.join(" · ") ||
      "Résultat attendu documenté par l'humain après exécution manuelle.",
    auditTrail: [
      packetAudit(
        "manual_packet_created",
        input.sourceRequestId
          ? `Paquet créé depuis la permission locale ${input.sourceRequestId}`
          : "Paquet manuel créé localement — sandbox V4.2",
        "ready_for_human_review"
      ),
    ],
    disclaimer: getManualBridgeDisclaimer(),
  };

  savePacket(packet);

  if (request) {
    upsertExecutionReadinessRequest({
      ...request,
      updatedAt: timestamp,
      auditTrail: [
        {
          id: newId("audit"),
          at: timestamp,
          type: "note",
          message: `Paquet manuel V4.2 créé : ${packet.id} — pont manuel, aucune exécution.`,
        },
        ...request.auditTrail,
      ],
    });
  }

  return packet;
}

export function updateManualExecutionPacketStatus(
  packetId: string,
  status: ManualExecutionPacketStatus,
  reason?: string
): ManualExecutionPacket | undefined {
  const packet = getManualExecutionPacketById(packetId);
  if (!packet) return undefined;

  const timestamp = nowIso();
  const auditType: ManualBridgeAuditEntry["type"] =
    status === "copied_by_human"
      ? "copied_by_human"
      : status === "marked_done_by_human"
        ? "marked_done_by_human"
        : status === "cancelled"
          ? "cancelled"
          : "status_change";

  const updated: ManualExecutionPacket = {
    ...packet,
    status,
    updatedAt: timestamp,
    auditTrail: [
      packetAudit(
        auditType,
        reason ??
          (status === "marked_done_by_human"
            ? "Marqué fait par l'humain — Gigi ne vérifie pas l'exécution réelle."
            : `Statut → ${status}`),
        status
      ),
      ...packet.auditTrail,
    ],
  };

  return savePacket(updated);
}

export function createManualPacketFromRequest(
  requestId: string
): ManualExecutionPacket | undefined {
  return createManualExecutionPacket({ sourceRequestId: requestId });
}

export { EXECUTION_READINESS_V42_DISCLAIMER };
