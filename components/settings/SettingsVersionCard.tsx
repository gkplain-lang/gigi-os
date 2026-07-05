"use client";

import Link from "next/link";
import {
  GIGI_DEV_VERSION,
  GIGI_RELEASE_VERSION,
  LOCAL_DATA_USEFUL_LINKS,
} from "@/modules/localDataControl";

interface SettingsVersionCardProps {
  snapshotGeneratedAt: string | null;
  presentCount: number;
  totalSizeLabel: string;
}

export function SettingsVersionCard({
  snapshotGeneratedAt,
  presentCount,
  totalSizeLabel,
}: SettingsVersionCardProps) {
  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Version &amp; statut
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-surface-2/15 px-4 py-3">
          <p className="text-[11px] text-text-muted">Version livrée</p>
          <p className="mt-1 text-[18px] font-semibold text-text-primary">v{GIGI_RELEASE_VERSION}</p>
        </div>
        <div className="rounded-lg border border-indigo-500/25 bg-indigo-500/5 px-4 py-3">
          <p className="text-[11px] text-text-muted">V3.7 en préparation</p>
          <p className="mt-1 text-[18px] font-semibold text-accent-soft">v{GIGI_DEV_VERSION}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Mode</dt>
          <dd className="font-medium text-text-primary">Local-first</dd>
        </div>
        <div>
          <dt className="text-text-muted">Données présentes</dt>
          <dd className="font-medium text-text-primary">
            {presentCount} clé(s) · {totalSizeLabel}
          </dd>
        </div>
        {snapshotGeneratedAt && (
          <div className="sm:col-span-2">
            <dt className="text-text-muted">Dernière inspection</dt>
            <dd className="text-text-secondary">
              {new Date(snapshotGeneratedAt).toLocaleString("fr-FR")}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-3 text-[12.5px]">
        {LOCAL_DATA_USEFUL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="gigi-focus text-accent-soft hover:underline"
          >
            {link.label} →
          </Link>
        ))}
        <span className="text-text-muted">Docs V3.7 (fichier local docs/V3_7_SETTINGS_LOCAL_DATA_CONTROL.md)</span>
      </div>
    </section>
  );
}
