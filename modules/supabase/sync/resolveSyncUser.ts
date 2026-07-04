import { getCurrentSession, waitForAuthenticatedUser } from "../auth";
import { getSupabaseClient, isSupabaseConfigured } from "../client";
import type { SyncStatus } from "./types";

export type SyncUserResolution =
  | { ok: true; userId: string; hasAccessToken: boolean }
  | { ok: false; status: SyncStatus; error: string };

/**
 * Resolves auth.users.id for sync and verifies a JWT is available for PostgREST.
 */
export async function resolveSyncUser(): Promise<SyncUserResolution> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: "not_configured",
      error: "Supabase n'est pas configuré localement.",
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      status: "not_configured",
      error: "Supabase n'est pas configuré localement.",
    };
  }

  let session = await getCurrentSession();

  if (!session?.user?.id) {
    const user = await waitForAuthenticatedUser(5);
    if (!user) {
      return {
        ok: false,
        status: "anonymous",
        error: "Connecte-toi pour sauvegarder vers Supabase.",
      };
    }
    session = await getCurrentSession();
  }

  const userId = session?.user?.id;
  if (!userId) {
    return {
      ok: false,
      status: "anonymous",
      error: "Session utilisateur introuvable — reconnecte-toi via /auth.",
    };
  }

  const hasAccessToken = Boolean(session?.access_token);
  if (!hasAccessToken) {
    return {
      ok: false,
      status: "anonymous",
      error: "Jeton de session absent — reconnecte-toi via /auth.",
    };
  }

  return { ok: true, userId, hasAccessToken };
}

export function maskUserId(userId: string): string {
  if (userId.length <= 10) return userId;
  return `${userId.slice(0, 8)}…${userId.slice(-4)}`;
}
