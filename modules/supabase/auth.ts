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
    if (!error && data.session) return data.session;

    const { data: userData, error: userError } = await client.auth.getUser();
    if (!userError && userData.user) {
      const { data: retry } = await client.auth.getSession();
      return retry.session ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRlsError(code?: string, message?: string): boolean {
  const msg = (message ?? "").toLowerCase();
  return (
    code === "42501" ||
    msg.includes("permission") ||
    msg.includes("row-level") ||
    msg.includes("rls")
  );
}

function isRetryableAuthError(code?: string, message?: string): boolean {
  const msg = (message ?? "").toLowerCase();
  return (
    code === "PGRST301" ||
    msg.includes("jwt") ||
    msg.includes("token") ||
    msg.includes("not authenticated")
  );
}

function profileErrorMessage(
  error: { code?: string; message?: string },
  phase: "select" | "insert"
): string {
  const code = error.code;
  const msg = (error.message ?? "").toLowerCase();

  if (isRlsError(code, error.message)) {
    return "Accès au profil refusé par la RLS. Vérifie les policies sur public.profiles (auth.uid() = id).";
  }
  if (code === "42P01" || msg.includes("does not exist")) {
    return "La table public.profiles est absente. Exécute supabase/schema.sql dans Supabase.";
  }
  if (code === "42703" || msg.includes("column")) {
    return "Structure de profil incompatible avec le schéma Aegis. Vérifie supabase/schema.sql.";
  }
  if (code === "23505") {
    return "Le profil existe déjà — réessaie dans un instant.";
  }

  return phase === "select"
    ? "Impossible de récupérer le profil."
    : "Impossible de créer le profil.";
}

/** Waits until Supabase Auth exposes a validated user (avoids PostgREST race after magic link). */
export async function waitForAuthenticatedUser(
  maxAttempts = 10
): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await client.auth.getUser();
    if (data.user && !error) return data.user;

    if (error && !isRetryableAuthError(error.code, error.message) && attempt > 2) {
      return null;
    }

    await delay(100 + attempt * 75);
  }

  return null;
}

async function fetchProfileByOwner(
  userId: string
): Promise<{ profile: AuthUserProfile | null; error: { code?: string; message?: string } | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { profile: null, error: { message: "client missing" } };
  }

  // profiles.id = auth.users.id (see supabase/schema.sql)
  const { data, error } = await client
    .from("profiles")
    .select("id, email, display_name, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error: { code: error.code, message: error.message } };
  }

  return { profile: (data as AuthUserProfile | null) ?? null, error: null };
}

async function createProfileForUser(user: User): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
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
    .maybeSingle();

  if (!insertError && created) {
    return { ok: true, profile: created as AuthUserProfile };
  }

  if (insertError?.code === "23505") {
    const refetch = await fetchProfileByOwner(user.id);
    if (refetch.profile) {
      return { ok: true, profile: refetch.profile };
    }
  }

  if (insertError) {
    return {
      ok: false,
      error: profileErrorMessage(insertError, "insert"),
    };
  }

  return { ok: false, error: "Impossible de créer le profil." };
}

export async function ensureUserProfile(options?: {
  user?: User;
  retries?: number;
}): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase n'est pas configuré localement." };
  }

  const user = options?.user ?? (await waitForAuthenticatedUser());
  if (!user) {
    return { ok: false, error: "Aucun utilisateur connecté." };
  }

  const maxAttempts = options?.retries ?? 3;

  try {
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      const { profile, error: selectError } = await fetchProfileByOwner(user.id);

      if (profile) {
        return { ok: true, profile };
      }

      if (selectError) {
        const retrySelect =
          isRetryableAuthError(selectError.code, selectError.message) &&
          attempt < maxAttempts;

        if (retrySelect) {
          await delay(120 + attempt * 80);
          continue;
        }

        if (!isRlsError(selectError.code, selectError.message)) {
          return {
            ok: false,
            error: profileErrorMessage(selectError, "select"),
          };
        }
      }

      const created = await createProfileForUser(user);
      if (created.ok) {
        return created;
      }

      const retryCreate =
        attempt < maxAttempts &&
        (created.error?.includes("réessaie") ||
          created.error?.includes("RLS") ||
          created.error?.includes("JWT") ||
          created.error?.includes("jwt"));

      if (retryCreate) {
        await delay(120 + attempt * 80);
        continue;
      }

      return created;
    }

    return { ok: false, error: "Impossible de récupérer le profil." };
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

    const user = await waitForAuthenticatedUser();
    if (!user) {
      return {
        ok: false,
        error: "Session introuvable. Le lien a peut-être expiré — réessaie.",
      };
    }

    return ensureUserProfile({ user, retries: 5 });
  } catch {
    return { ok: false, error: "Impossible de finaliser la connexion." };
  }
}
