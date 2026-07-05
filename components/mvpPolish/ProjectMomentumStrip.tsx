"use client";

import Link from "next/link";

interface ProjectMomentumItem {
  id: string;
  name: string;
}

interface ProjectMomentumStripProps {
  projects: ProjectMomentumItem[];
  limit?: number;
  className?: string;
}

export function ProjectMomentumStrip({ projects, limit = 3, className }: ProjectMomentumStripProps) {
  const items = projects.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section className={`rounded-xl border border-border/30 p-5 ${className ?? ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Projets prioritaires
        </p>
        <Link
          href="/projects"
          className="gigi-focus text-[12px] font-medium text-accent-soft hover:underline"
        >
          Voir les projets →
        </Link>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${encodeURIComponent(p.id)}`}
              className="gigi-focus flex h-full flex-col rounded-lg border border-border/40 px-3 py-2.5 hover:border-accent-soft/40"
            >
              <span className="text-[12.5px] font-medium text-text-primary">{p.name}</span>
              <span className="mt-1 text-[11px] text-text-muted">Missions possibles →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
