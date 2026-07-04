import Link from "next/link";
import { Check, ArrowRight, MessageCircle, History } from "lucide-react";
import { GigiOrb } from "@/components/ui/GigiOrb";

interface MissionDoneProps {
  completedTitle: string;
  nextTitle?: string;
  onNext: () => void;
}

export function MissionDone({ completedTitle, nextTitle, onNext }: MissionDoneProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
      <div className="gigi-panel rounded-xl p-6 lg:col-span-2">
        <div className="flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <GigiOrb size="md" tone="done" className="absolute inset-0" />
            <Check className="relative z-10 h-4 w-4 text-[#0c130f]" strokeWidth={3} />
          </span>
          <h2 className="text-[1.4rem] font-semibold tracking-tight text-text-primary">
            Mission accomplie.
          </h2>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Ce qui a été fait
          </p>
          <div className="mt-2 flex items-start gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" strokeWidth={2.5} />
            <span className="text-[14px] text-text-secondary line-through">{completedTitle}</span>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-text-secondary">
          Tu peux t&apos;arrêter ici, ou laisser Gigi préparer la suite.
        </p>
      </div>

      <div className="gigi-panel rounded-xl p-5 lg:col-span-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Suite recommandée
        </p>
        {nextTitle ? (
          <p className="mt-2 text-[14px] text-text-primary">{nextTitle}</p>
        ) : (
          <p className="mt-2 text-[14px] text-text-secondary">
            Toutes tes missions importantes sont faites. Souffle.
          </p>
        )}

        {nextTitle && (
          <button
            type="button"
            onClick={onNext}
            className="gigi-btn-primary gigi-focus mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium"
          >
            Choisir la prochaine mission
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link
            href="/conversation"
            className="gigi-btn gigi-focus flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13.5px]"
          >
            <MessageCircle className="h-4 w-4" />
            Gigi
          </Link>
          <Link
            href="/history"
            className="gigi-btn gigi-focus flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13.5px]"
          >
            <History className="h-4 w-4" />
            Historique
          </Link>
        </div>
      </div>
    </div>
  );
}
