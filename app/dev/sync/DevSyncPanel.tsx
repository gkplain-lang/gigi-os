"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGigi } from "@/components/providers/GigiProvider";
import { collectLocalMissions, maskUserId } from "@/modules/supabase/sync";
import { useSupabaseSync } from "@/modules/supabase/sync/useSupabaseSync";
import { STORAGE_KEY } from "@/modules/storage/gigiStateTypes";
import type { AuthStatus } from "@/modules/supabase/types";
import type { TableSyncDetail } from "@/modules/supabase/sync/types";

const AUTH_LABELS: Record<AuthStatus, string> = {
  loading: "Chargement…",
  not_configured: "Non configuré",
  anonymous: "Anonyme",
  authenticated: "Connecté",
  error: "Erreur",
};

const TABLE_LABELS: Record<TableSyncDetail["table"], string> = {
  projects: "projects",
  missions: "missions",
  history_events: "history_events",
};

function localSourceLabel(hasRawKey: boolean | null, isHydrated: boolean): string {
  if (!isHydrated) return "…";
  if (hasRawKey) return "localStorage (gigi-os-v03-state)";
  return "État app actif (initialState / mémoire)";
}

export function DevSyncPanel() {
  const { status: authStatus, user } = useAuth();
  const { state, isHydrated } = useGigi();
  const { status: syncStatus, lastResult, lastSnapshot, error, syncNow, loadSnapshot } =
    useSupabaseSync();

  const [hasRawLocalKey, setHasRawLocalKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<"sync" | "snapshot" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasRawLocalKey(Boolean(localStorage.getItem(STORAGE_KEY)));
  }, [isHydrated]);

  const localMissionCount = isHydrated ? collectLocalMissions(state).length : 0;
  const hasLocalData =
    isHydrated &&
    (state.projects.length > 0 || localMissionCount > 0 || state.history.length > 0);

  const pendingRows = useMemo(
    () => ({
      projects: isHydrated ? state.projects.length : 0,
      missions: localMissionCount,
      history: isHydrated ? state.history.length : 0,
    }),
    [isHydrated, state.projects.length, state.history.length, localMissionCount]
  );

  const handleSync = useCallback(async () => {
    setBusy("sync");
    await syncNow(state);
    setBusy(null);
  }, [state, syncNow]);

  const handleSnapshot = useCallback(async () => {
    setBusy("snapshot");
    await loadSnapshot();
    setBusy(null);
  }, [loadSnapshot]);

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
          État local
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>État local détecté</dt>
            <dd>{isHydrated ? (hasLocalData ? "Oui" : "Non") : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Source locale</dt>
            <dd>{localSourceLabel(hasRawLocalKey, isHydrated)}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Projets locaux</dt>
            <dd>{isHydrated ? state.projects.length : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Missions locales</dt>
            <dd>{isHydrated ? localMissionCount : "…"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Historique local</dt>
            <dd>{isHydrated ? state.history.length : "…"}</dd>
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
          Auth &amp; sync (V0.4.4)
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
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>User ID</dt>
            <dd>{user?.id ? maskUserId(user.id) : "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Statut sync</dt>
            <dd>{syncStatus}</dd>
          </div>
        </dl>

        <p
          style={{
            marginTop: 14,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
          }}
        >
          Rows à envoyer
        </p>
        <dl style={{ marginTop: 8, fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>projects</dt>
            <dd>{pendingRows.projects}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>missions</dt>
            <dd>{pendingRows.missions}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>history_events</dt>
            <dd>{pendingRows.history}</dd>
          </div>
        </dl>

        {authStatus === "not_configured" && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#a1a1aa" }}>
            Supabase non configuré — l&apos;app reste en local.
          </p>
        )}

        {authStatus === "anonymous" && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#a1a1aa" }}>
            Connecte-toi pour tester la sync.{" "}
            <Link href="/auth" style={{ color: "#8ea7c2" }}>
              /auth →
            </Link>
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            onClick={() => void handleSync()}
            disabled={
              busy !== null ||
              !isHydrated ||
              authStatus !== "authenticated" ||
              syncStatus === "syncing"
            }
            style={{
              border: "1px solid rgba(142,167,194,0.4)",
              background: "rgba(142,167,194,0.14)",
              color: "#f4f4f5",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 14,
              cursor: busy ? "default" : "pointer",
              opacity: busy === "sync" ? 0.6 : 1,
            }}
          >
            {busy === "sync" ? "Sauvegarde…" : "Sauvegarder local → Supabase"}
          </button>
          <button
            type="button"
            onClick={() => void handleSnapshot()}
            disabled={
              busy !== null ||
              authStatus !== "authenticated" ||
              syncStatus === "syncing"
            }
            style={{
              border: "1px solid rgba(142,167,194,0.4)",
              background: "rgba(142,167,194,0.08)",
              color: "#f4f4f5",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 14,
              cursor: busy ? "default" : "pointer",
              opacity: busy === "snapshot" ? 0.6 : 1,
            }}
          >
            {busy === "snapshot" ? "Lecture…" : "Lire snapshot Supabase"}
          </button>
        </div>

        {lastResult?.tableDetails && lastResult.tableDetails.length > 0 && (
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6, color: "#a1a1aa" }}>
            <p style={{ fontWeight: 500, color: "#f4f4f5" }}>Détail par table</p>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              {lastResult.tableDetails.map((d) => (
                <li key={d.table} style={{ color: d.state === "success" ? "#9bb59f" : "#c98f8f" }}>
                  {TABLE_LABELS[d.table]} : {d.state}
                  {d.code ? ` (${d.code})` : ""}
                  {d.message ? ` — ${d.message}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lastResult && (
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6, color: "#a1a1aa" }}>
            <p style={{ color: lastResult.status === "success" ? "#9bb59f" : "#c98f8f" }}>
              {lastResult.message}
            </p>
            <p>
              Projets : {lastResult.syncedProjects} · Missions : {lastResult.syncedMissions} ·
              Historique : {lastResult.syncedHistoryEvents}
            </p>
            {lastResult.errors.length > 0 && (
              <ul style={{ marginTop: 8, paddingLeft: 18, color: "#c98f8f" }}>
                {lastResult.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {error && !lastResult && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#c98f8f" }}>{error}</p>
        )}

        {lastSnapshot && (
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6, color: "#a1a1aa" }}>
            <p style={{ fontWeight: 500, color: "#f4f4f5" }}>Snapshot Supabase (diagnostic)</p>
            <p>
              Projets : {lastSnapshot.projects.length} · Missions : {lastSnapshot.missions.length}{" "}
              · Historique : {lastSnapshot.historyEvents.length}
            </p>
            {lastSnapshot.lastSyncedAt && (
              <p>Dernière activité distante : {lastSnapshot.lastSyncedAt}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
