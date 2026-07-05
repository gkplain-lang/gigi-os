"use client";

import {
  formatBytes,
  formatCategoryLabel,
  type LocalDataRecordSummary,
} from "@/modules/localDataControl";

interface LocalDataKeyTableProps {
  records: LocalDataRecordSummary[];
}

export function LocalDataKeyTable({ records }: LocalDataKeyTableProps) {
  const present = records.filter((r) => r.exists);

  if (present.length === 0) {
    return (
      <p className="text-[13px] text-text-secondary">
        Aucune clé Gigi détectée pour l&apos;instant — normal au premier lancement.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border/60 text-[10px] uppercase tracking-wider text-text-muted">
            <th className="pb-2 pr-3 font-semibold">Clé / rôle</th>
            <th className="pb-2 pr-3 font-semibold">Statut</th>
            <th className="pb-2 pr-3 font-semibold">Taille</th>
            <th className="pb-2 pr-3 font-semibold">Risque</th>
            <th className="pb-2 font-semibold">Export / reset</th>
          </tr>
        </thead>
        <tbody>
          {present.map((record) => (
            <tr key={record.key} className="border-b border-border/30 align-top">
              <td className="py-3 pr-3">
                <p className="font-medium text-text-primary">{record.label}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-text-muted">{record.key}</p>
                <p className="mt-1 text-[11.5px] text-text-secondary">{record.description}</p>
                <p className="mt-1 text-[10.5px] text-text-muted">
                  {formatCategoryLabel(record.category)} · {record.ownerModule}
                </p>
              </td>
              <td className="py-3 pr-3">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                  Présente
                </span>
                {record.itemCount !== undefined && (
                  <p className="mt-1 text-[11px] text-text-muted">{record.itemCount} élément(s)</p>
                )}
              </td>
              <td className="py-3 pr-3 text-text-secondary">{formatBytes(record.sizeBytes)}</td>
              <td className="py-3 pr-3 text-text-secondary">{record.riskLabel}</td>
              <td className="py-3 text-text-secondary">
                {record.exportable ? "Exportable" : "Non exportable"}
                <br />
                {record.resettable ? "Reset ciblé possible" : "Reset manuel déconseillé"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
