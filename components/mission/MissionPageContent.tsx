"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { GigiMessage } from "@/components/ui/GigiMessage";
import { MissionCard } from "@/components/mission/MissionCard";
import { MissionSupportingPanel } from "@/components/mission/MissionSupportingPanel";
import { useGigi } from "@/components/providers/GigiProvider";

export function MissionPageContent() {
  const {
    state,
    isHydrated,
    startMission,
    completeMission,
    postponeMission,
    rejectMission,
  } = useGigi();

  if (!isHydrated) {
    return null;
  }

  const { mission } = state;

  const intro: Record<
    typeof mission.status,
    { primary: string; secondary?: string; tone?: "warm" | "done" }
  > = {
    recommended: {
      primary: "J'ai choisi une seule mission pour toi aujourd'hui.",
      secondary: "Une action. Aucun bruit.",
    },
    in_progress: {
      primary: "Tu es sur ta mission.",
      secondary: "Reste ici. Je garde le reste au calme.",
    },
    completed: {
      primary: "Voilà. C'est fait.",
      tone: "done",
    },
    postponed: {
      primary: "C'est noté. On la garde pour plus tard.",
    },
    rejected_for_now: {
      primary: "Pas maintenant, d'accord.",
    },
  };

  const current = intro[mission.status];
  const showSupporting =
    mission.status === "recommended" || mission.status === "in_progress";

  return (
    <div className="animate-fade-in">
      <section className="mb-14 md:mb-20">
        <GigiMessage
          primary={current.primary}
          secondary={current.secondary}
          tone={current.tone}
        />
      </section>

      <MissionCard
        mission={mission}
        onStart={startMission}
        onComplete={completeMission}
        onPostpone={postponeMission}
        onReject={rejectMission}
      />

      {showSupporting && (
        <>
          <div className="my-14 h-px max-w-2xl bg-white/[0.06] md:my-16" />
          <MissionSupportingPanel mission={mission} />
        </>
      )}

      <div className="mt-14 max-w-2xl md:mt-16">
        <Link
          href="/conversation"
          className="group inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] text-text-muted transition-colors hover:bg-white/[0.03] hover:text-text-secondary"
        >
          <MessageCircle className="h-[18px] w-[18px] text-copper-soft" />
          Parler à Gigi
          <span className="text-text-muted/50 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
