"use client";

import { GigiMessage } from "@/components/ui/GigiMessage";
import { DecisionReason } from "@/components/brain/DecisionReason";
import { ScoreBreakdown } from "@/components/brain/ScoreBreakdown";
import { AlternativesList } from "@/components/brain/AlternativesList";
import { useGigi } from "@/components/providers/GigiProvider";

export function BrainPageContent() {
  const { isHydrated, getDecision } = useGigi();

  if (!isHydrated) return null;

  const decision = getDecision();

  return (
    <div className="animate-fade-in max-w-3xl">
      <section className="mb-12 md:mb-16">
        <GigiMessage
          primary="Voici pourquoi j'ai choisi cette mission."
          secondary="Pas d'analyse froide — juste une décision claire."
        />
      </section>

      <DecisionReason
        missionTitle={decision.missionTitle}
        projectName={decision.projectName}
        reasoning={decision.reasoning}
      />

      <div className="my-12 h-px bg-white/[0.06] md:my-14" />

      <ScoreBreakdown criteria={decision.criteria} finalScore={decision.finalScore} />

      <div className="my-12 h-px bg-white/[0.06] md:my-14" />

      <AlternativesList alternatives={decision.alternatives} />
    </div>
  );
}
