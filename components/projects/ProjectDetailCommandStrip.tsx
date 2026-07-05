"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectCommandCard } from "@/modules/projectsCommand";

interface ProjectDetailCommandStripProps {
  card: ProjectCommandCard;
}

export function ProjectDetailCommandStrip({ card }: ProjectDetailCommandStripProps) {
  return (
    <section className="gigi-panel-raised mb-6 rounded-xl border border-indigo-500/25 p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
        Commande projet · V3.6
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-text-muted">
            {card.statusLabel} · {card.priorityLabel}
          </p>
          {card.nextMissionTitle && (
            <p className="mt-2 text-[16px] font-semibold text-text-primary">
              {card.nextMissionTitle}
            </p>
          )}
          {card.nextMissionReason && (
            <p className="mt-1 text-[13px] text-text-secondary">{card.nextMissionReason}</p>
          )}
          {card.blockerLabel && (
            <p className="mt-2 text-[12.5px] text-amber-200/90">Blocage · {card.blockerLabel}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {card.nextMissionTitle && (
            <Link
              href={`/projects/${card.projectId}#missions`}
              className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
            >
              Préparer cette mission
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          {card.activeActionTitle && card.activeActionRoute && (
            <Link
              href={card.activeActionRoute}
              className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-4 py-2.5 text-[13px] font-medium"
            >
              Voir l&apos;action
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
