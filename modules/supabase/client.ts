import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * V0.4.1 — Supabase foundation ONLY.
 *
 * This module prepares a browser Supabase client but does NOT yet power the app.
 * Gigi OS still runs entirely on localStorage (key: `gigi-os-v03-state`).
 * Persistence/auth/migration land in V0.4.2 / V0.4.3.
 *
 * If the env vars are missing, we fail gracefully: `getSupabaseClient()` returns
 * `null` instead of throwing, so the app keeps working locally without Supabase.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/**
 * Returns a singleton browser Supabase client, or `null` if not configured.
 * Callers must handle the `null` case (local-only fallback).
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      console.info(
        "[gigi] Supabase non configuré — l'app continue en local (localStorage)."
      );
    }
    return null;
  }

  if (!client) {
    client = createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }

  return client;
}
