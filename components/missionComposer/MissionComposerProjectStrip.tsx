"use client";

import Link from "next/link";

interface ProjectStripItem {
  id: string;
  name: string;
}

interface MissionComposerProjectStripProps {
  projects: ProjectStripItem[];
}

export function MissionComposerProjectStrip({ projects }: MissionComposerProjectStripProps) {
  if (projects.length === 0) return null;

  return (
    <section className="rounded-xl border border-border/30 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Projets liés
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${encodeURIComponent(p.id)}`}
              className="gigi-focus inline-flex rounded-lg border border-border/40 px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
