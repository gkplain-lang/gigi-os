import Link from "next/link";
import { MessageCircle, Compass } from "lucide-react";
import { SIDEBAR_LINK_LABELS } from "@/modules/dailyUseRefinement";
import type { Mission } from "@/modules/missions/missionTypes";
import type { AlternativeConsidered } from "@/modules/decision-engine/decisionTypes";

interface MissionSidebarProps {
  mission: Mission;
  ignored: AlternativeConsidered[];
}

export function MissionSidebar({ mission, ignored }: MissionSidebarProps) {
  const rows = [
    { label: "Projet", value: mission.projectName },
    { label: "Durée estimée", value: mission.estimatedDuration },
    { label: "Impact", value: mission.expectedImpact },
    { label: "Confiance", value: `${mission.confidence}%` },
  ];

  return (
    <div className="space-y-4">
      <div className="gigi-panel rounded-xl p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Détails</p>
        <div className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-text-muted">{r.label}</span>
              <span className="text-[13px] font-medium text-text-secondary">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {ignored.length > 0 && (
        <div className="gigi-panel rounded-xl p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            À ignorer aujourd&apos;hui
          </p>
          <ul className="mt-3 space-y-2.5">
            {ignored.map((alt) => (
              <li key={alt.projectName} className="text-[13px] leading-relaxed">
                <span className="text-text-secondary">{alt.projectName}</span>{" "}
                <span className="text-text-muted">— {alt.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/conversation"
          className="gigi-btn gigi-focus flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13.5px]"
        >
          <MessageCircle className="h-4 w-4" />
          {SIDEBAR_LINK_LABELS.talkToGigi}
        </Link>
        <Link
          href="/brain"
          className="gigi-btn gigi-focus flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13.5px]"
        >
          <Compass className="h-4 w-4" />
          {SIDEBAR_LINK_LABELS.seeDecision}
        </Link>
      </div>
    </div>
  );
}
