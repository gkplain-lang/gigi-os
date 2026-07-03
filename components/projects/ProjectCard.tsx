import type { Project } from "@/modules/projects/projectTypes";
import { PROJECT_CONTEXT_LABELS } from "@/data/projectLabels";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  missionStatusLabel?: string;
}

export function ProjectCard({ project, featured, missionStatusLabel }: ProjectCardProps) {
  const contextLabel =
    missionStatusLabel ?? PROJECT_CONTEXT_LABELS[project.id] ?? project.status;

  if (featured) {
    const featuredPill =
      missionStatusLabel === "Mission en cours"
        ? "Mission en cours"
        : missionStatusLabel ?? "Priorité active";

    return (
      <section className="relative">
        <div className="gigi-halo-soft" aria-hidden />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3">
            <StatusPill
              label={featuredPill}
              variant={missionStatusLabel ? "muted" : "warm"}
            />
            <span className="text-sm text-text-muted">{contextLabel}</span>
          </div>
          <h3 className="mt-5 font-display text-3xl font-medium text-text-primary md:text-[2.5rem]">
            {project.name}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">{project.nextAction}</p>
          <div className="mt-7 max-w-xs">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">Progression</span>
              <span className="text-copper-soft">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex items-baseline justify-between gap-6 py-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h3 className="text-lg font-medium text-text-primary">{project.name}</h3>
          <span className="text-[13px] text-text-muted">· {contextLabel}</span>
        </div>
        <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">{project.description}</p>
      </div>
      <span className="shrink-0 text-sm tabular-nums text-text-muted">{project.progress}%</span>
    </div>
  );
}
