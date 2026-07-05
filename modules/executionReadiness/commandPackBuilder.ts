import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
} from "./executionReadinessStore";
import { getManualExecutionPacketById } from "./manualBridgePackets";
import type {
  CommandPack,
  CommandPackAuditEntry,
  CommandPackCommand,
  CommandPackCategory,
  CommandPackStatus,
} from "./commandPackTypes";
import { COMMAND_PACK_TTL_DAYS } from "./commandPackTypes";
import { getCommandPackDisclaimer } from "./commandPackPolicy";
import { getCommandPackTemplate } from "./commandPackTemplates";
import type { CommandPackTemplateDefinition } from "./commandPackTypes";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(
  type: CommandPackAuditEntry["type"],
  message: string,
  status?: CommandPackStatus
): CommandPackAuditEntry {
  return { id: newId("cp-audit"), at: nowIso(), type, message, status };
}

function withIds(commands: Omit<CommandPackCommand, "id">[]): CommandPackCommand[] {
  return commands.map((c) => ({ ...c, id: newId("cp-cmd") }));
}

function computeExpiresAt(fromIso: string): string {
  const d = new Date(fromIso);
  d.setDate(d.getDate() + COMMAND_PACK_TTL_DAYS);
  return d.toISOString();
}

function savePack(pack: CommandPack): CommandPack {
  const state = loadExecutionReadinessState();
  const existing = state.commandPacks ?? [];
  saveExecutionReadinessState({
    ...state,
    commandPacks: [pack, ...existing.filter((p) => p.id !== pack.id)],
    lastUpdatedAt: pack.updatedAt,
  });
  return pack;
}

export function listCommandPacks(limit?: number): CommandPack[] {
  const packs = loadExecutionReadinessState().commandPacks ?? [];
  const sorted = [...packs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getCommandPackById(id: string): CommandPack | undefined {
  return listCommandPacks().find((p) => p.id === id);
}

export function getEffectiveCommandPackStatus(pack: CommandPack): CommandPackStatus {
  if (pack.status === "cancelled") return "cancelled";
  if (pack.expiresAt && new Date(pack.expiresAt).getTime() <= Date.now()) {
    if (!["marked_success_by_human", "marked_failed_by_human"].includes(pack.status)) {
      return "expired";
    }
  }
  return pack.status;
}

export function syncExpiredCommandPacks(): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  const state = loadExecutionReadinessState();
  const packs = state.commandPacks ?? [];
  const updated = packs.map((pack) => {
    if (["cancelled", "expired", "marked_success_by_human", "marked_failed_by_human"].includes(pack.status)) {
      return pack;
    }
    if (!pack.expiresAt || new Date(pack.expiresAt).getTime() > Date.now()) return pack;
    count += 1;
    return {
      ...pack,
      status: "expired" as const,
      updatedAt: nowIso(),
      auditTrail: [audit("expired", "Pack expiré localement (TTL 7 jours)."), ...pack.auditTrail],
    };
  });
  if (count > 0) {
    saveExecutionReadinessState({ ...state, commandPacks: updated, lastUpdatedAt: nowIso() });
  }
  return count;
}

function buildFromTemplate(template: CommandPackTemplateDefinition): CommandPack {
  const timestamp = nowIso();
  return {
    id: newId("cmd-pack"),
    title: template.title,
    description: template.description,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: computeExpiresAt(timestamp),
    connectorId: template.connectorId,
    category: template.id,
    status: "ready_for_review",
    riskLevel: template.riskLevel,
    humanGoal: template.humanGoal,
    environmentAssumptions: [...template.environmentAssumptions],
    prerequisites: [...template.prerequisites],
    commands: withIds(template.commands),
    preflightChecklist: [...template.preflightChecklist],
    postRunChecklist: [...template.postRunChecklist],
    rollbackCommands: withIds(template.rollbackCommands),
    expectedOutcome: template.expectedOutcome,
    knownRisks: [...template.knownRisks],
    requiredSecretsNames: [...template.requiredSecretsNames],
    auditTrail: [
      audit("command_pack_created", `Pack créé depuis le modèle ${template.id}`, "ready_for_review"),
    ],
    disclaimer: getCommandPackDisclaimer(),
  };
}

export function createCommandPackFromTemplate(
  templateId: CommandPackCategory
): CommandPack | undefined {
  const template = getCommandPackTemplate(templateId);
  if (!template) return undefined;
  return savePack(buildFromTemplate(template));
}

function commandsFromManualPacket(
  copyableCommands: string[],
  copyableInstructions: string[]
): CommandPackCommand[] {
  const texts = [...copyableCommands, ...copyableInstructions];
  if (texts.length === 0) {
    return [
      {
        id: newId("cp-cmd"),
        label: "Instruction manuelle",
        commandText: "# Aucune commande générée — compléter manuellement",
        explanation: "Relire le paquet pont manuel source.",
        riskLevel: "medium",
        requiresHumanEdit: true,
        placeholders: [],
      },
    ];
  }
  return texts.map((text, i) => ({
    id: newId("cp-cmd"),
    label: `Commande / instruction ${i + 1}`,
    commandText: text,
    explanation: "Texte à copier — lancement humain hors Gigi.",
    riskLevel: "medium" as const,
    requiresHumanEdit: text.includes("<"),
    placeholders: [...text.match(/<[^>]+>/g) ?? []],
  }));
}

export function createCommandPackFromManualPacket(
  manualPacketId: string
): CommandPack | undefined {
  const packet = getManualExecutionPacketById(manualPacketId);
  if (!packet) return undefined;

  const timestamp = nowIso();
  const pack: CommandPack = {
    id: newId("cmd-pack"),
    title: `Pack commandes · ${packet.title.replace(/^Paquet manuel · /, "")}`,
    description: `Généré depuis le pont manuel V4.2 — commandes à copier, aucune exécution Gigi.`,
    createdAt: timestamp,
    updatedAt: timestamp,
    expiresAt: computeExpiresAt(timestamp),
    sourceManualPacketId: packet.id,
    sourceRequestId: packet.sourceRequestId,
    connectorId: packet.connectorId,
    category: "custom",
    status: "ready_for_review",
    riskLevel: packet.riskLevel,
    humanGoal: packet.humanGoal,
    environmentAssumptions: [
      "Environnement local contrôlé par l'humain",
      "Secrets jamais stockés dans Gigi",
    ],
    prerequisites: [...packet.preflightChecklist],
    commands: commandsFromManualPacket(packet.copyableCommands, packet.copyableInstructions),
    preflightChecklist: [...packet.preflightChecklist],
    postRunChecklist: [
      "Vérifier le résultat manuellement",
      "Marquer le statut dans Gigi (déclaratif)",
      "Gigi ne vérifie pas l'exécution réelle",
    ],
    rollbackCommands: packet.rollbackPlan.map((step, i) => ({
      id: newId("cp-cmd"),
      label: `Rollback ${i + 1}`,
      commandText: step.startsWith("#") || step.startsWith("git") ? step : `# ${step}`,
      explanation: "Rollback manuel documenté.",
      riskLevel: packet.riskLevel,
      requiresHumanEdit: false,
      placeholders: [],
    })),
    expectedOutcome: packet.expectedOutcome,
    knownRisks: ["Exécution sur mauvais environnement", "Commande copiée sans relecture"],
    requiredSecretsNames: [...packet.requiredSecretsNames],
    auditTrail: [
      audit(
        "command_pack_created",
        `Pack créé depuis paquet manuel ${packet.id}`,
        "ready_for_review"
      ),
    ],
    disclaimer: getCommandPackDisclaimer(),
  };

  return savePack(pack);
}

export function updateCommandPackStatus(
  packId: string,
  status: CommandPackStatus,
  reason?: string
): CommandPack | undefined {
  const pack = getCommandPackById(packId);
  if (!pack) return undefined;

  const timestamp = nowIso();
  const auditType: CommandPackAuditEntry["type"] =
    status === "copied_by_human"
      ? "command_copied_by_human"
      : status === "marked_run_by_human"
        ? "marked_run_by_human"
        : status === "marked_success_by_human"
          ? "marked_success_by_human"
          : status === "marked_failed_by_human"
            ? "marked_failed_by_human"
            : status === "cancelled"
              ? "cancelled"
              : "status_change";

  const defaultReason =
    status === "marked_run_by_human"
      ? "Marqué lancé par l'humain — Gigi ne vérifie pas l'exécution réelle."
      : status === "marked_success_by_human"
        ? "Succès déclaré par l'humain — statut local uniquement."
        : status === "marked_failed_by_human"
          ? "Échec déclaré par l'humain — statut local uniquement."
          : `Statut → ${status}`;

  return savePack({
    ...pack,
    status,
    updatedAt: timestamp,
    auditTrail: [audit(auditType, reason ?? defaultReason, status), ...pack.auditTrail],
  });
}

export function recordCommandCopied(packId: string, commandId: string): CommandPack | undefined {
  const pack = getCommandPackById(packId);
  if (!pack) return undefined;
  const cmd = pack.commands.find((c) => c.id === commandId);
  const timestamp = nowIso();
  return savePack({
    ...pack,
    status: pack.status === "ready_for_review" ? "copied_by_human" : pack.status,
    updatedAt: timestamp,
    auditTrail: [
      audit(
        "command_copied_by_human",
        `Commande copiée : ${cmd?.label ?? commandId} — lancement humain attendu.`
      ),
      ...pack.auditTrail,
    ],
  });
}
