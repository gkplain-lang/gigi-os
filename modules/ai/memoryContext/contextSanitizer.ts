import type { AiMemoryContext } from "./types";

const SECRET_PATTERNS = [
  /\bsk-[a-zA-Z0-9]{10,}\b/g,
  /\bOPENAI_API_KEY\b/gi,
  /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]+\b/g,
  /\bBearer\s+[a-zA-Z0-9._-]{10,}\b/gi,
  /\bapi[_-]?key\s*[:=]\s*\S+/gi,
  /\bpassword\s*[:=]\s*\S+/gi,
  /\bsecret\s*[:=]\s*\S+/gi,
];

const MAX_FIELD_LENGTH = 280;
const MAX_ARRAY_ITEMS = 24;

export function truncateText(value: string, maxLength = MAX_FIELD_LENGTH): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function stripSecrets(value: string): string {
  let next = value;
  for (const pattern of SECRET_PATTERNS) {
    next = next.replace(pattern, "[redacted]");
  }
  return next;
}

function sanitizeString(value: string | undefined | null, maxLength = MAX_FIELD_LENGTH): string | undefined {
  if (!value) return undefined;
  return truncateText(stripSecrets(value), maxLength);
}

function sanitizeIdList(ids: string[]): string[] {
  return [...new Set(ids.map((id) => stripSecrets(id).trim()).filter(Boolean))].slice(
    0,
    MAX_ARRAY_ITEMS
  );
}

/**
 * Removes secrets, truncates long fields, and caps collection sizes.
 */
export function sanitizeAiMemoryContext(context: AiMemoryContext): AiMemoryContext {
  return {
    currentMission: {
      id: stripSecrets(context.currentMission.id),
      title: sanitizeString(context.currentMission.title, 160) ?? "",
      projectId: stripSecrets(context.currentMission.projectId),
      projectName: sanitizeString(context.currentMission.projectName, 80) ?? "",
      status: stripSecrets(context.currentMission.status),
    },
    projectsSummary: context.projectsSummary.slice(0, context.limits.maxProjects).map((p) => ({
      id: stripSecrets(p.id),
      name: sanitizeString(p.name, 80) ?? "",
      status: stripSecrets(p.status),
      priority: stripSecrets(p.priority),
      currentMissionTitle: sanitizeString(p.currentMissionTitle, 120),
      nextAction: sanitizeString(p.nextAction, 160),
    })),
    recentHistory: context.recentHistory.slice(0, context.limits.maxHistoryEvents).map((h) => ({
      id: stripSecrets(h.id),
      type: stripSecrets(h.type),
      projectId: h.projectId ? stripSecrets(h.projectId) : undefined,
      missionId: h.missionId ? stripSecrets(h.missionId) : undefined,
      label: sanitizeString(h.label, 160) ?? "",
      createdAt: stripSecrets(h.createdAt),
    })),
    completedMissionIds: sanitizeIdList(context.completedMissionIds),
    postponedMissionIds: sanitizeIdList(context.postponedMissionIds),
    rejectedMissionIds: sanitizeIdList(context.rejectedMissionIds),
    memoryStatusSummary: context.memoryStatusSummary
      ? {
          mode: stripSecrets(context.memoryStatusSummary.mode),
          lastBackupAt: context.memoryStatusSummary.lastBackupAt ?? null,
          hasRemoteBackup: context.memoryStatusSummary.hasRemoteBackup,
          conflictDetected: context.memoryStatusSummary.conflictDetected,
          message: sanitizeString(context.memoryStatusSummary.message, 200) ?? "",
        }
      : undefined,
    remoteSnapshotSummary: context.remoteSnapshotSummary
      ? {
          projectsCount: context.remoteSnapshotSummary.projectsCount,
          missionsCount: context.remoteSnapshotSummary.missionsCount,
          historyEventsCount: context.remoteSnapshotSummary.historyEventsCount,
          lastActivityAt: context.remoteSnapshotSummary.lastActivityAt,
        }
      : undefined,
    decisionSummary: context.decisionSummary
      ? {
          topProjectId: context.decisionSummary.topProjectId
            ? stripSecrets(context.decisionSummary.topProjectId)
            : undefined,
          topProjectName: sanitizeString(context.decisionSummary.topProjectName, 80),
          headline: sanitizeString(context.decisionSummary.headline, 240) ?? "",
        }
      : undefined,
    limits: { ...context.limits },
    warnings: context.warnings
      .map((w) => sanitizeString(w, 200))
      .filter((w): w is string => Boolean(w))
      .slice(0, 8),
  };
}

export function enforceContextSizeLimit(context: AiMemoryContext): AiMemoryContext {
  let serialized = JSON.stringify(context);
  if (serialized.length <= context.limits.maxTextLength) {
    return context;
  }

  const trimmed: AiMemoryContext = {
    ...context,
    recentHistory: context.recentHistory.slice(0, Math.max(3, Math.floor(context.limits.maxHistoryEvents / 2))),
    projectsSummary: context.projectsSummary.slice(0, Math.max(4, Math.floor(context.limits.maxProjects / 2))),
    warnings: [
      ...context.warnings,
      "Contexte tronqué pour respecter la limite de taille.",
    ].slice(0, 8),
  };

  serialized = JSON.stringify(trimmed);
  if (serialized.length <= context.limits.maxTextLength) {
    return trimmed;
  }

  return {
    ...trimmed,
    recentHistory: trimmed.recentHistory.slice(0, 3),
    projectsSummary: trimmed.projectsSummary.slice(0, 4),
    remoteSnapshotSummary: undefined,
    decisionSummary: trimmed.decisionSummary
      ? { ...trimmed.decisionSummary, headline: truncateText(trimmed.decisionSummary.headline, 120) }
      : undefined,
    warnings: [...trimmed.warnings, "Contexte réduit au minimum."].slice(0, 8),
  };
}
