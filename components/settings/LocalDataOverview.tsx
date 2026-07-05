"use client";

import { listUnknownGigiKeys, type LocalDataSnapshot } from "@/modules/localDataControl";
import { LocalDataKeyTable } from "./LocalDataKeyTable";

interface LocalDataOverviewProps {
  snapshot: LocalDataSnapshot | null;
}

export function LocalDataOverview({ snapshot }: LocalDataOverviewProps) {
  const unknownKeys = typeof window !== "undefined" ? listUnknownGigiKeys() : [];

  return (
    <section className="gigi-panel mb-6 rounded-xl p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Données locales
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Clés connues du catalogue Gigi — présence, taille approximative et niveau de risque.
        Aucune donnée n&apos;est envoyée hors de cet appareil.
      </p>

      {snapshot ? (
        <>
          <div className="mt-4">
            <LocalDataKeyTable records={snapshot.keys} />
          </div>
          {unknownKeys.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <p className="text-[12px] font-medium text-amber-100">
                {unknownKeys.length} clé(s) gigi-os non cataloguée(s)
              </p>
              <ul className="mt-2 space-y-1 font-mono text-[11px] text-text-muted">
                {unknownKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 text-[13px] text-text-muted">Inspection en cours…</p>
      )}
    </section>
  );
}
