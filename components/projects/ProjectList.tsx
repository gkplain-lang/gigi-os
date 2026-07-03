import type { Project } from "@/modules/projects/projectTypes";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const featured = projects.find((p) => p.id === "buildy-clear");
  const others = projects.filter((p) => p.id !== "buildy-clear");

  return (
    <div className="animate-fade-in">
      {featured && <ProjectCard project={featured} featured />}

      {others.length > 0 && (
        <section className="mt-14">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-text-muted">
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
