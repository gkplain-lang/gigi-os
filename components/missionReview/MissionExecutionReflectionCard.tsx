"use client";

import type { MissionExecutionReflection } from "@/modules/missionReview";

interface MissionExecutionReflectionCardProps {
  reflection: MissionExecutionReflection;
}

export function MissionExecutionReflectionCard({ reflection }: MissionExecutionReflectionCardProps) {
  return (
    <article className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Réflexion d&apos;exécution · local
      </p>
      <h3 className="mt-1 text-[14px] font-semibold text-text-primary">{reflection.title}</h3>
      <p className="mt-2 text-[12.5px] text-text-secondary">{reflection.summary}</p>
      <dl className="mt-3 space-y-2 text-[12px]">
        <div>
          <dt className="text-text-muted">Signal</dt>
          <dd className="text-text-primary">{reflection.signal}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Recommandation</dt>
          <dd className="font-medium text-accent-soft">{reflection.recommendation}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Raison</dt>
          <dd className="text-text-secondary">{reflection.reason}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] italic text-text-muted">
        Réflexion rule-based locale — aucun jugement automatique réel.
      </p>
    </article>
  );
}
