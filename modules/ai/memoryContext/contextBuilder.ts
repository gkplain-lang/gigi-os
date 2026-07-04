import { explainDecisionFromProjects } from "@/modules/decision-engine/runDecisionEngine";
import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import type { MemoryStatus } from "@/modules/memory/types";
import type { DataSummary } from "@/modules/persistence/types";
import { resolveContextLimits } from "./contextLimits";
import { enforceContextSizeLimit, sanitizeAiMemoryContext } from "./contextSanitizer";
import type {
  AiMemoryContext,
  AiMemoryStatusSummary,
  BuildAiMemoryContextParams,
} from "./types";

function buildMemoryStatusSummary(memoryStatus?: MemoryStatus | null): AiMemoryStatusSummary | undefined {
  if (!memoryStatus) return undefined;

  const hasRemoteBackup =
    memoryStatus.mode === "connected_backup_available" ||
    memoryStatus.mode === "connected_recently_backed_up" ||
    Boolean(memoryStatus.remoteSummary);

  return {
    mode: memoryStatus.mode,
    lastBackupAt: memoryStatus.lastBackupAt,
    hasRemoteBackup,
    conflictDetected: memoryStatus.mode === "connected_conflict",
    message: memoryStatus.message,
  };
}

function buildWarnings(
  memoryStatusSummary?: AiMemoryStatusSummary,
  includeRemoteSnapshot?: boolean
): string[] {
  const warnings: string[] = [
    "L'IA ne synchronise, ne restaure et ne modifie rien — suggestions uniquement.",
  ];

  if (memoryStatusSummary?.conflictDetected) {
    warnings.push(
      "Conflit mémoire local/Supabase détecté — recommander une revue manuelle, jamais un restore automatique."
    );
  }

  if (includeRemoteSnapshot) {
    warnings.push("Snapshot Supabase résumé inclus — ne pas supposer qu'il est à jour en temps réel.");
  }

  return warnings;
}

/**
 * Builds a read-only, bounded memory context for AI prompts.
 * Does not sync, restore, or mutate any state.
 */
export function buildAiMemoryContext(params: BuildAiMemoryContextParams): AiMemoryContext {
  const limits = resolveContextLimits({
    ...params.limits,
    includeRemoteSnapshot:
      params.includeRemoteSnapshot ?? params.limits?.includeRemoteSnapshot ?? false,
  });

  const { localState, memoryStatus, remoteSnapshot } = params;
  const memoryStatusSummary = buildMemoryStatusSummary(memoryStatus);

  const currentProjectName =
    localState.mission.projectName ||
    PROJECT_NAMES[localState.mission.projectId] ||
    localState.mission.projectId;

  const projectsSummary = localState.projects.slice(0, limits.maxProjects).map((project) => {
    const isCurrentProject = project.id === localState.mission.projectId;
    return {
      id: project.id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      currentMissionTitle: isCurrentProject ? localState.mission.title : undefined,
      nextAction: project.nextAction,
    };
  });

  const recentHistory = localState.history.slice(0, limits.maxHistoryEvents).map((event) => ({
    id: event.id,
    type: event.type,
    label: event.description ? `${event.title} — ${event.description}` : event.title,
    createdAt: event.date,
  }));

  let decisionSummary: AiMemoryContext["decisionSummary"];
  try {
    const decision = explainDecisionFromProjects(localState.projects);
    const topProject = localState.projects.find((p) => p.name === decision.projectName);
    decisionSummary = {
      topProjectId: topProject?.id,
      topProjectName: decision.projectName,
      headline: `${decision.projectName} — ${decision.reasoning}`,
    };
  } catch {
    decisionSummary = undefined;
  }

  const includeRemote =
    limits.includeRemoteSnapshot &&
    (remoteSnapshot ?? memoryStatus?.remoteSummary ?? null);

  const remoteSnapshotSummary = includeRemote
    ? {
        projectsCount: (remoteSnapshot ?? memoryStatus?.remoteSummary)!.projectsCount,
        missionsCount: (remoteSnapshot ?? memoryStatus?.remoteSummary)!.missionsCount,
        historyEventsCount: (remoteSnapshot ?? memoryStatus?.remoteSummary)!.historyEventsCount,
        lastActivityAt: (remoteSnapshot ?? memoryStatus?.remoteSummary)!.lastActivityAt,
      }
    : undefined;

  const raw: AiMemoryContext = {
    currentMission: {
      id: localState.mission.id,
      title: localState.mission.title,
      projectId: localState.mission.projectId,
      projectName: currentProjectName,
      status: localState.mission.status,
    },
    projectsSummary,
    recentHistory,
    completedMissionIds: [...localState.completedMissionIds],
    postponedMissionIds: [...localState.postponedMissionIds],
    rejectedMissionIds: [...localState.rejectedMissionIds],
    memoryStatusSummary,
    remoteSnapshotSummary,
    decisionSummary,
    limits,
    warnings: buildWarnings(memoryStatusSummary, Boolean(remoteSnapshotSummary)),
  };

  const sanitized = sanitizeAiMemoryContext(raw);
  return enforceContextSizeLimit(sanitized);
}

/** Safe wrapper — returns undefined on failure instead of throwing. */
export function tryBuildAiMemoryContext(
  params: BuildAiMemoryContextParams
): AiMemoryContext | undefined {
  try {
    return buildAiMemoryContext(params);
  } catch {
    return undefined;
  }
}
