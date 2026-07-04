"use client";

import Link from "next/link";
import { MessageCircle, MessageSquare, Sun } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import { V10_PROMISE } from "@/modules/release";

export function DailyUseStrip() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) return null;

  const { mission } = state;
  const inProgress = mission.status === "in_progress";
  const nextHint = inProgress
    ? "Continue ta mission — coche tes étapes."
    : mission.status === "recommended"
      ? "Lance la mission quand tu es prêt."
      : "Parle à Gigi pour la suite.";

  return (
    <div className="gigi-panel mb-4 rounded-xl p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Aujourd&apos;hui
      </p>
      <p className="mt-1.5 text-[14px] font-medium text-text-primary">{mission.title}</p>
      <p className="mt-1 text-[13px] text-text-muted">{nextHint}</p>
      <p className="mt-2 text-[11.5px] italic text-text-muted/80">{V10_PROMISE}</p>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <Link
          href="/conversation"
          className="gigi-chip gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Parler à Gigi
        </Link>
        <Link
          href="/conversation"
          className="gigi-chip gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
          title="Demande : bilan du jour"
        >
          <Sun className="h-3.5 w-3.5" aria-hidden />
          Bilan du jour
        </Link>
        <Link
          href="/feedback"
          className="gigi-chip gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] text-text-muted"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Feedback
        </Link>
      </div>
    </div>
  );
}
