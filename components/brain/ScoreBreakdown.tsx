import type { ScoreCriterion } from "@/modules/decision-engine/decisionTypes";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ScoreBreakdownProps {
  criteria: ScoreCriterion[];
  finalScore: number;
}

export function ScoreBreakdown({ criteria }: ScoreBreakdownProps) {
  const top = [...criteria].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="gigi-panel rounded-xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Critères clés
      </p>
      <div className="mt-4 space-y-3">
        {top.map((criterion) => (
          <div key={criterion.key} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-[13px] text-text-secondary">{criterion.label}</span>
            <ProgressBar value={criterion.score * 10} className="flex-1" />
            <span className="w-6 shrink-0 text-right text-[12px] tabular-nums text-text-muted">
              {criterion.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
