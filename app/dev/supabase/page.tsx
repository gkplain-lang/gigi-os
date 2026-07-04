"use client";

import { useEffect, useState } from "react";
import {
  checkSupabaseConnection,
  type SupabaseHealthResult,
} from "@/modules/supabase/health";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevSupabasePage() {
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

  const label =
    result?.status === "connected"
      ? result.rlsLikely
        ? "Connecté (accès données limité par RLS)"
        : "Connecté"
      : result?.status === "not_configured"
        ? "Non configuré"
        : result?.status === "error"
          ? "Erreur / accès bloqué"
          : "Vérification…";

  const dotColor =
    result?.status === "connected"
      ? "#9bb59f"
      : result?.status === "error"
        ? "#c98f8f"
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
          Vérification de connexion Supabase
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: dotColor,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 500 }}>{label}</span>
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
            {loading ? "Vérification…" : "Revérifier"}
          </button>
        </div>

        <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          Cette page sert uniquement à vérifier la connexion Supabase. Gigi OS utilise encore
          localStorage en V0.4.2.
        </p>
      </div>
    </main>
  );
}
