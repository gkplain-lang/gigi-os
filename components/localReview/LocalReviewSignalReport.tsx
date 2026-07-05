"use client";

import type { LocalReviewSession } from "@/modules/executionReadiness";

export function LocalReviewSignalReport({ session }: { session: LocalReviewSession }) {
  const sections = [
    { label: "Signaux succès", items: session.successSignals, color: "text-emerald-200/90" },
    { label: "Signaux attention", items: session.warningSignals, color: "text-amber-200/90" },
    { label: "Signaux erreur", items: session.errorSignals, color: "text-red-200/90" },
  ];

  const hasAny = sections.some((s) => s.items.length > 0);

  if (!hasAny) {
    return (
      <p className="text-[12.5px] text-text-muted">
        Aucun signal détecté — colle plus de contexte ou analyse à nouveau.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <div key={section.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {section.label}
              </p>
              <ul className={`mt-1.5 list-inside list-disc text-[12.5px] ${section.color}`}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )
      )}
      <p className="text-[11px] italic text-text-muted">
        Signaux détectés localement — statut probable, aucune vérification réelle.
      </p>
    </div>
  );
}
