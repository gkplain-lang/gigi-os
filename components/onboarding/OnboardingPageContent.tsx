"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
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
  type OnboardingGoalId,
  type WorkStyleId,
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
    <div className="animate-fade-in mx-auto max-w-xl">
      <PageHeader
        title="Premiers pas"
        meta={`Étape ${step.order} sur ${ONBOARDING_STEPS.length} · ${step.subtitle}`}
      />

      <div className="mb-5 flex gap-1.5">
        {ONBOARDING_STEPS.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= stepIndex ? "bg-accent" : "bg-border"
            )}
            aria-hidden
          />
        ))}
      </div>

      <p className="mb-4 text-[11px] text-text-muted italic">{ONBOARDING_SIMULATION_NOTE}</p>

      <div className="gigi-panel rounded-xl p-5">
        {step.id === "welcome" && (
          <div className="space-y-4">
            <p className="text-[15px] font-medium leading-snug text-text-primary">
              {ONBOARDING_TAGLINE}
            </p>
            <p className="text-[13.5px] leading-relaxed text-text-secondary">{ONBOARDING_PROMISE}</p>
            <p className="text-[13px] leading-relaxed text-text-muted">{ONBOARDING_NOT_TODO}</p>
            <p className="text-[13px] leading-relaxed text-text-muted">{ONBOARDING_MISSION_LOGIC}</p>
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
                      "gigi-focus rounded-lg border px-3 py-2 text-[13px] transition-colors",
                      active
                        ? "border-accent/50 bg-accent-dim text-text-primary"
                        : "border-border bg-surface text-text-secondary hover:border-border-hover"
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
                  className="gigi-focus flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={addCustomProject}
                  className="gigi-focus rounded-lg border border-border px-3 py-2 text-[13px] text-text-secondary hover:bg-white/[0.03]"
                >
                  Ajouter
                </button>
              </div>
              {onboarding.customProjectNames.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {onboarding.customProjectNames.map((name) => (
                    <li
                      key={name}
                      className="flex items-center justify-between rounded-md bg-surface/60 px-2.5 py-1.5 text-[12.5px] text-text-secondary"
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
                  onClick={() => setOnboardingGoal(option.id, option.id === "other" ? customGoalInput : undefined)}
                  className={cn(
                    "gigi-focus w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                    onboarding.primaryGoal === option.id
                      ? "border-accent/50 bg-accent-dim"
                      : "border-border bg-surface hover:border-border-hover"
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
                className="gigi-focus w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted"
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
                    "gigi-focus rounded-lg border px-3 py-2.5 text-left transition-colors",
                    onboarding.workStyle === option.id
                      ? "border-accent/50 bg-accent-dim"
                      : "border-border bg-surface hover:border-border-hover"
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
                className="gigi-focus rounded-lg bg-accent px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
              >
                Générer ma première mission
              </button>
              <button
                type="button"
                onClick={handleTalkToGigi}
                className="gigi-focus rounded-lg border border-border px-4 py-2.5 text-[13px] text-text-secondary hover:bg-white/[0.03]"
              >
                Demander à Gigi
              </button>
            </div>
          </div>
        )}
      </div>

      {!isLast && (
        <div className="mt-5 flex items-center justify-between gap-3">
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
            className="gigi-focus rounded-lg bg-accent px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
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
  );
}
