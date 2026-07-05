"use client";

import Link from "next/link";
import { V4_SETTINGS_JOURNEY } from "@/modules/executionExperience/executionExperienceConstants";

export function V4SettingsJourneyStrip() {
  return (
    <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
      <p className="text-[12px] font-medium text-text-primary">Parcours V4.0 → V4.4</p>
      <p className="mt-1 text-[11.5px] text-text-muted">
        Ces modules sont locaux. Ils ne déclenchent aucune action réelle.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {V4_SETTINGS_JOURNEY.map((item) => (
          <Link
            key={item.version}
            href={item.href}
            className="gigi-focus rounded-md border border-border/40 px-2.5 py-1 text-[11px] font-medium text-accent-soft hover:bg-white/[0.04]"
          >
            {item.version} · {item.label}
          </Link>
        ))}
        <Link
          href="/actions"
          className="gigi-focus rounded-md border border-violet-500/30 px-2.5 py-1 text-[11px] font-medium text-violet-200/90"
        >
          Centre d&apos;action →
        </Link>
      </div>
    </div>
  );
}
