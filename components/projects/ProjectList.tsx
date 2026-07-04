"use client";

import type { Project } from "@/modules/projects/projectTypes";
import { ProjectCard } from "@/components/projects/ProjectCard";

interface ProjectListProps {
  projects: Project[];
  missionProjectId?: string;
  missionTitle?: string;
  missionStatusLabel?: string;
}

export function ProjectList({
  projects,
  missionProjectId,
  missionTitle,
  missionStatusLabel,
}: ProjectListProps) {
  const primary = projects.find((p) => p.id === (missionProjectId ?? "buildy-clear"));
  const activeOthers = projects.filter(
    (p) => p.id !== primary?.id && p.status === "active"
  );
  const resting = projects.filter(
    (p) => p.id !== primary?.id && p.status !== "active"
  );

  if (!primary && projects.length === 0) {
    return (
      <div className="gigi-empty-state rounded-xl px-6 py-10 text-center">
        <p className="text-[15px] font-semibold text-text-primary">Aucun projet pour l&apos;instant</p>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-text-secondary">
          Ajoute tes projets via l&apos;onboarding pour que Gigi puisse prioriser.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {primary && (
        <section>
          <p className="gigi-mission-control-label mb-3">Décision du jour</p>
          <ProjectCard
            project={primary}
            variant="primary"
            missionTitle={missionTitle}
            missionStatusLabel={missionStatusLabel}
            showMissionLink={missionProjectId === primary.id}
          />
        </section>
      )}

      {activeOthers.length > 0 && (
        <section>
          <p className="gigi-mission-control-label mb-3">En cours</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeOthers.map((project) => (
              <ProjectCard key={project.id} project={project} variant="default" />
            ))}
          </div>
        </section>
      )}

      {resting.length > 0 && (
        <section>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Pause &amp; futur
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {resting.map((project) => (
              <ProjectCard key={project.id} project={project} variant="muted" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
