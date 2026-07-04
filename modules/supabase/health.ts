import { getSupabaseClient, isSupabaseConfigured } from "./client";

/**
 * V0.4.2 — safe Supabase connection check.
 *
 * This never throws, never logs secrets, and never requires auth.
 * Gigi OS still runs on localStorage; this only verifies connectivity.
 */

export type SupabaseHealthStatus = "not_configured" | "connected" | "error";

export interface SupabaseHealthResult {
  status: SupabaseHealthStatus;
  message: string;
  /** True when the connection works but RLS/auth restricts data access. */
  rlsLikely?: boolean;
  /** Safe error code (never a secret). */
  code?: string;
}

export async function checkSupabaseConnection(): Promise<SupabaseHealthResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: "not_configured",
      message: "Supabase n'est pas encore configuré localement.",
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      status: "not_configured",
      message: "Supabase n'est pas encore configuré localement.",
    };
  }

  try {
    // Lightweight, safe query. With RLS + no auth this returns [] (no error).
    const { error } = await client.from("profiles").select("id").limit(1);

    if (error) {
      const code = error.code;
      const msg = (error.message ?? "").toLowerCase();
      const rlsLikely =
        code === "42501" ||
        msg.includes("permission") ||
        msg.includes("row-level") ||
        msg.includes("rls");

      if (rlsLikely) {
        return {
          status: "connected",
          message:
            "Connexion établie. L'accès aux données est restreint par la RLS (authentification requise plus tard).",
          rlsLikely: true,
          code,
        };
      }

      return {
        status: "error",
        message:
          "Supabase a répondu avec une erreur. Vérifie l'URL du projet, la clé anon et le schéma SQL.",
        code,
      };
    }

    return {
      status: "connected",
      message: "Connexion à Supabase réussie.",
    };
  } catch {
    // Network / invalid config — never expose internals.
    return {
      status: "error",
      message:
        "Impossible de joindre Supabase. Vérifie ta connexion et les variables d'environnement.",
    };
  }
}
