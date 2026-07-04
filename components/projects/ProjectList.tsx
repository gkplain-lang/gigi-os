"use client";

import type { Project } from "@/modules/projects/projectTypes";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  missionProjectId?: string;
  missionStatusLabel?: string;
}

export function ProjectList({
  projects,
  missionProjectId,
  missionStatusLabel,
}: ProjectListProps) {
  const featured = projects.find((p) => p.id === "buildy-clear");
  const others = projects.filter((p) => p.id !== "buildy-clear");

  const featuredMissionLabel =
    missionProjectId === "buildy-clear" ? missionStatusLabel : undefined;

  return (
    <div className="animate-fade-in">
      {featured && (
        <ProjectCard project={featured} featured missionStatusLabel={featuredMissionLabel} />
      )}

      {others.length > 0 && (
        <section className="mt-16">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-text-muted">
            Le reste peut attendre
          </p>
          <div className="divide-y divide-white/[0.05]">
            {others.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
