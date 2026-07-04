"use client";

import type { AiBrainMode } from "@/modules/ai";

const MODE_LABELS: Record<AiBrainMode, string> = {
  local_only: "Local",
  ai_assisted: "IA assistée",
  ai_unavailable: "IA indisponible · local",
};

interface AiEngineBadgeProps {
  mode?: AiBrainMode | null;
  className?: string;
}

export function AiEngineBadge({ mode = "local_only", className = "" }: AiEngineBadgeProps) {
  const label = MODE_LABELS[mode ?? "local_only"];

  return (
    <p className={`text-[12px] text-text-muted ${className}`}>
      Moteur : <span className="text-text-secondary">{label}</span>
    </p>
  );
}

export function AiAvailabilityBadge({
  isConfigured,
  loading,
}: {
  isConfigured: boolean;
  loading: boolean;
}) {
  if (loading) return <span className="text-[12px] text-text-muted">Moteur…</span>;

  return (
    <span className="text-[12px] text-text-muted">
      IA :{" "}
      <span className="text-text-secondary">
        {isConfigured ? "disponible (optionnelle)" : "non configurée · local"}
      </span>
    </span>
  );
}
