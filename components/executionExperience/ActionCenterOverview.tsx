"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getExecutionCenterOverviewData } from "@/modules/executionExperience/executionExperienceSummary";
import { EXECUTION_EXPERIENCE_V45_DISCLAIMER } from "@/modules/executionExperience/executionExperienceConstants";
import { useIsClient } from "@/components/settings/useIsClient";

interface OverviewCard {
  title: string;
  count: number;
  sublabel: string;
  href: string;
  cta: string;
  emptyHint: string;
}

export function ActionCenterOverview() {
  const isClient = useIsClient();

  const data = useMemo(() => {
    if (!isClient) return null;
    return getExecutionCenterOverviewData();
  }, [isClient]);

  if (!isClient || !data) return null;

  const cards: OverviewCard[] = [
    {
      title: "Demandes locales",
      count: data.requestsTotal,
      sublabel: `${data.requestsActive} active(s)`,
      href: "/actions",
      cta: "Voir Actions",
      emptyHint: "Prépare une demande depuis le flux d'action.",
    },
    {
      title: "Permissions",
      count: data.permissionsTotal,
      sublabel: `${data.permissionsAwaiting} en attente`,
      href: "/permissions",
      cta: "Voir Permissions",
      emptyHint: "Crée une demande sur /actions d'abord.",
    },
    {
      title: "Pont manuel",
      count: data.bridgeTotal,
      sublabel: `${data.bridgeReady} prêt(s) à relire`,
      href: "/manual-bridge",
      cta: "Pont manuel",
      emptyHint: "Transforme une permission en paquet manuel.",
    },
    {
      title: "Packs commandes",
      count: data.packsTotal,
      sublabel: `${data.packsReady} prêt(s) à relire`,
      href: "/command-packs",
      cta: "Packs commandes",
      emptyHint: "Prépare un pack depuis un modèle ou un pont manuel.",
    },
    {
      title: "Revues locales",
      count: data.reviewsTotal,
      sublabel: `${data.reviewsAwaiting} en attente`,
      href: "/local-review",
      cta: "Revue locale",
      emptyHint: "Colle un résultat obtenu manuellement hors Gigi.",
    },
  ];

  return (
    <section className="gigi-panel-raised mb-6 rounded-xl border border-violet-500/30 p-5 md:p-6">
      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
        Centre d&apos;action Gigi · V4.5
      </p>
      <h2 className="mt-1 text-[16px] font-semibold text-text-primary">Centre d&apos;action Gigi</h2>
      <p className="mt-2 max-w-2xl text-[13px] text-text-secondary">
        Un tableau de bord pour préparer, contrôler, copier et analyser — sans exécution
        automatique. Aucun connecteur actif.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border/40 bg-surface-2/10 p-3.5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {card.title}
            </p>
            <p className="mt-1 text-[22px] font-semibold tabular-nums text-text-primary">
              {card.count}
            </p>
            <p className="text-[11px] text-text-muted">{card.sublabel}</p>
            {card.count === 0 ? (
              <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{card.emptyHint}</p>
            ) : null}
            <Link
              href={card.href}
              className="gigi-focus mt-2 inline-flex text-[12px] font-medium text-accent-soft hover:underline"
            >
              {card.cta} →
            </Link>
          </div>
        ))}
      </div>

      {!data.hasAnyActivity && (
        <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-[12.5px] text-text-secondary">
          Rien ici pour l&apos;instant. Commence par préparer une action sur /actions, puis
          explore permissions, pont manuel, packs et revue locale.
        </p>
      )}

      <p className="mt-3 text-[11px] italic text-amber-200/85">{EXECUTION_EXPERIENCE_V45_DISCLAIMER}</p>
    </section>
  );
}
