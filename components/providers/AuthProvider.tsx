"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  ensureUserProfile,
  getCurrentSession,
  onAuthChange,
  signInWithMagicLink,
  signOut as authSignOut,
  waitForAuthenticatedUser,
} from "@/modules/supabase/auth";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import type { AuthResult, AuthStatus, AuthUserProfile } from "@/modules/supabase/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AuthUserProfile | null;
  profileError?: string;
  status: AuthStatus;
  errorMessage?: string;
  signIn: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_EVENTS = new Set<AuthChangeEvent>([
  "INITIAL_SESSION",
  "SIGNED_IN",
  "TOKEN_REFRESHED",
  "USER_UPDATED",
]);

async function loadProfile(user?: User): Promise<{
  profile: AuthUserProfile | null;
  error?: string;
}> {
  const result = await ensureUserProfile({ user, retries: 3 });
  if (result.ok) {
    return { profile: result.profile ?? null };
  }
  return { profile: result.profile ?? null, error: result.error };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const applyAuthenticated = useCallback(
    async (nextSession: Session, nextUser?: User) => {
      const resolvedUser = nextUser ?? nextSession.user;
      setSession(nextSession);
      setUser(resolvedUser);
      setStatus("authenticated");
      setErrorMessage(undefined);

      const loaded = await loadProfile(resolvedUser);
      setProfile(loaded.profile);
      setProfileError(loaded.error);
    },
    []
  );

  const applyAnonymous = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(undefined);
    setErrorMessage(undefined);
    setStatus("anonymous");
  }, []);

  const applyNotConfigured = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(undefined);
    setErrorMessage(undefined);
    setStatus("not_configured");
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      applyNotConfigured();
      return;
    }

    try {
      const resolvedUser = await waitForAuthenticatedUser(5);
      const currentSession = await getCurrentSession();

      if (resolvedUser && currentSession) {
        await applyAuthenticated(currentSession, resolvedUser);
        return;
      }

      if (resolvedUser) {
        setSession(null);
        setUser(resolvedUser);
        setStatus("authenticated");
        setErrorMessage(undefined);
        const loaded = await loadProfile(resolvedUser);
        setProfile(loaded.profile);
        setProfileError(loaded.error);
        return;
      }

      applyAnonymous();
    } catch {
      setSession(null);
      setUser(null);
      setProfile(null);
      setProfileError(undefined);
      setErrorMessage("Erreur lors de la vérification de l'authentification.");
      setStatus("error");
    }
  }, [applyAnonymous, applyAuthenticated, applyNotConfigured]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      applyNotConfigured();
      return;
    }

    let cancelled = false;

    const unsubscribe = onAuthChange((event, nextSession) => {
      if (cancelled) return;

      if (event === "SIGNED_OUT") {
        applyAnonymous();
        return;
      }

      if (SESSION_EVENTS.has(event)) {
        if (nextSession?.user) {
          void applyAuthenticated(nextSession).catch(() => {
            if (!cancelled) {
              setErrorMessage("Erreur lors de la vérification de l'authentification.");
              setStatus("error");
            }
          });
          return;
        }

        if (event === "INITIAL_SESSION") {
          applyAnonymous();
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [applyAnonymous, applyAuthenticated, applyNotConfigured]);

  const signIn = useCallback(async (email: string) => signInWithMagicLink(email), []);

  const signOut = useCallback(async () => {
    const result = await authSignOut();
    if (result.ok) {
      if (isSupabaseConfigured()) {
        applyAnonymous();
      } else {
        applyNotConfigured();
      }
    }
    return result;
  }, [applyAnonymous, applyNotConfigured]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      profileError,
      status,
      errorMessage,
      signIn,
      signOut,
      refreshAuth,
    }),
    [session, user, profile, profileError, status, errorMessage, signIn, signOut, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
