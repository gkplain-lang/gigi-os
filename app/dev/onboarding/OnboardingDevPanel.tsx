"use client";

import { useGigi } from "@/components/providers/GigiProvider";
import {
  ONBOARDING_GUARDRAILS,
  ONBOARDING_STEPS,
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

export function OnboardingDevPanel() {
  const { state, resetOnboarding } = useGigi();
  const summary = summarizeOnboarding(state);

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
          Reset local onboarding
        </p>
        <p style={{ fontSize: 13, color: "#71767f", lineHeight: 1.6, marginBottom: 12 }}>
          Remet l&apos;onboarding à zéro dans {STORAGE_KEY}. Ne touche pas aux autres clés
          localStorage.
        </p>
        <button
          type="button"
          onClick={resetOnboarding}
          style={{
            fontSize: 13,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #3a3f48",
            background: "#1f2329",
            color: "#d4a574",
            cursor: "pointer",
          }}
        >
          Reset onboarding (local)
        </button>
      </div>
    </>
  );
}
