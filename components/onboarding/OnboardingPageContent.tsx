"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { GigiMark } from "@/components/brand/GigiMark";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  canAdvanceFromStep,
  getOnboardingConversationHref,
  getStepDefinition,
  GOAL_OPTIONS,
  ONBOARDING_MISSION_LOGIC,
  ONBOARDING_NOT_TODO,
  ONBOARDING_PROMISE,
  ONBOARDING_SIMULATION_NOTE,
  ONBOARDING_STEPS,
  ONBOARDING_TAGLINE,
  SUGGESTED_PROJECT_IDS,
  SUGGESTED_PROJECT_LABELS,
  WORK_STYLE_OPTIONS,
} from "@/modules/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingPageContent() {
  const router = useRouter();
  const {
    state,
    isHydrated,
    advanceOnboarding,
    goBackOnboarding,
    setOnboardingProjects,
    setOnboardingGoal,
    setOnboardingWorkStyle,
    generateAndApplyFirstMission,
    finishOnboarding,
  } = useGigi();

  const [customProjectInput, setCustomProjectInput] = useState("");
  const [customGoalInput, setCustomGoalInput] = useState("");

  if (!isHydrated || !state.onboarding) return null;

  const onboarding = state.onboarding;
  const step = getStepDefinition(onboarding.currentStep);
  const stepIndex = ONBOARDING_STEPS.findIndex((s) => s.id === step.id);
  const canAdvance = canAdvanceFromStep(onboarding, step.id);
  const isFirst = stepIndex === 0;
  const isLast = step.id === "first_mission";

  const toggleProject = (id: string) => {
    const selected = onboarding.selectedProjectIds.includes(id)
      ? onboarding.selectedProjectIds.filter((x) => x !== id)
      : [...onboarding.selectedProjectIds, id];
    setOnboardingProjects(selected, onboarding.customProjectNames);
  };

  const addCustomProject = () => {
    const name = customProjectInput.trim();
    if (!name) return;
    if (onboarding.customProjectNames.includes(name)) {
      setCustomProjectInput("");
      return;
    }
    setOnboardingProjects(onboarding.selectedProjectIds, [...onboarding.customProjectNames, name]);
    setCustomProjectInput("");
  };

  const removeCustomProject = (name: string) => {
    setOnboardingProjects(
      onboarding.selectedProjectIds,
      onboarding.customProjectNames.filter((n) => n !== name)
    );
  };

  const handleGenerateMission = () => {
    const ok = generateAndApplyFirstMission();
    if (ok) router.push("/");
  };

  const handleTalkToGigi = () => {
    finishOnboarding({ firstMissionGenerated: false });
    router.push(getOnboardingConversationHref(onboarding));
  };

  return (
    <div className="gigi-page-shell gigi-wizard-shell gigi-shell-glow animate-fade-in mx-auto">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content relative z-[1]">
        <div className="mb-6 flex items-start gap-2.5">
          <GigiMark size="sm" title="Gigi" className="mt-1.5 shrink-0" />
          <div>
            <p className="gigi-mission-control-label">Premiers pas</p>
            <h1 className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-text-primary">
              Bienvenue dans Gigi
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Étape {step.order} sur {ONBOARDING_STEPS.length} · {step.subtitle}
            </p>
          </div>
        </div>

        <div className="gigi-wizard-progress" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={ONBOARDING_STEPS.length}>
          {ONBOARDING_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "gigi-wizard-progress-seg",
                i <= stepIndex && "gigi-wizard-progress-seg-active"
              )}
              aria-hidden
            />
          ))}
        </div>

        <p className="mb-4 text-[11px] italic text-text-secondary">{ONBOARDING_SIMULATION_NOTE}</p>

        <div className="gigi-wizard-card">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="gigi-wizard-step-badge">{step.order}</span>
            <p className="text-[14px] font-semibold text-text-primary">{step.subtitle}</p>
          </div>

          {step.id === "welcome" && (
            <div className="space-y-4">
              <p className="text-[16px] font-medium leading-snug text-text-primary">
                {ONBOARDING_TAGLINE}
              </p>
              <p className="text-[13.5px] leading-relaxed text-text-secondary">{ONBOARDING_PROMISE}</p>
              <p className="text-[13px] leading-relaxed text-text-muted">{ONBOARDING_NOT_TODO}</p>
              <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-[13px] leading-relaxed text-text-muted">
                {ONBOARDING_MISSION_LOGIC}
              </p>
            </div>
          )}

          {step.id === "projects" && (
            <div className="space-y-4">
              <p className="text-[13.5px] text-text-secondary">
                Sélectionne tes projets principaux. Gigi s&apos;en servira pour choisir ta mission.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROJECT_IDS.map((id) => {
                  const active = onboarding.selectedProjectIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleProject(id)}
                      className={cn(
                        "gigi-focus gigi-onboarding-option text-[13px] transition-all",
                        active ? "gigi-selection-active" : "text-text-secondary"
                      )}
                    >
                      {SUGGESTED_PROJECT_LABELS[id]}
                    </button>
                  );
                })}
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium text-text-muted">Autre projet</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customProjectInput}
                    onChange={(e) => setCustomProjectInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomProject()}
                    placeholder="Nom du projet"
                    className="gigi-input-premium gigi-focus flex-1 rounded-lg px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={addCustomProject}
                    className="gigi-btn gigi-focus rounded-lg px-3 py-2 text-[13px] text-text-secondary"
                  >
                    Ajouter
                  </button>
                </div>
                {onboarding.customProjectNames.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {onboarding.customProjectNames.map((name) => (
                      <li
                        key={name}
                        className="flex items-center justify-between rounded-md bg-white/[0.03] px-2.5 py-1.5 text-[12.5px] text-text-secondary"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeCustomProject(name)}
                          className="gigi-focus text-text-muted hover:text-text-secondary"
                        >
                          Retirer
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {step.id === "goals" && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-text-secondary">
                Quel est ton objectif principal en ce moment ?
              </p>
              <div className="space-y-2">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setOnboardingGoal(option.id, option.id === "other" ? customGoalInput : undefined)
                    }
                    className={cn(
                      "gigi-focus gigi-onboarding-option w-full transition-all",
                      onboarding.primaryGoal === option.id
                        ? "gigi-selection-active"
                        : "text-text-secondary"
                    )}
                  >
                    <span className="text-[13px] font-medium text-text-primary">{option.label}</span>
                    <span className="mt-0.5 block text-[12px] text-text-muted">{option.hint}</span>
                  </button>
                ))}
              </div>
              {onboarding.primaryGoal === "other" && (
                <input
                  type="text"
                  value={customGoalInput}
                  onChange={(e) => {
                    setCustomGoalInput(e.target.value);
                    setOnboardingGoal("other", e.target.value);
                  }}
                  placeholder="Précise ton objectif"
                  className="gigi-input-premium gigi-focus w-full rounded-lg px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted"
                />
              )}
            </div>
          )}

          {step.id === "work_style" && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-text-secondary">
                Quel style de mission te convient le mieux ?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {WORK_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setOnboardingWorkStyle(option.id)}
                    className={cn(
                      "gigi-focus gigi-onboarding-option transition-all",
                      onboarding.workStyle === option.id
                        ? "gigi-selection-active"
                        : "text-text-secondary"
                    )}
                  >
                    <span className="text-[13px] font-medium text-text-primary">{option.label}</span>
                    <span className="mt-0.5 block text-[12px] text-text-muted">{option.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step.id === "first_mission" && (
            <div className="space-y-4">
              <p className="text-[13.5px] leading-relaxed text-text-secondary">
                Gigi peut générer ta première mission à partir de tes projets — localement, sans appel
                externe.
              </p>
              <p className="text-[12.5px] text-text-muted">
                {state.projects.length} projet{state.projects.length > 1 ? "s" : ""} configuré
                {state.projects.length > 1 ? "s" : ""}.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleGenerateMission}
                  className="gigi-btn-primary gigi-btn-primary-lg gigi-focus flex-1 rounded-xl font-semibold"
                >
                  Générer ma première mission
                </button>
                <button
                  type="button"
                  onClick={handleTalkToGigi}
                  className="gigi-btn gigi-focus rounded-xl px-4 py-2.5 text-[13px] text-text-secondary"
                >
                  Demander à Gigi
                </button>
              </div>
            </div>
          )}
        </div>

        {!isLast && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBackOnboarding}
              disabled={isFirst}
              className="gigi-focus text-[13px] text-text-muted hover:text-text-secondary disabled:opacity-40"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={advanceOnboarding}
              disabled={!canAdvance}
              className="gigi-btn-primary gigi-btn-primary-lg gigi-focus rounded-xl px-5 font-semibold disabled:opacity-40"
            >
              Continuer
            </button>
          </div>
        )}

        {isLast && (
          <div className="mt-5">
            <button
              type="button"
              onClick={goBackOnboarding}
              className="gigi-focus text-[13px] text-text-muted hover:text-text-secondary"
            >
              ← Retour
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <Link href="/" className="gigi-focus text-[12.5px] text-text-muted hover:text-text-secondary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
