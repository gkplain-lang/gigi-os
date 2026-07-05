"use client";

import { MissionCard } from "@/components/mission/MissionCard";
import { MissionSidebar } from "@/components/mission/MissionSidebar";
import { MissionDone } from "@/components/mission/MissionDone";
import { TaskChecklist } from "@/components/mission/TaskChecklist";
import { DailyUseStrip } from "@/components/daily/DailyUseStrip";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { useGigi } from "@/components/providers/GigiProvider";
import { askGigi } from "@/modules/conversation/conversationBrain";
import { getRefinedMissionPageMeta } from "@/modules/dailyUseRefinement";
import { MissionFeedbackPanel } from "@/components/missionFeedback/MissionFeedbackPanel";
import { MissionDecisionCenter } from "@/components/missionDecision/MissionDecisionCenter";
import { MissionCommandCenter } from "@/components/missionOS/MissionCommandCenter";
import { MissionLearningPanel } from "@/components/missionOS/MissionLearningPanel";
import { MissionDiscoveryStrip } from "@/components/mission/MissionDiscoveryStrip";
import { ExecutionReadinessHomeHint } from "@/components/executionReadiness/ExecutionReadinessHomeHint";
import { GigiExecutionVisibilityPanel } from "@/components/executionExperience/GigiExecutionVisibilityPanel";
import { V4ExecutionJourney } from "@/components/executionExperience/V4ExecutionJourney";
import { GigiCapabilityDemoStrip } from "@/components/executionExperience/GigiCapabilityDemoStrip";
import { GuidedActionHomeStrip } from "@/components/guidedActionFlow/GuidedActionHomeStrip";
import { MissionComposerHomePanel } from "@/components/missionComposer/MissionComposerHomePanel";
import { MissionReviewHomePanel } from "@/components/missionReview/MissionReviewHomePanel";
import {
  MissionFocusHero,
  NextActionCard,
  ReviewPromptCard,
  ProjectMomentumStrip,
  AdvancedModulesCompact,
} from "@/components/mvpPolish";
import { buildMissionLearningViewModel } from "@/modules/missionOS";
import { useMemo } from "react";

const STATUS_BADGE: Record<string, string> = {
  recommended: "Recommandée",
  in_progress: "En cours",
  completed: "Terminée",
  postponed: "Reportée",
  rejected_for_now: "Pas maintenant",
};

export function MissionPageContent() {
  const {
    state,
    isHydrated,
    isOnboardingComplete,
    execution,
    startMission,
    completeMission,
    postponeMission,
    rejectMission,
    applyNextMission,
    getDecision,
  } = useGigi();

  const missionOSInput = useMemo(
    () => ({
      missionTitle: state.mission.title,
      missionSummary: state.mission.reason,
      missionId: state.mission.id,
      projectId: state.mission.projectId,
      projectName: state.mission.projectName,
      missionStatus: state.mission.status,
      missionConfidence: state.mission.confidence,
      missionImpact: state.mission.expectedImpact,
    }),
    [
      state.mission.id,
      state.mission.title,
      state.mission.reason,
      state.mission.projectId,
      state.mission.projectName,
      state.mission.status,
      state.mission.confidence,
      state.mission.expectedImpact,
    ]
  );

  const decisionSlot = (
    <MissionDecisionCenter
      completedMissionIds={state.completedMissionIds}
      currentMissionId={state.mission.id}
      currentProjectId={state.mission.projectId}
    />
  );

  const learningViewModel = useMemo(
    () =>
      buildMissionLearningViewModel({
        projectId: state.mission.projectId,
        completedMissionIds: state.completedMissionIds,
      }),
    [state.mission.projectId, state.completedMissionIds]
  );

  if (!isHydrated) return null;

  const { mission } = state;
  const tasks = execution.tasks;
  const active = mission.status === "recommended" || mission.status === "in_progress";
  const projects = state.projects.map((p) => ({ id: p.id, name: p.name }));

  const badge = (
    <span className="rounded-full border border-[rgba(124,140,255,0.45)] bg-[rgba(124,140,255,0.18)] px-3 py-1 text-[12px] font-semibold text-accent-soft shadow-[0_0_16px_-4px_rgba(124,140,255,0.6)]">
      {STATUS_BADGE[mission.status]}
    </span>
  );

  // V5.0 — cockpit mission-first : mission du jour, prochaine action, revue, projets.
  const cockpit = (
    <div className="mb-6 space-y-4">
      <MissionComposerHomePanel projects={projects} />
      <div className="grid gap-4 lg:grid-cols-2">
        <NextActionCard />
        <ReviewPromptCard />
      </div>
      <MissionReviewHomePanel />
      <ProjectMomentumStrip projects={projects} />
    </div>
  );

  // V5.0 — modules techniques regroupés et repliés par défaut.
  const advancedModules = (
    <AdvancedModulesCompact className="mb-6">
      <GigiExecutionVisibilityPanel />
      <V4ExecutionJourney />
      <GigiCapabilityDemoStrip />
      <GuidedActionHomeStrip
        missionId={state.mission.id}
        missionTitle={state.mission.title}
        projectId={state.mission.projectId}
        projectName={state.mission.projectName}
      />
      <MissionDiscoveryStrip />
      <MissionCommandCenter input={missionOSInput} decisionSlot={decisionSlot} />
      <ExecutionReadinessHomeHint />
      <MissionLearningPanel viewModel={learningViewModel} />
    </AdvancedModulesCompact>
  );

  if (mission.status === "completed") {
    const next = askGigi("Quelle est la prochaine mission ?", state.projects, {
      completedMissionIds: state.completedMissionIds,
    });
    return (
      <div className="gigi-shell-glow animate-fade-in">
        <div className="relative z-[1]">
          <MissionFocusHero meta={getRefinedMissionPageMeta("completed")} right={badge} />
          {!isOnboardingComplete && <OnboardingBanner />}
          <DailyUseStrip />
          {cockpit}
          <MissionDone
            completedTitle={mission.title}
            nextTitle={next.mission?.title}
            onNext={applyNextMission}
          />
          {advancedModules}
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="gigi-shell-glow animate-fade-in">
        <div className="relative z-[1]">
          <MissionFocusHero meta={getRefinedMissionPageMeta(mission.status)} right={badge} />
          {!isOnboardingComplete && <OnboardingBanner />}
          <DailyUseStrip />
          {cockpit}
          <div className="gigi-mission-control relative max-w-3xl">
            <div className="gigi-mission-spotlight" aria-hidden />
            <div className="relative z-[1]">
              <MissionCard
                mission={mission}
                onStart={startMission}
                onComplete={completeMission}
                onPostpone={postponeMission}
                onReject={rejectMission}
              />
            </div>
          </div>
          {advancedModules}
        </div>
      </div>
    );
  }

  const ignored = getDecision().alternatives.slice(0, 3);
  const meta = getRefinedMissionPageMeta(mission.status);

  return (
    <div className="gigi-shell-glow animate-fade-in">
      <div className="relative z-[1]">
        <MissionFocusHero meta={meta} right={badge} />

        {!isOnboardingComplete && <OnboardingBanner />}
        <DailyUseStrip />

        <div className="mb-6 gigi-mission-control grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="relative space-y-4">
            <div className="gigi-mission-spotlight" aria-hidden />
            <div className="relative z-[1]">
              <MissionCard
                mission={mission}
                onStart={startMission}
                onComplete={completeMission}
                onPostpone={postponeMission}
                onReject={rejectMission}
              />
            </div>
            <TaskChecklist
              tasks={tasks}
              title={mission.status === "in_progress" ? "Tes étapes" : "Tes 3 tâches"}
            />
            <MissionFeedbackPanel
              missionId={mission.id}
              projectId={mission.projectId}
              missionTitle={mission.title}
              showTopScores={false}
            />
          </div>

          <MissionSidebar mission={mission} ignored={ignored} />
        </div>

        {cockpit}
        {advancedModules}
      </div>
    </div>
  );
}
