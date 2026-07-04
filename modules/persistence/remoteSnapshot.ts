import type { RemoteSnapshot } from "@/modules/supabase/sync";
import type { DataSummary } from "./types";

/**
 * Read-only summary from a Supabase snapshot loaded via V0.4.4.
 * Does not write anywhere.
 */
export function createRemoteSnapshotSummary(remoteSnapshot: RemoteSnapshot): DataSummary {
  return {
    projectsCount: remoteSnapshot.projects.length,
    missionsCount: remoteSnapshot.missions.length,
    historyEventsCount: remoteSnapshot.historyEvents.length,
    lastActivityAt: remoteSnapshot.lastSyncedAt,
    source: "remote",
  };
}
