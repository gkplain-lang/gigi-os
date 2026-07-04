import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "./client";
import type { AuthResult, AuthUserProfile, ProfileInsert } from "./types";

/**
 * V0.4.3 — Supabase auth foundation (magic link / OTP).
 *
 * Optional auth: the app keeps working without Supabase or without a session.
 * Never throws to the UI, never logs secrets.
 */

function safeAuthError(message?: string): string {
  const msg = (message ?? "").toLowerCase();
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  }
  if (msg.includes("invalid email")) {
    return "Adresse email invalide.";
  }
  if (msg.includes("signup") && msg.includes("disabled")) {
    return "Les inscriptions par email ne sont pas activées sur ce projet Supabase.";
  }
  if (msg.includes("redirect")) {
    return "URL de redirection non autorisée. Vérifie la configuration Supabase.";
  }
  return "Impossible de finaliser l'authentification. Réessaie.";
}

export function getAuthRedirectUrl(): string {
  if (typeof window === "undefined") return "/auth/callback";
  return `${window.location.origin}/auth/callback`;
}

export async function getCurrentSession(): Promise<Session | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data.session;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function signInWithMagicLink(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) {
    return { ok: false, error: "Adresse email invalide." };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  try {
    const { error } = await client.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: getAuthRedirectUrl() },
    });

    if (error) {
      return { ok: false, error: safeAuthError(error.message) };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'envoyer le lien de connexion." };
  }
}

export async function signOut(): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: true };
  }

  try {
    const { error } = await client.auth.signOut();
    if (error) {
      return { ok: false, error: "Impossible de se déconnecter." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible de se déconnecter." };
  }
}

export type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

export function onAuthChange(callback: AuthChangeCallback): () => void {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => subscription.unsubscribe();
}

export async function ensureUserProfile(): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Aucun utilisateur connecté." };
  }

  try {
    const { data: existing, error: selectError } = await client
      .from("profiles")
      .select("id, email, display_name, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) {
      return { ok: false, error: "Impossible de récupérer le profil." };
    }

    if (existing) {
      return { ok: true, profile: existing as AuthUserProfile };
    }

    const insertRow: ProfileInsert = {
      id: user.id,
      email: user.email ?? null,
    };

    const { data: created, error: insertError } = await client
      .from("profiles")
      // Cast required until full generated Database types (postgrest v2.109 Insert inference)
      .insert(insertRow as never)
      .select("id, email, display_name, created_at, updated_at")
      .single();

    if (insertError || !created) {
      return { ok: false, error: "Impossible de créer le profil." };
    }

    return { ok: true, profile: created as AuthUserProfile };
  } catch {
    return { ok: false, error: "Erreur lors de la gestion du profil." };
  }
}

/**
 * Completes the magic-link callback (PKCE code or implicit hash).
 */
export async function completeAuthCallback(): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  try {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) {
          return { ok: false, error: safeAuthError(error.message) };
        }
      }
    }

    const session = await getCurrentSession();
    if (!session?.user) {
      return {
        ok: false,
        error: "Session introuvable. Le lien a peut-être expiré — réessaie.",
      };
    }

    return ensureUserProfile();
  } catch {
    return { ok: false, error: "Impossible de finaliser la connexion." };
  }
}
