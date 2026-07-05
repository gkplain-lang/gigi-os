"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  createManualExecutionPacket,
  generateManualBridgeSummary,
  listManualExecutionPackets,
  manualBridgePolicyNotes,
  syncExpiredManualBridgePackets,
  getManualExecutionPacketById,
} from "@/modules/executionReadiness";
import { ManualBridgeBadges } from "./ManualBridgeBadges";
import { ManualBridgeDisclaimer } from "./ManualBridgeDisclaimer";
import { ManualBridgeSummaryStats } from "./ManualBridgeSummaryStats";
import { ManualBridgeConnectorRegistry } from "./ManualBridgeConnectorRegistry";
import { ManualBridgePacketList } from "./ManualBridgePacketList";
import { ManualBridgePacketDetail } from "./ManualBridgePacketDetail";
import { ManualBridgeExportPanel } from "./ManualBridgeExportPanel";
import { useIsClient } from "@/components/settings/useIsClient";

export function ManualBridgePanel() {
  const isClient = useIsClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    syncExpiredManualBridgePackets();
    return generateManualBridgeSummary();
  }, [isClient, revision]);

  const packets = useMemo(() => {
    if (!isClient) return [];
    void revision;
    return listManualExecutionPackets();
  }, [isClient, revision]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    void revision;
    return getManualExecutionPacketById(selectedId) ?? null;
  }, [selectedId, revision]);

  if (!isClient || !summary) return null;

  function handleCreatePacket() {
    const packet = createManualExecutionPacket({});
    if (packet) {
      setSelectedId(packet.id);
      refresh();
    }
  }

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Pont manuel d'exécution"
          meta="Gigi prépare des paquets d'exécution manuelle. Rien n'est lancé automatiquement."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-indigo-500/25 p-5">
          <ManualBridgeBadges className="mb-3" />
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Sandbox connecteurs et paquets à copier — validation humaine obligatoire, aucune
            exécution réelle, connecteurs non actifs.
          </p>
          <ManualBridgeDisclaimer className="mt-3" />
          <ul className="mt-3 space-y-1 text-[11.5px] text-text-muted">
            {manualBridgePolicyNotes().map((note) => (
              <li key={note}>· {note}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreatePacket}
              className="gigi-btn-primary gigi-focus rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Préparer un paquet manuel
            </button>
            <Link
              href="/permissions"
              className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Centre de permissions →
            </Link>
            <Link
              href="/actions"
              className="gigi-focus inline-flex items-center text-[12.5px] font-medium text-accent-soft hover:underline"
            >
              /actions →
            </Link>
          </div>
        </section>

        <ManualBridgeSummaryStats summary={summary} className="mb-6" />

        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Paquets d&apos;exécution manuelle
            </p>
            <ManualBridgePacketList
              packets={packets}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="gigi-panel rounded-xl p-5 md:p-6">
            {selected ? (
              <ManualBridgePacketDetail packet={selected} onUpdated={refresh} />
            ) : (
              <p className="text-[13px] text-text-secondary">
                Sélectionne un paquet — objectif, checklist, instructions copiables, rollback et
                journal local.
              </p>
            )}
          </div>
        </div>

        <ManualBridgeConnectorRegistry className="mb-8" />

        <ManualBridgeExportPanel />
      </div>
    </div>
  );
}
