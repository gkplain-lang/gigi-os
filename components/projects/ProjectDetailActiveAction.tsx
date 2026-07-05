"use client";

import Link from "next/link";
import type { ProjectCommandCard } from "@/modules/projectsCommand";

interface ProjectDetailActiveActionProps {
  card: ProjectCommandCard;
}

export function ProjectDetailActiveAction({ card }: ProjectDetailActiveActionProps) {
  if (!card.activeActionTitle) return null;

  return (
    <section className="gigi-command-card mb-5 p-5">
      <p className="gigi-mission-control-label">Action active</p>
      <p className="mt-2 text-[16px] font-semibold text-text-primary">{card.activeActionTitle}</p>
      <p className="mt-2 text-[13px] text-text-muted">
        Étape en cours sur ce projet — flux manuel sur /actions.
      </p>
      <Link
        href="/actions"
        className="gigi-focus mt-3 inline-flex text-[13px] font-medium text-accent-soft hover:underline"
      >
        Ouvrir le flux d&apos;action →
      </Link>
    </section>
  );
}
