"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  checkSupabaseConnection,
  type SupabaseHealthResult,
} from "@/modules/supabase/health";
import type { AuthStatus } from "@/modules/supabase/types";

const IS_PROD = process.env.NODE_ENV === "production";

const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  loading: "Chargement…",
  not_configured: "Non configuré",
  anonymous: "Anonyme",
  authenticated: "Connecté",
  error: "Erreur",
};

export default function DevSupabasePage() {
  const { status: authStatus, user, profile } = useAuth();
  const [result, setResult] = useState<SupabaseHealthResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const r = await checkSupabaseConnection();
    setResult(r);
    setLoading(false);
  };

  useEffect(() => {
    if (!IS_PROD) run();
  }, []);

  if (IS_PROD) {
    return (
      <div style={{ padding: "2rem", color: "#a1a1aa", fontFamily: "system-ui" }}>
        Page de développement indisponible en production.
      </div>
    );
  }

  const connLabel =
    result?.status === "connected"
      ? result.rlsLikely
        ? "Connecté (accès données limité par RLS)"
        : "Connecté"
      : result?.status === "not_configured"
        ? "Non configuré"
        : result?.status === "error"
          ? "Erreur / accès bloqué"
          : "Vérification…";

  const connDotColor =
    result?.status === "connected"
      ? "#9bb59f"
      : result?.status === "error"
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
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1115",
        color: "#f4f4f5",
        fontFamily: "system-ui, sans-serif",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#71767f" }}>
          Dev · Supabase
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
          Vérification Supabase &amp; Auth
        </h1>

        <div
          style={{
            marginTop: 20,
            border: "1px solid #2a2f38",
            background: "#171a20",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#71767f", marginBottom: 12 }}>
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
          {result?.message && (
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#a1a1aa" }}>
              {result.message}
            </p>
          )}
          {result?.code && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#71767f" }}>Code : {result.code}</p>
          )}

          <button
            type="button"
            onClick={run}
            disabled={loading}
            style={{
              marginTop: 18,
              border: "1px solid rgba(142,167,194,0.4)",
              background: "rgba(142,167,194,0.14)",
              color: "#f4f4f5",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 14,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Vérification…" : "Revérifier connexion"}
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
          <p style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#71767f", marginBottom: 12 }}>
            Authentification (V0.4.3)
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
              <dt style={{ color: "#71767f", minWidth: 110 }}>Email</dt>
              <dd>{user?.email ?? "—"}</dd>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <dt style={{ color: "#71767f", minWidth: 110 }}>Profil</dt>
              <dd>{profile ? "Oui" : "Non"}</dd>
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
        </div>

        <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          V0.4.3 ajoute l&apos;auth, mais Gigi OS utilise encore localStorage comme source principale
          (<code style={{ color: "#a1a1aa" }}>gigi-os-v03-state</code>).
        </p>
      </div>
    </main>
  );
}
