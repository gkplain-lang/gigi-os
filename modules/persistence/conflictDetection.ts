import { summaryHasData } from "./localSnapshot";
import type { ConflictType, DataSummary } from "./types";

export interface ConflictDetectionResult {
  hasConflict: boolean;
  conflictType: ConflictType | null;
}

/**
 * Compares local and remote summaries. Does not resolve conflicts automatically.
 */
export function detectPersistenceConflict(
  localSummary: DataSummary,
  remoteSummary: DataSummary | null | undefined
): ConflictDetectionResult {
  if (!remoteSummary) {
    return { hasConflict: false, conflictType: null };
  }

  const hasLocal = summaryHasData(localSummary);
  const hasRemote = summaryHasData(remoteSummary);

  if (hasLocal && !hasRemote) {
    return { hasConflict: false, conflictType: "remote_empty_local_exists" };
  }

  if (!hasLocal && hasRemote) {
    return { hasConflict: false, conflictType: "local_empty_remote_exists" };
  }

  if (!hasLocal && !hasRemote) {
    return { hasConflict: false, conflictType: null };
  }

  const localAt = localSummary.lastActivityAt;
  const remoteAt = remoteSummary.lastActivityAt;

  if (localAt && remoteAt) {
    if (localAt > remoteAt) {
      return { hasConflict: true, conflictType: "local_newer" };
    }
    if (remoteAt > localAt) {
      return { hasConflict: true, conflictType: "remote_newer" };
    }
  }

  const countsMatch =
    localSummary.projectsCount === remoteSummary.projectsCount &&
    localSummary.missionsCount === remoteSummary.missionsCount &&
    localSummary.historyEventsCount === remoteSummary.historyEventsCount;

  if (countsMatch) {
    return { hasConflict: false, conflictType: "both_have_data" };
  }

  if (!localAt || !remoteAt) {
    return { hasConflict: true, conflictType: "unknown" };
  }

  return { hasConflict: true, conflictType: "both_have_data" };
}
