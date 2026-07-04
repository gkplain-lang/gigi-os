"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_BANNER } from "@/modules/onboarding";

export function OnboardingBanner() {
  return (
    <div className="gigi-panel-feature mb-4 overflow-hidden rounded-xl border border-[rgba(124,140,255,0.28)] px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-text-primary">{ONBOARDING_BANNER.title}</p>
          <p className="mt-0.5 text-[12.5px] text-text-secondary">{ONBOARDING_BANNER.body}</p>
        </div>
        <Link
          href="/onboarding"
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          {ONBOARDING_BANNER.cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
