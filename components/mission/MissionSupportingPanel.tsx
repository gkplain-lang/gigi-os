import Link from "next/link";
import type { Mission } from "@/modules/missions/missionTypes";

interface MissionSupportingPanelProps {
  mission: Mission;
}

export function MissionSupportingPanel({ mission }: MissionSupportingPanelProps) {
  return (
    <section className="max-w-2xl">
      <p className="text-[13px] font-medium uppercase tracking-wide text-copper-soft">
        Pourquoi c&apos;est important
      </p>
      <p className="mt-4 text-lg leading-relaxed text-text-secondary">
        Buildy Clear est ton chemin le plus court vers le revenu. Finaliser cette page débloque le
        lancement — le reste peut suivre après.
      </p>
      <p className="mt-6 text-base text-text-muted">
        Gigi est confiant à {mission.confidence}%.{" "}
        <Link
          href="/brain"
          className="text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          Voir pourquoi il a choisi ça
        </Link>
        .
      </p>
    </section>
  );
}
