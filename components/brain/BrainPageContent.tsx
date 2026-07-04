"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AiAvailabilityBadge } from "@/components/ai/AiEngineBadge";
import { DecisionReason } from "@/components/brain/DecisionReason";
import { ScoreBreakdown } from "@/components/brain/ScoreBreakdown";
import { AlternativesList } from "@/components/brain/AlternativesList";
import { useGigi } from "@/components/providers/GigiProvider";
import { PAGE_META } from "@/modules/dailyUse";
import { useAiAvailability } from "@/modules/ai";

export function BrainPageContent() {
  const { isHydrated, getDecision } = useGigi();
  const { isAiConfigured, loading } = useAiAvailability();

  if (!isHydrated) return null;

  const decision = getDecision();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Décision"
        meta={PAGE_META.brain}
        right={<AiAvailabilityBadge isConfigured={isAiConfigured} loading={loading} />}
      />

      <div className="space-y-4">
        <DecisionReason
          missionTitle={decision.missionTitle}
          projectName={decision.projectName}
          reasoning={decision.reasoning}
          finalScore={decision.finalScore}
        />
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <ScoreBreakdown criteria={decision.criteria} finalScore={decision.finalScore} />
          <AlternativesList alternatives={decision.alternatives} />
        </div>
      </div>
    </div>
  );
}
