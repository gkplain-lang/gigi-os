"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ManualExecutionPacket } from "@/modules/executionReadiness";
import {
  downloadManualBridgePacketExport,
  getEffectivePacketStatus,
  updateManualExecutionPacketStatus,
  createCommandPackFromManualPacket,
} from "@/modules/executionReadiness";

interface ManualBridgePacketActionsProps {
  packet: ManualExecutionPacket;
  onUpdated: () => void;
}

export function ManualBridgePacketActions({
  packet,
  onUpdated,
}: ManualBridgePacketActionsProps) {
  const router = useRouter();
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [packMsg, setPackMsg] = useState<string | null>(null);
  const status = getEffectivePacketStatus(packet);
  const active = !["cancelled", "expired", "marked_done_by_human"].includes(status);

  function handleStatus(
    next: ManualExecutionPacket["status"],
    reason: string
  ) {
    updateManualExecutionPacketStatus(packet.id, next, reason);
    onUpdated();
  }

  function handleExport() {
    const result = downloadManualBridgePacketExport(packet.id);
    setExportMsg(result.ok ? `Exporté : ${result.filename}` : result.error ?? "Erreur");
  }

  function handleCreateCommandPack() {
    const pack = createCommandPackFromManualPacket(packet.id);
    if (pack) {
      setPackMsg(`Pack préparé : ${pack.title}`);
      router.push(`/command-packs?pack=${pack.id}`);
    } else {
      setPackMsg("Impossible de préparer le pack.");
    }
  }

  if (!active) {
    return (
      <p className="text-[12px] text-text-muted">
        Paquet clos — aucune action locale supplémentaire.
      </p>
    );
  }

  return (
    <div className="space-y-3 border-t border-border/40 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Actions locales — pont manuel
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCreateCommandPack}
          className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Préparer un pack de commandes
        </button>
        <button
          type="button"
          onClick={() =>
            handleStatus("copied_by_human", "Instructions copiées par l'humain — Gigi ne vérifie rien.")
          }
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Marquer comme copié par l&apos;humain
        </button>
        <button
          type="button"
          onClick={() =>
            handleStatus(
              "marked_done_by_human",
              "Marqué fait par l'humain — aucune vérification d'exécution réelle."
            )
          }
          className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Marquer comme fait par l&apos;humain
        </button>
        <button
          type="button"
          onClick={() => handleStatus("cancelled", "Paquet annulé localement.")}
          className="gigi-focus rounded-lg border border-red-500/30 px-3 py-1.5 text-[12px] text-red-200/90"
        >
          Annuler le paquet
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Exporter JSON
        </button>
      </div>
      {exportMsg && <p className="text-[11px] text-text-muted">{exportMsg}</p>}
      {packMsg && (
        <p className="text-[11px] text-text-muted">
          {packMsg}{" "}
          <Link href="/command-packs" className="text-accent-soft hover:underline">
            Voir /command-packs
          </Link>
        </p>
      )}
    </div>
  );
}
