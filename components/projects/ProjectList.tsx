"use client";

import type { Project, ProjectStatus } from "@/modules/projects/projectTypes";
import { PROJECT_CONTEXT_LABELS } from "@/data/projectLabels";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  missionProjectId?: string;
  missionTitle?: string;
  missionStatusLabel?: string;
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Actif",
  paused: "En pause",
  postponed: "Reporté",
  future: "Futur",
  completed: "Terminé",
  archived: "Archivé",
};

const PRIORITY_LABEL: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

export function ProjectList({
  projects,
  missionProjectId,
  missionTitle,
  missionStatusLabel,
}: ProjectListProps) {
  const active = projects.find((p) => p.id === (missionProjectId ?? "buildy-clear"));
  const others = projects.filter((p) => p.id !== active?.id);

  return (
    <div className="animate-fade-in space-y-8">
      {active && (
        <section>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-text-muted">
            Projet actif
          </p>
          <div className="gigi-panel rounded-xl p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[1.2rem] font-semibold text-text-primary">{active.name}</h2>
                <StatusPill label={missionStatusLabel ?? "Priorité active"} variant="warm" />
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {active.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface-2 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                    Mission liée
                  </p>
                  <p className="mt-1.5 text-[14px] text-text-primary">
                    {missionProjectId === active.id && missionTitle
                      ? missionTitle
                      : active.nextAction}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-2 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                    Prochaine action
                  </p>
                  <p className="mt-1.5 text-[14px] text-text-secondary">{active.nextAction}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <span className="text-[13px] text-text-muted">Progression</span>
                <ProgressBar value={active.progress} className="flex-1" />
                <span className="text-[13px] tabular-nums text-text-secondary">
                  {active.progress}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-text-muted">
            Portefeuille
          </p>
          <div className="gigi-panel overflow-hidden rounded-xl">
            {others.map((project, i) => {
              const dimmed = project.status !== "active";
              return (
                <div
                  key={project.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4",
                    i > 0 && "border-t border-white/[0.05]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-[15px] font-medium",
                          dimmed ? "text-text-secondary" : "text-text-primary"
                        )}
                      >
                        {project.name}
                      </span>
                      <StatusPill
                        label={STATUS_LABEL[project.status]}
                        variant={project.status === "active" ? "warm" : "muted"}
                      />
                    </div>
                    <p className="mt-1 truncate text-[13px] text-text-muted">
                      {PROJECT_CONTEXT_LABELS[project.id] ?? project.description}
                    </p>
                  </div>

                  <span className="hidden w-20 shrink-0 text-[12px] text-text-muted sm:block">
                    {PRIORITY_LABEL[project.priority]}
                  </span>

                  <div className="hidden w-28 shrink-0 items-center gap-2 md:flex">
                    <ProgressBar value={project.progress} muted={dimmed} className="flex-1" />
                    <span className="w-8 text-right text-[12px] tabular-nums text-text-muted">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
