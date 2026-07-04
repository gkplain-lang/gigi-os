import { getSupabaseClient, isSupabaseConfigured } from "../client";
import type { HistoryEventRow, MissionRow, ProjectRow } from "../types";
import type { RepositoryResult, SyncTableName } from "./types";

function classifyError(
  table: SyncTableName,
  code: string | undefined,
  message: string
): RepositoryResult<never> {
  const msg = message.toLowerCase();
  const safeCode = code ?? "unknown";

  if (
    code === "42501" ||
    msg.includes("row-level security") ||
    msg.includes("violates row-level")
  ) {
    return {
      ok: false,
      table,
      code: safeCode,
      hint: "rls",
      error: `[${table}] RLS bloquée (${safeCode}). Vérifie user_id = auth.uid() et exécute supabase/patches/2026-07-04-fix-sync-rls.sql.`,
    };
  }

  if (msg.includes("permission denied")) {
    return {
      ok: false,
      table,
      code: safeCode,
      hint: "permission",
      error: `[${table}] Permission refusée (${safeCode}). Exécute supabase/patches/2026-07-04-fix-sync-rls.sql dans Supabase.`,
    };
  }

  if (code === "23503" || msg.includes("foreign key")) {
    return {
      ok: false,
      table,
      code: safeCode,
      hint: "constraint",
      error: `[${table}] Contrainte FK (${safeCode}) — sauvegarde les projets avant les missions.`,
    };
  }

  if (code === "23514" || msg.includes("violates check constraint")) {
    return {
      ok: false,
      table,
      code: safeCode,
      hint: "constraint",
      error: `[${table}] Valeur incompatible avec le schéma (${safeCode}).`,
    };
  }

  return {
    ok: false,
    table,
    code: safeCode,
    hint: "unknown",
    error: `[${table}] Erreur ${safeCode}.`,
  };
}

function clientError(): RepositoryResult<never> {
  return { ok: false, error: "Supabase n'est pas configuré localement." };
}

function assertUserIdOnRows(
  table: SyncTableName,
  userId: string,
  rows: Array<{ user_id?: string }>
): RepositoryResult<never> | null {
  for (const row of rows) {
    if (!row.user_id) {
      return {
        ok: false,
        table,
        hint: "unknown",
        error: `[${table}] user_id manquant sur une row — sync annulée.`,
      };
    }
    if (row.user_id !== userId) {
      return {
        ok: false,
        table,
        hint: "unknown",
        error: `[${table}] user_id incohérent — doit être auth.users.id.`,
      };
    }
  }
  return null;
}

async function upsertRows<T extends { user_id?: string }>(
  table: SyncTableName,
  userId: string,
  rows: T[]
): Promise<RepositoryResult<number>> {
  if (!isSupabaseConfigured()) return clientError();
  if (rows.length === 0) return { ok: true, count: 0, table };

  const invalid = assertUserIdOnRows(table, userId, rows);
  if (invalid) return invalid;

  const client = getSupabaseClient();
  if (!client) return clientError();

  try {
    await client.auth.getSession();

    const payload = rows.map((row) => ({ ...row, user_id: userId }));

    const { error } = await client.from(table).upsert(payload as never[], {
      onConflict: "id",
    });

    if (error) {
      return classifyError(table, error.code, error.message ?? "");
    }

    return { ok: true, count: rows.length, table };
  } catch {
    return {
      ok: false,
      table,
      hint: "network",
      error: `[${table}] Impossible de joindre Supabase.`,
    };
  }
}

async function getRows<T>(
  table: SyncTableName,
  userId: string,
  orderColumn: string
): Promise<RepositoryResult<T[]>> {
  if (!isSupabaseConfigured()) return clientError();
  const client = getSupabaseClient();
  if (!client) return clientError();

  try {
    await client.auth.getSession();

    const { data, error } = await client
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .order(orderColumn, { ascending: false });

    if (error) {
      return classifyError(table, error.code, error.message ?? "");
    }

    return { ok: true, data: (data ?? []) as T[], table, count: data?.length ?? 0 };
  } catch {
    return {
      ok: false,
      table,
      hint: "network",
      error: `[${table}] Impossible de joindre Supabase.`,
    };
  }
}

export async function upsertProjects(
  userId: string,
  projects: Partial<ProjectRow>[]
): Promise<RepositoryResult<number>> {
  const rows = projects.map((p) => ({ ...p, user_id: userId }));
  return upsertRows("projects", userId, rows);
}

export async function getProjects(userId: string): Promise<RepositoryResult<ProjectRow[]>> {
  return getRows<ProjectRow>("projects", userId, "updated_at");
}

export async function upsertMissions(
  userId: string,
  missions: Partial<MissionRow>[]
): Promise<RepositoryResult<number>> {
  const rows = missions.map((m) => ({ ...m, user_id: userId }));
  return upsertRows("missions", userId, rows);
}

export async function getMissions(userId: string): Promise<RepositoryResult<MissionRow[]>> {
  return getRows<MissionRow>("missions", userId, "updated_at");
}

export async function upsertHistoryEvents(
  userId: string,
  events: Partial<HistoryEventRow>[]
): Promise<RepositoryResult<number>> {
  const rows = events.map((e) => ({ ...e, user_id: userId }));
  return upsertRows("history_events", userId, rows);
}

export async function getHistoryEvents(
  userId: string
): Promise<RepositoryResult<HistoryEventRow[]>> {
  return getRows<HistoryEventRow>("history_events", userId, "created_at");
}
