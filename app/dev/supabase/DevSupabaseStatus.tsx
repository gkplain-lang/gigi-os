"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  checkSupabaseConnection,
  type SupabaseHealthResult,
} from "@/modules/supabase/health";
import { getCurrentSession, getCurrentUser } from "@/modules/supabase/auth";
import type { AuthStatus } from "@/modules/supabase/types";

const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  loading: "Chargement…",
  not_configured: "Non configuré",
  anonymous: "Anonyme",
  authenticated: "Connecté",
  error: "Erreur",
};

export function DevSupabaseStatus() {
  const {
    status: authStatus,
    session,
    user,
    profile,
    profileError,
    refreshAuth,
  } = useAuth();

  const [connResult, setConnResult] = useState<SupabaseHealthResult | null>(null);
  const [connLoading, setConnLoading] = useState(false);
  const [authRefreshing, setAuthRefreshing] = useState(false);
  const [directSession, setDirectSession] = useState<boolean | null>(null);
  const [directUserEmail, setDirectUserEmail] = useState<string | null>(null);
  const [directLoading, setDirectLoading] = useState(false);

  const runConnectionCheck = useCallback(async () => {
    setConnLoading(true);
    const r = await checkSupabaseConnection();
    setConnResult(r);
    setConnLoading(false);
  }, []);

  const runDirectSessionProbe = useCallback(async () => {
    setDirectLoading(true);
    const [s, u] = await Promise.all([getCurrentSession(), getCurrentUser()]);
    setDirectSession(Boolean(s));
    setDirectUserEmail(u?.email ?? null);
    setDirectLoading(false);
  }, []);

  const runAuthRefresh = useCallback(async () => {
    setAuthRefreshing(true);
    await refreshAuth();
    await runDirectSessionProbe();
    setAuthRefreshing(false);
  }, [refreshAuth, runDirectSessionProbe]);

  useEffect(() => {
    void runConnectionCheck();
    void runDirectSessionProbe();
    void refreshAuth();
  }, [runConnectionCheck, runDirectSessionProbe, refreshAuth]);

  const connLabel =
    connResult?.status === "connected"
      ? connResult.rlsLikely
        ? "Connecté (accès données limité par RLS)"
        : "Connecté"
      : connResult?.status === "not_configured"
        ? "Non configuré"
        : connResult?.status === "error"
          ? "Erreur / accès bloqué"
          : "Vérification…";

  const connDotColor =
    connResult?.status === "connected"
      ? "#9bb59f"
      : connResult?.status === "error"
        ? "#c98f8f"
        : "#8ea7c2";

  const authDotColor =
    authStatus === "authenticated"
      ? "#9bb59f"
      : authStatus === "error"
        ? "#c98f8f"
        : authStatus === "not_configured"
          ? "#71767f"
          : "#8ea7c2";

  return (
    <>
      <div
        style={{
          marginTop: 20,
          border: "1px solid #2a2f38",
          background: "#171a20",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Connexion Supabase
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: connDotColor,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 500 }}>{connLabel}</span>
        </div>
        {connResult?.message && (
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#a1a1aa" }}>
            {connResult.message}
          </p>
        )}
        {connResult?.code && (
          <p style={{ marginTop: 8, fontSize: 12, color: "#71767f" }}>Code : {connResult.code}</p>
        )}

        <button
          type="button"
          onClick={() => void runConnectionCheck()}
          disabled={connLoading}
          style={{
            marginTop: 18,
            border: "1px solid rgba(142,167,194,0.4)",
            background: "rgba(142,167,194,0.14)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            cursor: connLoading ? "default" : "pointer",
            opacity: connLoading ? 0.6 : 1,
          }}
        >
          {connLoading ? "Vérification…" : "Revérifier connexion"}
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #2a2f38",
          background: "#171a20",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Authentification — AuthProvider (V0.4.3)
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: authDotColor,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 500 }}>
            {AUTH_STATUS_LABELS[authStatus]}
          </span>
        </div>

        <dl style={{ marginTop: 14, fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>Status AuthProvider</dt>
            <dd>{authStatus}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>Auth connecté</dt>
            <dd>{authStatus === "authenticated" ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>Session présente</dt>
            <dd>{session ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>Email</dt>
            <dd>{user?.email ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>Profil détecté</dt>
            <dd>{profile ? "Oui" : "Non"}</dd>
          </div>
        </dl>

        {profileError && (
          <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: "#c98f8f" }}>
            Erreur profil : {profileError}
          </p>
        )}

        <button
          type="button"
          onClick={() => void runAuthRefresh()}
          disabled={authRefreshing}
          style={{
            marginTop: 14,
            border: "1px solid rgba(142,167,194,0.4)",
            background: "rgba(142,167,194,0.14)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            cursor: authRefreshing ? "default" : "pointer",
            opacity: authRefreshing ? 0.6 : 1,
          }}
        >
          {authRefreshing ? "Rafraîchissement…" : "Rafraîchir auth"}
        </button>

        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
          }}
        >
          Diagnostic — session Supabase directe
        </p>
        <dl style={{ marginTop: 8, fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>getCurrentSession()</dt>
            <dd>
              {directLoading
                ? "…"
                : directSession === null
                  ? "—"
                  : directSession
                    ? "Oui"
                    : "Non"}
            </dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 130 }}>getCurrentUser()</dt>
            <dd>{directLoading ? "…" : (directUserEmail ?? "—")}</dd>
          </div>
        </dl>

        <Link
          href="/auth"
          style={{
            display: "inline-block",
            marginTop: 14,
            fontSize: 14,
            color: "#8ea7c2",
            textDecoration: "none",
          }}
        >
          Ouvrir /auth →
        </Link>
        <Link
          href="/dev/sync"
          style={{
            display: "inline-block",
            marginTop: 10,
            marginLeft: 0,
            fontSize: 13,
            color: "#71767f",
            textDecoration: "none",
          }}
        >
          Dev · Sync →
        </Link>
      </div>
    </>
  );
}
