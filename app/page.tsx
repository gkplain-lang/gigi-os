import { GigiMessage } from "@/components/ui/GigiMessage";
import { MissionCard } from "@/components/mission/MissionCard";
import { MissionSupportingPanel } from "@/components/mission/MissionSupportingPanel";
import { selectMission } from "@/modules/decision-engine/selectMission";

export default function MissionPage() {
  const mission = selectMission();

  return (
    <div className="animate-fade-in">
      <section className="mb-12 md:mb-16">
        <GigiMessage
          primary="J'ai choisi une seule mission pour toi aujourd'hui."
          secondary="Une action. Aucun bruit."
        />
      </section>

      <MissionCard mission={mission} />

      <div className="my-12 h-px max-w-3xl bg-white/[0.06] md:my-16" />

      <MissionSupportingPanel mission={mission} />
    </div>
  );
}
