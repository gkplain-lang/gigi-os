"use client";

import type { ProjectsCommandViewModel } from "@/modules/projectsCommand";
import { formatProjectsCommandSummary } from "@/modules/projectsCommand";

interface ProjectsCommandCenterProps {
  viewModel: ProjectsCommandViewModel;
}

export function ProjectsCommandCenter({ viewModel }: ProjectsCommandCenterProps) {
  return (
    <section className="gigi-panel-raised mb-6 overflow-hidden rounded-2xl border border-indigo-500/30">
      <div className="border-b border-indigo-500/20 bg-indigo-500/10 px-5 py-4 md:px-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200/90">
          Centre projets · Gigi V3.6
        </p>
        <h2 className="mt-1 font-display text-[22px] font-bold tracking-tight text-text-primary">
          Centre projets
        </h2>
        <p className="mt-1 text-[14px] text-text-secondary">
          Tous tes projets, une prochaine mission claire.
        </p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5 md:p-6">
        <Stat label="Actifs" value={viewModel.activeProjects} />
        <Stat label="Avec action" value={viewModel.projectsWithActions} />
        <Stat label="Missions possibles" value={viewModel.projectsWithNextMission} />
        <Stat label="Bloqués" value={viewModel.blockedProjects} />
        <Stat label="Total" value={viewModel.totalProjects} />
      </div>
      <p className="border-t border-border/40 px-5 py-3 text-[12px] text-text-muted md:px-6">
        {formatProjectsCommandSummary(viewModel)}
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-2/20 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 text-[20px] font-bold tabular-nums text-text-primary">{value}</p>
    </div>
  );
}
