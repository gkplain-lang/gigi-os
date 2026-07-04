import type { AiMemoryContext, AiMemoryContextStats } from "./types";

export function summarizeAiMemoryContext(context: AiMemoryContext | undefined | null): AiMemoryContextStats {
  if (!context) {
    return {
      hasContext: false,
      projectsCount: 0,
      historyCount: 0,
      hasCurrentMission: false,
      completedCount: 0,
      approximateSizeChars: 0,
      warnings: [],
      includeRemoteSnapshot: false,
    };
  }

  return {
    hasContext: true,
    projectsCount: context.projectsSummary.length,
    historyCount: context.recentHistory.length,
    hasCurrentMission: Boolean(context.currentMission?.id),
    completedCount: context.completedMissionIds.length,
    approximateSizeChars: JSON.stringify(context).length,
    warnings: context.warnings,
    includeRemoteSnapshot: Boolean(context.remoteSnapshotSummary),
  };
}
