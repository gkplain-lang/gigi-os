import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { isSupabaseConfigured } from "../client";
import {
  collectLocalMissions,
  mapLocalHistoryEventToHistoryEventRow,
  mapLocalMissionToMissionRow,
  mapLocalProjectToProjectRow,
  projectRowIdForLocalProject,
} from "./mappers";
import {
  getHistoryEvents,
  getMissions,
  getProjects,
  upsertHistoryEvents,
  upsertMissions,
  upsertProjects,
} from "./repositories";
import { resolveSyncUser } from "./resolveSyncUser";
import type {
  RemoteSnapshot,
  RepositoryResult,
  SyncResult,
  TableSyncDetail,
  TableSyncState,
} from "./types";

function blockedResult(
  status: SyncResult["status"],
  message: string,
  tableDetails: TableSyncDetail[] = []
): SyncResult {
  return {
    status,
    message,
    syncedProjects: 0,
    syncedMissions: 0,
    syncedHistoryEvents: 0,
    errors: [],
    tableDetails,
  };
}

function detailFromResult(
  table: TableSyncDetail["table"],
  rowsAttempted: number,
  result: RepositoryResult<number>
): TableSyncDetail {
  if (result.ok) {
    return {
      table,
      state: "success",
      rowsAttempted,
      rowsSynced: result.count ?? rowsAttempted,
    };
  }

  const state: TableSyncState =
    result.hint === "rls" || result.hint === "permission" ? "rls_blocked" : "error";

  return {
    table,
    state,
    rowsAttempted,
    rowsSynced: 0,
    code: result.code,
    message: result.error,
  };
}

/**
 * Manual local → Supabase backup. Does NOT modify localStorage or React state.
 */
export async function syncLocalStateToSupabase(
  localState: GigiLocalState
): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return blockedResult("not_configured", "Supabase n'est pas configuré localement.");
  }

  const auth = await resolveSyncUser();
  if (!auth.ok) {
    return blockedResult(auth.status, auth.error);
  }

  const userId = auth.userId;
  const errors: string[] = [];
  const tableDetails: TableSyncDetail[] = [];
  let syncedProjects = 0;
  let syncedMissions = 0;
  let syncedHistoryEvents = 0;

  const projectRows = localState.projects.map((p) =>
    mapLocalProjectToProjectRow(userId, p)
  );

  const projectResult = await upsertProjects(userId, projectRows);
  tableDetails.push(detailFromResult("projects", projectRows.length, projectResult));
  if (projectResult.ok) {
    syncedProjects = projectResult.count ?? 0;
  } else if (projectResult.error) {
    errors.push(projectResult.error);
  }

  const missions = collectLocalMissions(localState);
  const missionRows = missions.map((m) => {
    const projectRowId = m.projectId
      ? projectRowIdForLocalProject(m.projectId, userId)
      : null;
    return mapLocalMissionToMissionRow(userId, m, projectRowId);
  });

  const missionResult = await upsertMissions(userId, missionRows);
  tableDetails.push(detailFromResult("missions", missionRows.length, missionResult));
  if (missionResult.ok) {
    syncedMissions = missionResult.count ?? 0;
  } else if (missionResult.error) {
    errors.push(missionResult.error);
  }

  const historyRows = localState.history.map((e) =>
    mapLocalHistoryEventToHistoryEventRow(userId, e)
  );

  const historyResult = await upsertHistoryEvents(userId, historyRows);
  tableDetails.push(
    detailFromResult("history_events", historyRows.length, historyResult)
  );
  if (historyResult.ok) {
    syncedHistoryEvents = historyResult.count ?? 0;
  } else if (historyResult.error) {
    errors.push(historyResult.error);
  }

  const base = {
    syncedProjects,
    syncedMissions,
    syncedHistoryEvents,
    errors,
    userId,
    tableDetails,
  };

  const allOk = errors.length === 0;
  const anySynced = syncedProjects + syncedMissions + syncedHistoryEvents > 0;

  if (allOk && anySynced) {
    return {
      status: "success",
      message: "Sauvegarde locale envoyée vers Supabase.",
      ...base,
    };
  }

  if (anySynced && errors.length > 0) {
    return {
      status: "partial_success",
      message: "Sauvegarde partielle — certaines tables n'ont pas pu être envoyées.",
      ...base,
    };
  }

  return {
    status: "error",
    message: errors[0] ?? "Impossible de sauvegarder vers Supabase.",
    ...base,
  };
}

/** Diagnostic read — does NOT inject data into the app. */
export async function loadRemoteSnapshot(): Promise<
  | { ok: true; snapshot: RemoteSnapshot }
  | { ok: false; error: string; status: SyncResult["status"] }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: "not_configured",
      error: "Supabase n'est pas configuré localement.",
    };
  }

  const auth = await resolveSyncUser();
  if (!auth.ok) {
    return { ok: false, status: auth.status, error: auth.error };
  }

  const [projects, missions, history] = await Promise.all([
    getProjects(auth.userId),
    getMissions(auth.userId),
    getHistoryEvents(auth.userId),
  ]);

  const errors: string[] = [];
  if (!projects.ok && projects.error) errors.push(projects.error);
  if (!missions.ok && missions.error) errors.push(missions.error);
  if (!history.ok && history.error) errors.push(history.error);

  if (errors.length === 3) {
    return { ok: false, status: "error", error: errors[0] };
  }

  const allRows = [
    ...(projects.data ?? []),
    ...(missions.data ?? []),
    ...(history.data ?? []),
  ];

  let lastSyncedAt: string | null = null;
  for (const row of allRows) {
    const ts =
      "updated_at" in row && row.updated_at
        ? row.updated_at
        : "created_at" in row
          ? row.created_at
          : null;
    if (ts && (!lastSyncedAt || ts > lastSyncedAt)) {
      lastSyncedAt = ts;
    }
  }

  return {
    ok: true,
    snapshot: {
      projects: projects.data ?? [],
      missions: missions.data ?? [],
      historyEvents: history.data ?? [],
      lastSyncedAt,
    },
  };
}
