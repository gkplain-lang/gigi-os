"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  PERSISTENCE_MODE_LABELS,
  RECOMMENDATION_LABELS,
  usePersistenceDiagnostic,
} from "@/modules/persistence";
import type { AuthStatus } from "@/modules/supabase/types";
import type { ConflictType } from "@/modules/persistence";

const AUTH_LABELS: Record<AuthStatus, string> = {
  loading: "Chargement…",
  not_configured: "Non configuré",
  anonymous: "Anonyme",
  authenticated: "Connecté",
  error: "Erreur",
};

const CONFLICT_LABELS: Record<ConflictType, string> = {
  local_newer: "Local plus récent",
  remote_newer: "Supabase plus récent",
  both_have_data: "Données des deux côtés",
  remote_empty_local_exists: "Local présent, Supabase vide",
  local_empty_remote_exists: "Supabase présent, local vide",
  unknown: "Impossible à déterminer",
};

function formatActivity(iso: string | null | undefined): string {
  if (!iso) return "—";
  return iso;
}

export function DevPersistencePanel() {
  const { status: authStatus, user } = useAuth();
  const {
    diagnostic,
    localSummary,
    remoteSummary,
    refreshRemoteSnapshot,
    loading,
    error,
    isHydrated,
    remoteSnapshotLoaded,
  } = usePersistenceDiagnostic();

  const [busy, setBusy] = useState(false);

  const handleLoadRemote = useCallback(async () => {
    setBusy(true);
    await refreshRemoteSnapshot();
    setBusy(false);
  }, [refreshRemoteSnapshot]);

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
          Diagnostic persistance (V0.4.5)
        </p>

        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Auth</dt>
            <dd>{AUTH_LABELS[authStatus]}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Email</dt>
            <dd>{user?.email ?? "—"}</dd>
          </div>
          {diagnostic && (
            <>
              <div style={{ display: "flex", gap: 8 }}>
                <dt style={{ color: "#71767f", minWidth: 160 }}>Mode</dt>
                <dd>{PERSISTENCE_MODE_LABELS[diagnostic.mode]}</dd>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <dt style={{ color: "#71767f", minWidth: 160 }}>Recommandation</dt>
                <dd>{RECOMMENDATION_LABELS[diagnostic.recommendation]}</dd>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <dt style={{ color: "#71767f", minWidth: 160 }}>Conflit détecté</dt>
                <dd>{diagnostic.hasConflict ? "Oui" : "Non"}</dd>
              </div>
              {diagnostic.conflictType && (
                <div style={{ display: "flex", gap: 8 }}>
                  <dt style={{ color: "#71767f", minWidth: 160 }}>Type de conflit</dt>
                  <dd>{CONFLICT_LABELS[diagnostic.conflictType]}</dd>
                </div>
              )}
            </>
          )}
        </dl>

        {diagnostic && (
          <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: "#a1a1aa" }}>
            {diagnostic.message}
          </p>
        )}

        {diagnostic && diagnostic.warnings.length > 0 && (
          <ul
            style={{
              marginTop: 12,
              paddingLeft: 18,
              fontSize: 13,
              lineHeight: 1.6,
              color: "#c9b88f",
            }}
          >
            {diagnostic.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        {error && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#c98f8f" }}>{error}</p>
        )}
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
          Résumé local
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Projets</dt>
            <dd>{isHydrated && localSummary ? localSummary.projectsCount : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Missions</dt>
            <dd>{isHydrated && localSummary ? localSummary.missionsCount : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Historique</dt>
            <dd>{isHydrated && localSummary ? localSummary.historyEventsCount : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Dernière activité</dt>
            <dd>{formatActivity(localSummary?.lastActivityAt)}</dd>
          </div>
        </dl>
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
          Résumé Supabase
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Snapshot chargé</dt>
            <dd>{remoteSnapshotLoaded ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Projets</dt>
            <dd>{remoteSummary ? remoteSummary.projectsCount : "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Missions</dt>
            <dd>{remoteSummary ? remoteSummary.missionsCount : "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Historique</dt>
            <dd>{remoteSummary ? remoteSummary.historyEventsCount : "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Dernière activité</dt>
            <dd>{formatActivity(remoteSummary?.lastActivityAt)}</dd>
          </div>
        </dl>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            onClick={() => void handleLoadRemote()}
            disabled={busy || loading || authStatus !== "authenticated"}
            style={{
              border: "1px solid rgba(142,167,194,0.4)",
              background: "rgba(142,167,194,0.14)",
              color: "#f4f4f5",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 14,
              cursor: busy || loading ? "default" : "pointer",
              opacity: busy || loading ? 0.6 : 1,
            }}
          >
            {busy || loading ? "Chargement…" : "Charger snapshot Supabase"}
          </button>
        </div>

        {authStatus === "anonymous" && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#a1a1aa" }}>
            Connecte-toi pour charger le snapshot Supabase.{" "}
            <Link href="/auth" style={{ color: "#8ea7c2" }}>
              /auth →
            </Link>
          </p>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link
          href="/dev/sync"
          style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}
        >
          Dev · Sync →
        </Link>
        <Link
          href="/dev/supabase"
          style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}
        >
          Dev · Supabase →
        </Link>
        <Link
          href="/dev/controls"
          style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}
        >
          Dev · Controls →
        </Link>
      </div>
    </>
  );
}
