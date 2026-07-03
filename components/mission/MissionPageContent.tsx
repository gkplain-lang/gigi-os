"use client";

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
  const introPrimary =
    mission.status === "in_progress"
      ? "Tu es sur ta mission. Reste focalisé."
      : mission.status === "completed"
        ? "Bien joué. Mission accomplie."
        : mission.status === "postponed"
          ? "Mission reportée. Gigi garde ça en mémoire."
          : mission.status === "rejected_for_now"
            ? "Pas maintenant. On verra une autre priorité."
            : "J'ai choisi une seule mission pour toi aujourd'hui.";

  const introSecondary =
    mission.status === "recommended"
      ? "Une action. Aucun bruit."
      : undefined;

  return (
    <div className="animate-fade-in">
      <section className="mb-12 md:mb-16">
        <GigiMessage primary={introPrimary} secondary={introSecondary} />
      </section>

      <MissionCard
        mission={mission}
        onStart={startMission}
        onComplete={completeMission}
        onPostpone={postponeMission}
        onReject={rejectMission}
      />

      {mission.status === "recommended" || mission.status === "in_progress" ? (
        <>
          <div className="my-12 h-px max-w-3xl bg-white/[0.06] md:my-16" />
          <MissionSupportingPanel mission={mission} />
        </>
      ) : null}
    </div>
  );
}
