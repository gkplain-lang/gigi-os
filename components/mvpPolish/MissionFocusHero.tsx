"use client";

import type { ReactNode } from "react";

interface MissionFocusHeroProps {
  meta?: string;
  right?: ReactNode;
  className?: string;
}

export function MissionFocusHero({ meta, right, className }: MissionFocusHeroProps) {
  return (
    <section
      className={`mb-6 overflow-hidden rounded-2xl border border-[rgba(124,140,255,0.28)] bg-[rgba(124,140,255,0.06)] p-6 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
            Cockpit mission-first · V5.0
          </p>
          <h1 className="mt-1 text-[22px] font-bold tracking-tight text-text-primary md:text-[26px]">
            Aegis pilote ton focus du jour.
          </h1>
          <p className="mt-1.5 max-w-xl text-[13.5px] text-text-secondary">
            Une mission prioritaire, une prochaine action, une décision claire —{" "}
            <span className="text-text-primary">Gigi prépare, tu valides</span>. Aucune exécution
            réelle.
          </p>
          {meta && <p className="mt-2 text-[12.5px] text-text-muted">{meta}</p>}
        </div>
        {right}
      </div>
    </section>
  );
}
