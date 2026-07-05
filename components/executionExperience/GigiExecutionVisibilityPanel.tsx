"use client";

import Link from "next/link";
import {
  EXECUTION_CAPABILITY_CARDS,
  EXECUTION_EXPERIENCE_V45_DISCLAIMER,
} from "@/modules/executionExperience/executionExperienceConstants";
import { cn } from "@/lib/utils";

export function GigiExecutionVisibilityPanel({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "gigi-panel-raised rounded-xl border border-violet-500/30 p-5 md:p-6",
        className
      )}
      aria-label="Ce que Gigi peut préparer"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
        V4.5 · Exécution contrôlée visible
      </p>
      <h2 className="mt-2 text-[17px] font-semibold text-text-primary">
        Ce que Gigi peut préparer maintenant
      </h2>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
        Gigi ne lance rien toute seule. Elle prépare, structure et t&apos;aide à contrôler chaque
        étape — validation humaine obligatoire, aucune exécution réelle.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXECUTION_CAPABILITY_CARDS.map((card) => (
          <div
            key={card.id}
            className="rounded-lg border border-border/40 bg-surface-2/10 p-4 transition-colors hover:border-violet-500/30"
          >
            <p className="text-[13px] font-medium text-text-primary">{card.title}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">
              {card.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {card.badges.map((b) => (
                <span
                  key={b}
                  className="rounded border border-border/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted"
                >
                  {b}
                </span>
              ))}
            </div>
            <Link
              href={card.href}
              className="gigi-btn-secondary gigi-focus mt-3 inline-flex rounded-lg px-3 py-1.5 text-[12px] font-medium"
            >
              {card.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11.5px] italic text-amber-200/85">{EXECUTION_EXPERIENCE_V45_DISCLAIMER}</p>
    </section>
  );
}
