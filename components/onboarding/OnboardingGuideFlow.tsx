"use client";

import Link from "next/link";
import { useState } from "react";
import { GigiMark } from "@/components/brand/GigiMark";
import { ONBOARDING_GUIDE_STEPS } from "@/modules/publicEntry/onboardingGuideCopy";
import { ONBOARDING_SIMULATION_NOTE } from "@/modules/onboarding";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingStepCard } from "./OnboardingStepCard";
import { OnboardingSafetyNote } from "./OnboardingSafetyNote";
import { OnboardingBetaChecklist } from "./OnboardingBetaChecklist";

export function OnboardingGuideFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = ONBOARDING_GUIDE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === ONBOARDING_GUIDE_STEPS.length - 1;

  return (
    <div className="gigi-page-shell gigi-wizard-shell gigi-shell-glow animate-fade-in mx-auto max-w-[640px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content relative z-[1]">
        <div className="mb-6 flex items-start gap-2.5">
          <GigiMark size="sm" title="Gigi" className="mt-1.5 shrink-0" />
          <div>
            <p className="gigi-mission-control-label">Démarrer · Gigi V3.5</p>
            <h1 className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-text-primary">
              Comprendre Gigi
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Étape {stepIndex + 1} sur {ONBOARDING_GUIDE_STEPS.length}
            </p>
          </div>
        </div>

        <OnboardingProgress current={stepIndex + 1} total={ONBOARDING_GUIDE_STEPS.length} />

        <p className="mb-4 mt-4 text-[11px] italic text-text-secondary">{ONBOARDING_SIMULATION_NOTE}</p>

        <OnboardingStepCard
          stepNumber={stepIndex + 1}
          title={step.title}
          body={step.body}
          bullets={step.bullets}
        >
          {step.id === "limits" && (
            <div className="mt-4">
              <OnboardingSafetyNote />
            </div>
          )}
          {step.id === "start" && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/"
                  className="gigi-btn-primary gigi-focus flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold"
                >
                  Ouvrir mon Mission Command Center
                </Link>
                <Link
                  href="/actions"
                  className="gigi-btn-secondary gigi-focus flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium"
                >
                  Voir le flux d&apos;action
                </Link>
              </div>
              <OnboardingBetaChecklist />
              <Link
                href="/onboarding/setup"
                className="gigi-focus block text-center text-[13px] text-text-muted hover:text-text-secondary"
              >
                Configurer mes projets (assistant setup) →
              </Link>
            </div>
          )}
        </OnboardingStepCard>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="gigi-focus text-[13px] text-text-muted hover:text-text-secondary disabled:opacity-40"
          >
            Retour
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.min(ONBOARDING_GUIDE_STEPS.length - 1, i + 1))}
              className="gigi-btn-primary gigi-btn-primary-lg gigi-focus rounded-xl px-5 font-semibold"
            >
              Continuer
            </button>
          ) : (
            <Link
              href="/"
              className="gigi-btn-primary gigi-btn-primary-lg gigi-focus rounded-xl px-5 py-2.5 font-semibold"
            >
              C&apos;est parti
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4 text-[12.5px]">
          <Link href="/landing" className="gigi-focus text-text-muted hover:text-text-secondary">
            Présentation
          </Link>
          <Link href="/beta" className="gigi-focus text-text-muted hover:text-text-secondary">
            Checklist bêta
          </Link>
          <Link href="/" className="gigi-focus text-text-muted hover:text-text-secondary">
            Mission du jour
          </Link>
        </div>
      </div>
    </div>
  );
}
