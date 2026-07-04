import { PROJECT_NAMES } from "../conversation/missionCatalog";
import type { GigiLocalState } from "../storage/gigiStateTypes";
import type { HistoryEvent } from "../history/historyTypes";
import { inferProjectIdFromEvent } from "./reviewSignals";
import type { StaleProject } from "./types";

const ACTIVE_PROJECT_IDS = [
  "buildy-clear",
  "buildy-crafts",
  "gigi-os",
  "linko",
  "1millimetre",
  "le-dernier-souvenir",
];

function projectHasRecentActivity(projectId: string, events: HistoryEvent[]): boolean {
  for (const event of events) {
    const inferred = inferProjectIdFromEvent(event);
    if (inferred === projectId) return true;
  }
  return false;
}

/**
 * A project is stale when it exists but has no associated recent history event.
 * Works even when older events lack meta — falls back to title matching.
 */
export function detectStaleProjects(state: GigiLocalState): StaleProject[] {
  const history = state.history ?? [];
  const recent = history.filter((e) => e.group === "today" || e.group === "yesterday");
  const stale: StaleProject[] = [];

  const projectIds = new Set<string>();
  for (const p of state.projects ?? []) projectIds.add(p.id);
  for (const id of ACTIVE_PROJECT_IDS) projectIds.add(id);

  for (const projectId of projectIds) {
    const projectName = PROJECT_NAMES[projectId] ?? projectId;
    const project = state.projects.find((p) => p.id === projectId);
    if (project?.status === "archived" || project?.status === "completed") continue;

    const hasRecent = projectHasRecentActivity(projectId, recent);
    const hasAny = projectHasRecentActivity(projectId, history);

    if (!hasRecent) {
      stale.push({
        projectId,
        projectName,
        reason: hasAny
          ? "Aucune activité aujourd'hui ni hier"
          : "Aucun événement récent associé à ce projet",
        daysSinceActivity: hasAny ? 2 : null,
      });
    }
  }

  return stale
    .filter((s) => s.projectId !== state.mission.projectId)
    .sort((a, b) => a.projectName.localeCompare(b.projectName));
}
