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
    { label: "Durée", value: mission.estimatedDuration },
    { label: "Impact", value: mission.expectedImpact },
    { label: "Confiance", value: `${mission.confidence}%` },
  ];

  return (
    <aside className="space-y-3 lg:sticky lg:top-6">
      <div className="gigi-command-card-accent gigi-command-card p-4">
        <p className="gigi-mission-control-label">Signal mission</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {rows.map((r) => (
            <div key={r.label} className="min-w-0">
              <dt className="text-[11px] text-text-muted">{r.label}</dt>
              <dd className="truncate text-[13px] font-medium text-text-primary">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div
          className="gigi-priority-ring mx-auto mt-4"
          style={{ ["--score" as string]: mission.confidence, ["--ring-size" as string]: "3.25rem" }}
        >
          <div className="gigi-priority-ring-inner" aria-hidden />
          <span className="gigi-priority-ring-label">{mission.confidence}%</span>
        </div>
        <p className="mt-1.5 text-center text-[10px] uppercase tracking-wider text-text-muted">
          Confiance Gigi
        </p>
      </div>

      {ignored.length > 0 && (
        <div className="gigi-command-card gigi-editorial-block p-4 pl-5">
          <p className="gigi-editorial-title">À ignorer aujourd&apos;hui</p>
          <ul className="mt-3 space-y-2.5">
            {ignored.map((alt) => (
              <li key={alt.projectName} className="gigi-editorial-item">
                <span className="gigi-editorial-item-name">{alt.projectName}</span>
                <span className="block text-[12px] text-text-muted">{alt.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <Link
          href="/conversation"
          className="gigi-btn-primary gigi-focus flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-medium"
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
    </aside>
  );
}
