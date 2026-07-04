"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { MissionCard } from "@/components/mission/MissionCard";
import { MissionSidebar } from "@/components/mission/MissionSidebar";
import { MissionDone } from "@/components/mission/MissionDone";
import { TaskChecklist } from "@/components/mission/TaskChecklist";
import { DailyUseStrip } from "@/components/daily/DailyUseStrip";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { useGigi } from "@/components/providers/GigiProvider";
import { askGigi } from "@/modules/conversation/conversationBrain";
import { getRefinedMissionPageMeta } from "@/modules/dailyUseRefinement";

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

  if (!isHydrated) return null;

  const { mission } = state;
  const tasks = execution.tasks;
  const active = mission.status === "recommended" || mission.status === "in_progress";

  const badge = (
    <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-[12px] text-text-secondary">
      {STATUS_BADGE[mission.status]}
    </span>
  );

  // Completed — active guiding screen
  if (mission.status === "completed") {
    const next = askGigi("Quelle est la prochaine mission ?", state.projects, {
      completedMissionIds: state.completedMissionIds,
    });
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Mission du jour"
          meta={getRefinedMissionPageMeta("completed")}
          right={badge}
        />
        {!isOnboardingComplete && <OnboardingBanner />}
        <DailyUseStrip />
        <MissionDone
          completedTitle={mission.title}
          nextTitle={next.mission?.title}
          onNext={applyNextMission}
        />
      </div>
    );
  }

  // Postponed / rejected
  if (!active) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Mission du jour" meta={getRefinedMissionPageMeta(mission.status)} right={badge} />
        {!isOnboardingComplete && <OnboardingBanner />}
        <DailyUseStrip />
        <div className="max-w-2xl">
          <MissionCard
            mission={mission}
            onStart={startMission}
            onComplete={completeMission}
            onPostpone={postponeMission}
            onReject={rejectMission}
          />
        </div>
      </div>
    );
  }

  const ignored = getDecision().alternatives.slice(0, 3);
  const meta = getRefinedMissionPageMeta(mission.status);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Mission du jour" meta={meta} right={badge} />
      {!isOnboardingComplete && <OnboardingBanner />}
      <DailyUseStrip />

      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          <MissionCard
            mission={mission}
            onStart={startMission}
            onComplete={completeMission}
            onPostpone={postponeMission}
            onReject={rejectMission}
          />
          <TaskChecklist tasks={tasks} title={mission.status === "in_progress" ? "Tes étapes" : "Tes 3 tâches"} />
        </div>

        <div className="lg:col-span-1">
          <MissionSidebar mission={mission} ignored={ignored} />
        </div>
      </div>
    </div>
  );
}
