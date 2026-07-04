import { collectLocalMissions } from "@/modules/supabase/sync";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { DataSummary } from "./types";

function detectLastLocalActivity(localState: GigiLocalState): string | null {
  if (localState.history.length === 0) return null;

  let latest: string | null = null;
  for (const event of localState.history) {
    if (!event.date) continue;
    if (!latest || event.date > latest) {
      latest = event.date;
    }
  }
  return latest;
}

/**
 * Read-only summary of local Gigi state. Does not modify localStorage or React state.
 */
export function createLocalSnapshotSummary(localState: GigiLocalState): DataSummary {
  const missions = collectLocalMissions(localState);

  return {
    projectsCount: localState.projects.length,
    missionsCount: missions.length,
    historyEventsCount: localState.history.length,
    lastActivityAt: detectLastLocalActivity(localState),
    source: "local",
  };
}

export function summaryHasData(summary: DataSummary): boolean {
  return (
    summary.projectsCount > 0 ||
    summary.missionsCount > 0 ||
    summary.historyEventsCount > 0
  );
}
