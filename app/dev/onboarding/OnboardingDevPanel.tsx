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

const panelClass = "gigi-dev-panel";

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

  const rows: { label: string; value: string }[] = [
    { label: "Version", value: summary.version },
    { label: "Phase", value: summary.phase },
    { label: "Onboarding terminé", value: summary.isComplete ? "Oui" : "Non" },
    { label: "Étape courante", value: summary.currentStep },
    { label: "Étapes complétées", value: summary.completedSteps.join(", ") || "—" },
    { label: "Projets locaux", value: String(summary.projectCount) },
    { label: "Objectif", value: summary.goalLabel },
    { label: "Style mission", value: summary.styleLabel },
    { label: "Première mission générée", value: summary.firstMissionGenerated ? "Oui" : "Non" },
    { label: "Clé localStorage", value: STORAGE_KEY },
  ];

  return (
    <>
      <div className={panelClass}>
        <p className="gigi-dev-label mb-3">Statut V1.4 Onboarding</p>
        <dl className="space-y-1 text-[13px] leading-relaxed text-text-secondary">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-2">
              <dt className="min-w-[180px] text-text-muted">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={panelClass}>
        <p className="gigi-dev-label mb-3">Étapes ({ONBOARDING_STEPS.length})</p>
        <ol className="list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-text-secondary">
          {ONBOARDING_STEPS.map((s) => (
            <li key={s.id}>
              {s.order}. {s.title} — {s.subtitle}
            </li>
          ))}
        </ol>
      </div>

      <div className={panelClass}>
        <p className="gigi-dev-label mb-3">Garde-fous</p>
        <ul className="list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-text-secondary">
          {ONBOARDING_GUARDRAILS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={panelClass}>
        <p className="gigi-dev-label mb-3">Restaurer les projets de départ</p>
        <p className="text-[13px] leading-relaxed text-ok">{STARTER_PROJECTS_RESTORE_HINT}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
          Crée un backup local automatique avant d&apos;ajouter les projets mocks manquants depuis{" "}
          <code className="text-accent-soft">data/mockProjects.ts</code>. Ne touche pas au cloud.
        </p>
        <button
          type="button"
          onClick={handleRestoreStarter}
          className="gigi-dev-btn gigi-dev-btn-safe mt-3"
        >
          Restaurer les projets de départ
        </button>
      </div>

      <div className={panelClass}>
        <p className="gigi-dev-label mb-3">Reset onboarding (safe)</p>
        <p className="text-[13px] leading-relaxed text-text-secondary">{ONBOARDING_RESET_HINT}</p>
        <button
          type="button"
          onClick={() => {
            resetOnboarding();
            setActionMessage("Onboarding remis à zéro — projets et historique conservés.");
          }}
          className="gigi-dev-btn gigi-dev-btn-warn mt-3"
        >
          Reset onboarding (local)
        </button>
      </div>

      {actionMessage && (
        <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">{actionMessage}</p>
      )}
    </>
  );
}
