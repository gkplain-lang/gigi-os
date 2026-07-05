"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectCommandCard } from "@/modules/projectsCommand";

interface ProjectsPriorityCardProps {
  card: ProjectCommandCard;
}

export function ProjectsPriorityCard({ card }: ProjectsPriorityCardProps) {
  return (
    <section className="gigi-panel-raised mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Projet prioritaire
      </p>
      <h3 className="mt-2 text-[18px] font-semibold text-text-primary">{card.projectName}</h3>
      {card.isMissionProjectToday && (
        <span className="mt-2 inline-flex rounded-full border border-indigo-400/40 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-100">
          Mission du jour
        </span>
      )}
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{card.summary}</p>
      {card.nextMissionTitle && (
        <p className="mt-3 text-[13px] text-text-primary">
          <span className="font-medium text-accent-soft">Mission possible · </span>
          {card.nextMissionTitle}
        </p>
      )}
      {card.nextMissionReason && (
        <p className="mt-1 text-[12px] text-text-muted">{card.nextMissionReason}</p>
      )}
      {card.activeActionTitle && (
        <p className="mt-2 text-[12.5px] text-text-secondary">
          <span className="font-medium">Action en cours · </span>
          {card.activeActionTitle}
        </p>
      )}
      {card.blockerLabel && (
        <p className="mt-2 text-[12px] text-amber-200/90">Blocage : {card.blockerLabel}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={card.primaryCtaRoute}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
        >
          {card.primaryCtaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {card.secondaryCtaLabel && card.secondaryCtaRoute && (
          <Link
            href={card.secondaryCtaRoute}
            className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-4 py-2.5 text-[13px] font-medium"
          >
            {card.secondaryCtaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
