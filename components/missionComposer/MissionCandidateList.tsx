"use client";

import { listActiveMissionCandidates } from "@/modules/missionComposer";
import { MissionCandidateCard } from "./MissionCandidateCard";

interface MissionCandidateListProps {
  projectId?: string;
  limit?: number;
  revision: number;
  onRefresh: () => void;
}

export function MissionCandidateList({
  projectId,
  limit,
  revision,
  onRefresh,
}: MissionCandidateListProps) {
  void revision;
  const all = listActiveMissionCandidates();
  const filtered = projectId ? all.filter((c) => c.projectId === projectId) : all;
  const items = limit ? filtered.slice(0, limit) : filtered;

  if (items.length === 0) {
    return (
      <p className="text-[12px] text-text-muted">
        Aucune mission candidate persistée — crée-en une par action explicite ci-dessous.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((c) => (
        <MissionCandidateCard key={c.id} candidate={c} onRefresh={onRefresh} />
      ))}
    </ul>
  );
}
