"use client";

import { useState } from "react";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  ONBOARDING_GUARDRAILS,
  ONBOARDING_RESET_HINT,
  ONBOARDING_STEPS,
  STARTER_PROJECTS_RESTORE_HINT,
  summarizeOnboarding,
} from "@/modules/onboarding";
import { STORAGE_KEY } from "@/modules/storage/gigiStateTypes";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

const btnStyle = {
  fontSize: 13,
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #3a3f48",
  background: "#1f2329",
  cursor: "pointer",
} as const;

export function OnboardingDevPanel() {
  const { state, resetOnboarding, restoreStarterProjects } = useGigi();
  const summary = summarizeOnboarding(state);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleRestoreStarter = () => {
    const result = restoreStarterProjects();
    if (!result.ok) {
      setActionMessage(result.error ?? "Restauration annulée.");
      return;
    }
    if (result.addedCount === 0) {
      setActionMessage("Tous les projets de départ sont déjà présents — aucun doublon ajouté.");
      return;
    }
    setActionMessage(
      `${result.addedCount} projet(s) de départ ajouté(s). Backup créé (${result.backupKey}).`
    );
  };

  return (
    <>
      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Statut V1.4 Onboarding
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Version</dt>
            <dd>{summary.version}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Phase</dt>
            <dd>{summary.phase}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Onboarding terminé</dt>
            <dd>{summary.isComplete ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Étape courante</dt>
            <dd>{summary.currentStep}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Étapes complétées</dt>
            <dd>{summary.completedSteps.join(", ") || "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Projets locaux</dt>
            <dd>{summary.projectCount}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Objectif</dt>
            <dd>{summary.goalLabel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Style mission</dt>
            <dd>{summary.styleLabel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Première mission générée</dt>
            <dd>{summary.firstMissionGenerated ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Clé localStorage</dt>
            <dd>{STORAGE_KEY}</dd>
          </div>
        </dl>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Étapes ({ONBOARDING_STEPS.length})
        </p>
        <ol style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.8, paddingLeft: 18 }}>
          {ONBOARDING_STEPS.map((s) => (
            <li key={s.id}>
              {s.order}. {s.title} — {s.subtitle}
            </li>
          ))}
        </ol>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Garde-fous
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {ONBOARDING_GUARDRAILS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Restaurer les projets de départ
        </p>
        <p style={{ fontSize: 13, color: "#9bb59f", lineHeight: 1.6, marginBottom: 8 }}>
          {STARTER_PROJECTS_RESTORE_HINT}
        </p>
        <p style={{ fontSize: 12, color: "#71767f", lineHeight: 1.6, marginBottom: 12 }}>
          Crée un backup local automatique avant d&apos;ajouter les projets mocks manquants depuis{" "}
          <code style={{ color: "#a1a1aa" }}>data/mockProjects.ts</code>. Ne touche pas au cloud.
        </p>
        <button
          type="button"
          onClick={handleRestoreStarter}
          style={{ ...btnStyle, color: "#9bb59f", borderColor: "rgba(155,181,159,0.35)" }}
        >
          Restaurer les projets de départ
        </button>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Reset onboarding (safe)
        </p>
        <p style={{ fontSize: 13, color: "#71767f", lineHeight: 1.6, marginBottom: 12 }}>
          {ONBOARDING_RESET_HINT}
        </p>
        <button
          type="button"
          onClick={() => {
            resetOnboarding();
            setActionMessage("Onboarding remis à zéro — projets et historique conservés.");
          }}
          style={{ ...btnStyle, color: "#d4a574" }}
        >
          Reset onboarding (local)
        </button>
      </div>

      {actionMessage && (
        <p style={{ marginTop: 12, fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>
          {actionMessage}
        </p>
      )}
    </>
  );
}
