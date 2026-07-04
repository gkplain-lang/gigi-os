import type { Project, ProjectStatus } from "@/modules/projects/projectTypes";
import { PROJECT_CONTEXT_LABELS } from "@/data/projectLabels";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

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

const PRIORITY_SCORE: Record<string, number> = {
  critical: 95,
  high: 78,
  medium: 55,
  low: 32,
};

interface ProjectCardProps {
  project: Project;
  variant?: "primary" | "default" | "muted";
  missionTitle?: string;
  missionStatusLabel?: string;
  showMissionLink?: boolean;
}

function PriorityRing({ score }: { score: number }) {
  return (
    <div className="gigi-priority-ring" style={{ ["--score" as string]: score }}>
      <div className="gigi-priority-ring-inner" aria-hidden />
      <span className="gigi-priority-ring-label">{score}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  variant = "default",
  missionTitle,
  missionStatusLabel,
  showMissionLink,
}: ProjectCardProps) {
  const isPrimary = variant === "primary";
  const isMuted = variant === "muted" || project.status !== "active";
  const score = Math.round(
    (PRIORITY_SCORE[project.priority] ?? 50) * 0.4 + project.progress * 0.6
  );
  const roleToday =
    showMissionLink && missionTitle
      ? missionTitle
      : project.status === "active"
        ? project.nextAction
        : PROJECT_CONTEXT_LABELS[project.id] ?? project.description;

  return (
    <article
      className={cn(
        "gigi-project-card",
        isPrimary && "gigi-project-card-primary",
        isMuted && !isPrimary && "gigi-project-card-muted"
      )}
    >
      <div className="flex gap-4">
        <PriorityRing score={score} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "font-semibold tracking-tight",
                isPrimary ? "text-[1.15rem] text-text-primary" : "text-[15px]",
                isMuted && !isPrimary ? "text-text-secondary" : "text-text-primary"
              )}
            >
              {project.name}
            </h3>
            <StatusPill
              label={
                isPrimary && missionStatusLabel
                  ? missionStatusLabel
                  : STATUS_LABEL[project.status]
              }
              variant={project.status === "active" || isPrimary ? "warm" : "muted"}
            />
            <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
              {PRIORITY_LABEL[project.priority]}
            </span>
          </div>

          {!isPrimary && (
            <p className="mt-1 line-clamp-2 text-[13px] text-text-muted">
              {PROJECT_CONTEXT_LABELS[project.id] ?? project.description}
            </p>
          )}

          {isPrimary && (
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              {project.description}
            </p>
          )}

          <div className={cn("mt-3", isPrimary && "mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3")}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/75">
              {isPrimary ? "Rôle aujourd'hui" : "Prochaine action"}
            </p>
            <p
              className={cn(
                "mt-1 leading-snug",
                isPrimary ? "text-[14px] font-medium text-text-primary" : "text-[13px] text-text-secondary"
              )}
            >
              {roleToday}
            </p>
          </div>

          <div className={cn("mt-4 flex items-center gap-3", !isPrimary && "mt-3")}>
            <ProgressBar value={project.progress} muted={isMuted && !isPrimary} className="flex-1" />
            <span className="shrink-0 text-[12px] font-medium tabular-nums text-text-secondary">
              {project.progress}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
