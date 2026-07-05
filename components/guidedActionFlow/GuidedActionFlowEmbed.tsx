"use client";

import Link from "next/link";
import { useMemo } from "react";
import { listActiveGuidedFlows } from "@/modules/executionExperience/guidedActionBuilder";
import { generateGuidedActionSummary } from "@/modules/executionExperience/guidedActionSummary";
import { useIsClient } from "@/components/settings/useIsClient";
import { GuidedActionFlowMiniStepper } from "./GuidedActionFlowStepper";
import { GuidedActionStatusBadge } from "./GuidedActionStatusBadge";

export function GuidedActionFlowEmbed({ className }: { className?: string }) {
  const isClient = useIsClient();

  const { summary, active } = useMemo(() => {
    if (!isClient) return { summary: null, active: [] };
    return {
      summary: generateGuidedActionSummary(),
      active: listActiveGuidedFlows(3),
    };
  }, [isClient]);

  if (!isClient || !summary) return null;

  return (
    <section
      className={`gigi-panel-raised mb-6 rounded-xl border border-indigo-500/25 p-5 ${className ?? ""}`}
      aria-label="Parcours guidés actifs"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200/90">
        Parcours guidé · V4.6
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Relie mission, permission, pont, pack et revue — parcours structuré, aucune exécution
        réelle.
      </p>
      <p className="mt-1 text-[12px] text-text-muted">{summary.summaryText}</p>

      {active.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {active.map((flow) => (
            <li
              key={flow.id}
              className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-text-primary">{flow.title}</span>
                <GuidedActionStatusBadge status={flow.status} />
              </div>
              <GuidedActionFlowMiniStepper flow={flow} />
              <Link
                href={`/guided-actions?flow=${flow.id}`}
                className="gigi-focus mt-2 inline-flex text-[12px] font-medium text-accent-soft hover:underline"
              >
                Continuer →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucun parcours actif — crée-en un depuis un modèle.
        </p>
      )}

      <Link
        href="/guided-actions"
        className="gigi-btn-secondary gigi-focus mt-4 inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
      >
        Ouvrir Actions guidées
      </Link>
    </section>
  );
}
