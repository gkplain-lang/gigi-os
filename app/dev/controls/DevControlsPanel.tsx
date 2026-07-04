"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  RESTORE_CONFIRMATION_PHRASE,
  RESTORE_RISK_LABELS,
  useManualControls,
} from "@/modules/persistence/manualControls";
import type { AuthStatus } from "@/modules/supabase/types";

const AUTH_LABELS: Record<AuthStatus, string> = {
  loading: "Chargement…",
  not_configured: "Non configuré",
  anonymous: "Anonyme",
  authenticated: "Connecté",
  error: "Erreur",
};

const cardStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

const btnStyle = {
  border: "1px solid rgba(142,167,194,0.4)",
  background: "rgba(142,167,194,0.14)",
  color: "#f4f4f5",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 14,
  cursor: "pointer",
} as const;

function formatActivity(iso: string | null | undefined): string {
  if (!iso) return "—";
  return iso;
}

export function DevControlsPanel() {
  const {
    status,
    authStatus,
    user,
    localSummary,
    remoteSummary,
    restorePlan,
    lastBackupId,
    lastRestoreResult,
    error,
    backupIndex,
    latestBackup,
    isHydrated,
    remoteSnapshot,
    refreshBackupIndex,
    loadRemote,
    createBackup,
    prepareRestorePlan,
    executeRestore,
  } = useManualControls();

  const [busy, setBusy] = useState<
    "remote" | "backup" | "plan" | "restore" | null
  >(null);
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    refreshBackupIndex();
  }, [refreshBackupIndex]);

  const handleLoadRemote = useCallback(async () => {
    setBusy("remote");
    await loadRemote();
    setBusy(null);
  }, [loadRemote]);

  const handleBackup = useCallback(() => {
    setBusy("backup");
    createBackup();
    setBusy(null);
  }, [createBackup]);

  const handlePreparePlan = useCallback(() => {
    setBusy("plan");
    prepareRestorePlan();
    setBusy(null);
  }, [prepareRestorePlan]);

  const handleRestore = useCallback(() => {
    setBusy("restore");
    executeRestore(confirmationInput);
    setBusy(null);
  }, [confirmationInput, executeRestore]);

  const phraseOk = confirmationInput.trim() === RESTORE_CONFIRMATION_PHRASE;
  const canRestore =
    authStatus === "authenticated" &&
    remoteSnapshot !== null &&
    restorePlan !== null &&
    restorePlan.mappingComplete &&
    phraseOk &&
    busy === null;

  return (
    <>
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Auth &amp; statut (V0.4.6)
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
            <dt style={{ color: "#71767f", minWidth: 160 }}>Statut contrôle</dt>
            <dd>{status}</dd>
          </div>
        </dl>
      </div>

      <div style={cardStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Résumés local / Supabase
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Local</dt>
            <dd>
              {isHydrated && localSummary
                ? `${localSummary.projectsCount} proj · ${localSummary.missionsCount} miss · ${localSummary.historyEventsCount} hist`
                : "…"}
            </dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Supabase</dt>
            <dd>
              {remoteSummary
                ? `${remoteSummary.projectsCount} proj · ${remoteSummary.missionsCount} miss · ${remoteSummary.historyEventsCount} hist`
                : "— (non chargé)"}
            </dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Activité locale</dt>
            <dd>{formatActivity(localSummary?.lastActivityAt)}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Activité Supabase</dt>
            <dd>{formatActivity(remoteSummary?.lastActivityAt)}</dd>
          </div>
        </dl>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            onClick={() => void handleLoadRemote()}
            disabled={busy !== null || authStatus !== "authenticated"}
            style={{ ...btnStyle, opacity: busy === "remote" ? 0.6 : 1 }}
          >
            {busy === "remote" ? "Chargement…" : "Charger snapshot Supabase"}
          </button>
          <button
            type="button"
            onClick={handleBackup}
            disabled={busy !== null || !isHydrated}
            style={{
              ...btnStyle,
              background: "rgba(142,167,194,0.08)",
              opacity: busy === "backup" ? 0.6 : 1,
            }}
          >
            {busy === "backup" ? "Backup…" : "Créer backup local"}
          </button>
        </div>

        {lastBackupId && (
          <p style={{ marginTop: 12, fontSize: 13, color: "#9bb59f" }}>
            Dernier backup : gigi-os-v03-backup-{lastBackupId}
          </p>
        )}
      </div>

      <div style={cardStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Backups locaux
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Nombre de backups</dt>
            <dd>{backupIndex.length}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Dernier backup</dt>
            <dd>{latestBackup ? latestBackup.createdAt : "—"}</dd>
          </div>
          {latestBackup && (
            <div style={{ display: "flex", gap: 8 }}>
              <dt style={{ color: "#71767f", minWidth: 160 }}>Clé</dt>
              <dd style={{ fontSize: 12 }}>{latestBackup.backupKey}</dd>
            </div>
          )}
        </dl>
      </div>

      <div style={cardStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Plan de restauration
        </p>

        <button
          type="button"
          onClick={handlePreparePlan}
          disabled={
            busy !== null ||
            authStatus !== "authenticated" ||
            !remoteSnapshot ||
            !isHydrated
          }
          style={{ ...btnStyle, opacity: busy === "plan" ? 0.6 : 1 }}
        >
          {busy === "plan" ? "Préparation…" : "Préparer plan de restauration"}
        </button>

        {restorePlan && (
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.7, color: "#a1a1aa" }}>
            <p>
              Risque :{" "}
              <span style={{ color: "#f4f4f5" }}>
                {RESTORE_RISK_LABELS[restorePlan.riskLevel]}
              </span>
            </p>
            <p>
              Mapping : {restorePlan.mappingComplete ? "complet" : "incomplet — restore bloquée"}
            </p>
            <p style={{ marginTop: 8, fontWeight: 500, color: "#f4f4f5" }}>Preview</p>
            <ul style={{ paddingLeft: 18 }}>
              <li>
                Projets : {restorePlan.preview.projectsLocal} local →{" "}
                {restorePlan.preview.projectsRemote} Supabase
              </li>
              <li>
                Missions : {restorePlan.preview.missionsLocal} local →{" "}
                {restorePlan.preview.missionsRemote} Supabase
              </li>
              <li>
                Historique : {restorePlan.preview.historyLocal} local →{" "}
                {restorePlan.preview.historyRemote} Supabase
              </li>
            </ul>
            {restorePlan.warnings.length > 0 && (
              <ul style={{ marginTop: 10, paddingLeft: 18, color: "#c9b88f" }}>
                {restorePlan.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Restauration manuelle (confirmation requise)
        </p>

        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#a1a1aa" }}>
          Tape exactement :{" "}
          <code style={{ color: "#f4f4f5" }}>{RESTORE_CONFIRMATION_PHRASE}</code>
        </p>

        <input
          type="text"
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          placeholder={RESTORE_CONFIRMATION_PHRASE}
          disabled={!restorePlan?.mappingComplete}
          style={{
            marginTop: 12,
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #2a2f38",
            background: "#0f1115",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />

        <button
          type="button"
          onClick={handleRestore}
          disabled={!canRestore}
          style={{
            ...btnStyle,
            marginTop: 14,
            border: "1px solid rgba(201,143,143,0.5)",
            background: canRestore ? "rgba(201,143,143,0.18)" : "rgba(201,143,143,0.06)",
            opacity: busy === "restore" ? 0.6 : 1,
            cursor: canRestore ? "pointer" : "default",
          }}
        >
          {busy === "restore" ? "Restauration…" : "Restaurer depuis Supabase → localStorage"}
        </button>

        {!phraseOk && confirmationInput.length > 0 && (
          <p style={{ marginTop: 10, fontSize: 13, color: "#c9b88f" }}>
            Phrase incorrecte — le bouton reste désactivé.
          </p>
        )}

        {lastRestoreResult && (
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6 }}>
            <p
              style={{
                color: lastRestoreResult.status === "success" ? "#9bb59f" : "#c98f8f",
              }}
            >
              {lastRestoreResult.message}
            </p>
            {lastRestoreResult.backupKey && (
              <p style={{ color: "#a1a1aa" }}>
                Backup créé : {lastRestoreResult.backupKey}
              </p>
            )}
            {lastRestoreResult.status === "success" && (
              <p style={{ marginTop: 8, color: "#c9b88f" }}>
                Après restauration, recharge l&apos;app pour appliquer l&apos;état restauré.
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p style={{ marginTop: 12, fontSize: 13, color: "#c98f8f" }}>{error}</p>
      )}

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/persistence" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Persistence →
        </Link>
        <Link href="/dev/sync" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Sync →
        </Link>
        <Link href="/dev/supabase" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Supabase →
        </Link>
      </div>
    </>
  );
}
