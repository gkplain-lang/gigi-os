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
import type { Session, User } from "@supabase/supabase-js";
import {
  ensureUserProfile,
  getCurrentSession,
  onAuthChange,
  signInWithMagicLink,
  signOut as authSignOut,
} from "@/modules/supabase/auth";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import type { AuthResult, AuthStatus, AuthUserProfile } from "@/modules/supabase/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AuthUserProfile | null;
  status: AuthStatus;
  errorMessage?: string;
  signIn: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(): Promise<AuthUserProfile | null> {
  const result = await ensureUserProfile();
  if (result.ok && result.profile) return result.profile;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const refreshAuth = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setErrorMessage(undefined);
      setStatus("not_configured");
      return;
    }

    try {
      const currentSession = await getCurrentSession();
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        const loadedProfile = await loadProfile();
        setProfile(loadedProfile);
        setErrorMessage(undefined);
        setStatus("authenticated");
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setErrorMessage(undefined);
        setStatus("anonymous");
      }
    } catch {
      setSession(null);
      setUser(null);
      setProfile(null);
      setErrorMessage("Erreur lors de la vérification de l'authentification.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refreshAuth();

    const unsubscribe = onAuthChange(async (_event, nextSession) => {
      if (nextSession?.user) {
        setSession(nextSession);
        setUser(nextSession.user);
        const loadedProfile = await loadProfile();
        setProfile(loadedProfile);
        setErrorMessage(undefined);
        setStatus("authenticated");
      } else if (isSupabaseConfigured()) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setErrorMessage(undefined);
        setStatus("anonymous");
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setErrorMessage(undefined);
        setStatus("not_configured");
      }
    });

    return unsubscribe;
  }, [refreshAuth]);

  const signIn = useCallback(async (email: string) => signInWithMagicLink(email), []);

  const signOut = useCallback(async () => {
    const result = await authSignOut();
    if (result.ok) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setErrorMessage(undefined);
      setStatus(isSupabaseConfigured() ? "anonymous" : "not_configured");
    }
    return result;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      status,
      errorMessage,
      signIn,
      signOut,
      refreshAuth,
    }),
    [session, user, profile, status, errorMessage, signIn, signOut, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
