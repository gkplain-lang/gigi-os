"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProjectCommandCard } from "@/modules/projectsCommand";
import { cn } from "@/lib/utils";

interface ProjectCommandCardViewProps {
  card: ProjectCommandCard;
  className?: string;
}

export function ProjectCommandCardView({ card, className }: ProjectCommandCardViewProps) {
  return (
    <article
      className={cn(
        "gigi-project-card rounded-xl border border-border/60 p-4 transition-transform hover:translate-y-[-1px]",
        card.isMissionProjectToday && "border-indigo-500/30 bg-indigo-500/[0.04]",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link href={card.primaryCtaRoute} className="gigi-focus">
            <h3 className="text-[15px] font-semibold text-text-primary">{card.projectName}</h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] text-text-muted">{card.summary}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border/50 px-2 py-0.5 text-[10px] font-medium text-text-muted">
          {card.statusLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{card.priorityLabel}</Badge>
        {card.isMissionProjectToday && <Badge accent>Mission du jour</Badge>}
        {card.activeActionTitle && <Badge accent>Action en cours</Badge>}
      </div>

      {card.nextMissionTitle && (
        <p className="mt-3 text-[12.5px] text-text-secondary">
          <span className="font-medium text-text-primary">Mission possible · </span>
          {card.nextMissionTitle}
        </p>
      )}

      {card.activeActionTitle && (
        <p className="mt-1 text-[12px] text-text-muted">Action · {card.activeActionTitle}</p>
      )}

      {card.learningSummary && (
        <p className="mt-2 line-clamp-2 text-[11.5px] italic text-emerald-200/80">
          Apprentissage · {card.learningSummary}
        </p>
      )}

      {card.blockerLabel && (
        <p className="mt-2 text-[11.5px] text-amber-200/90">À débloquer · {card.blockerLabel}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={card.primaryCtaRoute}
          className="gigi-focus text-[12.5px] font-medium text-accent-soft hover:underline"
        >
          Ouvrir
        </Link>
        {card.secondaryCtaRoute && card.secondaryCtaLabel && (
          <Link
            href={card.secondaryCtaRoute}
            className="gigi-focus text-[12.5px] text-text-muted hover:text-text-secondary"
          >
            {card.secondaryCtaLabel}
          </Link>
        )}
        <span className="ml-auto flex items-center gap-0.5 text-[11px] text-text-muted">
          Score {card.score}
          <ChevronRight className="h-3 w-3" aria-hidden />
        </span>
      </div>
    </article>
  );
}

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-md border px-1.5 py-0.5 text-[10px]",
        accent
          ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-100"
          : "border-border/50 text-text-muted"
      )}
    >
      {children}
    </span>
  );
}
