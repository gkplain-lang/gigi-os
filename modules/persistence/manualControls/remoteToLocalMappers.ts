import { mockProjects } from "@/data/mockProjects";
import {
  DEFAULT_MISSION_ID,
  MISSION_CATALOG,
  PROJECT_NAMES,
  catalogToMission,
  getCatalogMission,
} from "@/modules/conversation/missionCatalog";
import { getHistoryGroup } from "@/modules/history/historyUtils";
import type { HistoryEvent, HistoryEventType } from "@/modules/history/historyTypes";
import type { Mission, MissionImpact, MissionStatus } from "@/modules/missions/missionTypes";
import type { Project, ProjectPriority, ProjectStatus } from "@/modules/projects/projectTypes";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { RemoteSnapshot } from "@/modules/supabase/sync";
import { stableRowId } from "@/modules/supabase/sync/stableId";
import type {
  HistoryEventRow,
  HistoryEventTypeRow,
  MissionRow,
  MissionStatusRow,
  ProjectRow,
  ProjectStatusRow,
} from "@/modules/supabase/types";
import type { MappingValidationResult } from "./types";

const PROJECT_STATUS_REVERSE: Record<ProjectStatusRow, ProjectStatus> = {
  active: "active",
  paused: "paused",
  completed: "completed",
  future: "future",
  archived: "archived",
};

const MISSION_STATUS_REVERSE: Record<MissionStatusRow, MissionStatus> = {
  recommended: "recommended",
  available: "recommended",
  in_progress: "in_progress",
  completed: "completed",
  postponed: "postponed",
  rejected_for_now: "rejected_for_now",
  archived: "completed",
};

const HISTORY_TYPE_REVERSE: Partial<Record<HistoryEventTypeRow, HistoryEventType>> = {
  mission_completed: "mission_completed",
  mission_started: "mission_started",
  mission_postponed: "mission_postponed",
  mission_rejected: "mission_rejected",
  decision_made: "decision_created",
  project_updated: "project_updated",
  local_data_imported: "data_reset",
};

const KNOWN_PROJECT_IDS = mockProjects.map((p) => p.id);
const KNOWN_MISSION_IDS = MISSION_CATALOG.map((m) => m.id);

const VALID_PRIORITIES = new Set<ProjectPriority>(["critical", "high", "medium", "low"]);

function resolveLocalProjectId(row: ProjectRow, userId: string): string | null {
  const meta = row as ProjectRow & { metadata?: Record<string, unknown> | null };
  const fromMeta = meta.metadata?.local_id;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;

  for (const localId of KNOWN_PROJECT_IDS) {
    if (stableRowId(localId, userId, "project") === row.id) return localId;
  }

  const byName = mockProjects.find(
    (p) => p.name.toLowerCase() === row.name.toLowerCase()
  );
  return byName?.id ?? null;
}

function resolveLocalMissionId(row: MissionRow, userId: string): string | null {
  const meta = row as MissionRow & { metadata?: Record<string, unknown> | null };
  const fromMeta = meta.metadata?.local_id;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;

  for (const localId of KNOWN_MISSION_IDS) {
    if (stableRowId(localId, userId, "mission") === row.id) return localId;
  }

  const byTitle = MISSION_CATALOG.find(
    (m) => m.title.replace(/\.$/, "") === row.title.replace(/\.$/, "")
  );
  return byTitle?.id ?? null;
}

function resolveLocalProjectIdFromRemoteUuid(
  remoteProjectId: string | null,
  userId: string,
  rowIdToLocal: Map<string, string>
): string | null {
  if (!remoteProjectId) return null;
  if (rowIdToLocal.has(remoteProjectId)) return rowIdToLocal.get(remoteProjectId)!;

  for (const localId of KNOWN_PROJECT_IDS) {
    if (stableRowId(localId, userId, "project") === remoteProjectId) return localId;
  }
  return null;
}

function mapImpactFromScore(score: number | null): MissionImpact {
  if (score === null) return "Moyen";
  if (score >= 8) return "Élevé";
  if (score >= 5) return "Moyen";
  return "Faible";
}

function normalizePriority(value: string | null): ProjectPriority {
  if (value && VALID_PRIORITIES.has(value as ProjectPriority)) {
    return value as ProjectPriority;
  }
  return "medium";
}

export function validateRemoteSnapshotMapping(
  snapshot: RemoteSnapshot,
  userId: string
): MappingValidationResult {
  const errors: string[] = [];
  const unresolvedProjectIds: string[] = [];
  const unresolvedMissionIds: string[] = [];

  for (const row of snapshot.projects) {
    const localId = resolveLocalProjectId(row, userId);
    if (!localId) unresolvedProjectIds.push(row.id);
  }

  for (const row of snapshot.missions) {
    const localId = resolveLocalMissionId(row, userId);
    if (!localId) unresolvedMissionIds.push(row.id);
  }

  if (unresolvedProjectIds.length > 0) {
    errors.push(
      `${unresolvedProjectIds.length} projet(s) Supabase sans id local reconnu.`
    );
  }

  if (unresolvedMissionIds.length > 0) {
    errors.push(
      `${unresolvedMissionIds.length} mission(s) Supabase sans id local reconnu.`
    );
  }

  return {
    complete: errors.length === 0,
    errors,
    unresolvedProjectIds,
    unresolvedMissionIds,
  };
}

export function mapProjectRowsToLocalProjects(
  rows: ProjectRow[],
  userId: string
): Project[] {
  const projects: Project[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const localId = resolveLocalProjectId(row, userId);
    if (!localId || seen.has(localId)) continue;
    seen.add(localId);

    const template = mockProjects.find((p) => p.id === localId);
    const status = PROJECT_STATUS_REVERSE[row.status] ?? template?.status ?? "active";

    projects.push({
      id: localId,
      name: row.name,
      description: row.description ?? template?.description ?? "",
      status,
      progress: row.completion_proximity ?? template?.progress ?? 0,
      priority: normalizePriority(row.priority),
      nextAction: template?.nextAction ?? row.description ?? "—",
      blocker: template?.blocker,
      businessPotential: row.business_impact ?? template?.businessPotential ?? 5,
      strategicValue: row.strategic_value ?? template?.strategicValue ?? 5,
      urgency: row.urgency ?? template?.urgency ?? 5,
      estimatedEffort: row.effort_efficiency ?? template?.estimatedEffort ?? 5,
      clarity: row.clarity ?? template?.clarity ?? 5,
    });
  }

  return projects;
}

export function mapMissionRowsToLocalMissions(
  rows: MissionRow[],
  userId: string,
  projectRowIdToLocal: Map<string, string>
): Mission[] {
  const missions: Mission[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const localId = resolveLocalMissionId(row, userId);
    if (!localId || seen.has(localId)) continue;
    seen.add(localId);

    const catalog = getCatalogMission(localId);
    const base = catalog ? catalogToMission(catalog) : null;

    const localProjectId =
      resolveLocalProjectIdFromRemoteUuid(row.project_id, userId, projectRowIdToLocal) ??
      catalog?.projectId ??
      "";

    const status = MISSION_STATUS_REVERSE[row.status] ?? "recommended";

    missions.push({
      id: localId,
      title: row.title.endsWith(".") ? row.title : `${row.title.replace(/\.$/, "")}.`,
      projectId: localProjectId,
      projectName: PROJECT_NAMES[localProjectId] ?? localProjectId,
      reason: row.reason ?? base?.reason ?? "",
      estimatedDuration: row.estimated_time ?? base?.estimatedDuration ?? "~30 min",
      expectedImpact: mapImpactFromScore(row.impact ?? row.score),
      confidence: row.score ?? base?.confidence ?? 50,
      status,
      steps: catalog?.subtasks,
    });
  }

  return missions;
}

export function mapHistoryRowsToLocalHistory(rows: HistoryEventRow[]): HistoryEvent[] {
  return rows.map((row) => {
    const meta = row.metadata;
    const localType =
      (typeof meta?.local_type === "string"
        ? (meta.local_type as HistoryEventType)
        : undefined) ?? HISTORY_TYPE_REVERSE[row.type] ?? "decision_created";

    const dateRaw =
      typeof meta?.local_date === "string"
        ? meta.local_date
        : row.created_at.split("T")[0];

    const group =
      meta?.local_group === "today" ||
      meta?.local_group === "yesterday" ||
      meta?.local_group === "earlier"
        ? meta.local_group
        : getHistoryGroup(new Date(dateRaw));

    const id =
      typeof meta?.local_id === "string" && meta.local_id.length > 0
        ? meta.local_id
        : `h-restored-${row.id.slice(0, 8)}`;

    return {
      id,
      type: localType,
      title: row.title,
      description: row.description ?? undefined,
      date: dateRaw,
      group,
    };
  });
}

function buildProjectRowIdMap(rows: ProjectRow[], userId: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    const localId = resolveLocalProjectId(row, userId);
    if (localId) map.set(row.id, localId);
  }
  return map;
}

function pickActiveMission(missions: Mission[]): Mission {
  const inProgress = missions.find((m) => m.status === "in_progress");
  if (inProgress) return inProgress;

  const recommended = missions.find((m) => m.status === "recommended");
  if (recommended) return recommended;

  const defaultCatalog =
    getCatalogMission(DEFAULT_MISSION_ID) ?? MISSION_CATALOG[0];
  const fromRemote = missions.find((m) => m.id === defaultCatalog.id);
  if (fromRemote) return { ...fromRemote, status: "recommended" };

  if (missions.length > 0) {
    return { ...missions[0], status: "recommended" };
  }

  return catalogToMission(defaultCatalog);
}

/**
 * Rebuilds a GigiLocalState from a remote snapshot. Does not write to localStorage.
 */
export function mapRemoteSnapshotToLocalState(
  snapshot: RemoteSnapshot,
  userId: string
): { ok: true; state: GigiLocalState } | { ok: false; errors: string[] } {
  const validation = validateRemoteSnapshotMapping(snapshot, userId);
  if (!validation.complete) {
    return { ok: false, errors: validation.errors };
  }

  const projectRowIdToLocal = buildProjectRowIdMap(snapshot.projects, userId);
  const projects = mapProjectRowsToLocalProjects(snapshot.projects, userId);
  const missions = mapMissionRowsToLocalMissions(
    snapshot.missions,
    userId,
    projectRowIdToLocal
  );
  const history = mapHistoryRowsToLocalHistory(snapshot.historyEvents);

  const completedMissionIds = missions
    .filter((m) => m.status === "completed")
    .map((m) => m.id);
  const postponedMissionIds = missions
    .filter((m) => m.status === "postponed")
    .map((m) => m.id);
  const rejectedMissionIds = missions
    .filter((m) => m.status === "rejected_for_now")
    .map((m) => m.id);

  const mission = pickActiveMission(missions);

  return {
    ok: true,
    state: {
      mission,
      projects,
      history,
      completedMissionIds,
      postponedMissionIds,
      rejectedMissionIds,
    },
  };
}
