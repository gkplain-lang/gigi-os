import { StatusPill } from "@/components/ui/StatusPill";

interface DecisionReasonProps {
  reasoning: string;
  missionTitle: string;
  projectName: string;
  finalScore: number;
}

export function DecisionReason({
  reasoning,
  missionTitle,
  projectName,
  finalScore,
}: DecisionReasonProps) {
  return (
    <div className="gigi-panel rounded-xl p-6">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill label="Mission choisie" variant="warm" />
            <span className="text-[13px] text-text-muted">{projectName}</span>
          </div>
          <h2 className="mt-3 text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary">
            {missionTitle}
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed text-text-secondary">{reasoning}</p>
        </div>

        <div className="shrink-0 rounded-lg border border-border bg-surface-2 px-4 py-3 text-center">
          <p className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            Confiance
          </p>
          <p className="mt-0.5 text-[1.7rem] font-semibold leading-none text-accent-soft">
            {finalScore}%
          </p>
        </div>
      </div>
    </div>
  );
}
