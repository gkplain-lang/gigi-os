"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { Mission } from "@/modules/missions/missionTypes";
import { createInitialState } from "@/modules/storage/initialState";
import { loadState, saveState } from "@/modules/storage/localStorage";
import { createHistoryEntry } from "@/modules/history/historyUtils";
import { explainDecisionFromProjects } from "@/modules/decision-engine/runDecisionEngine";
import {
  applyCompleteMissionState,
  applyDismissMissionState,
  applyPostponeMissionState,
  applyPrepareNextMissionState,
  applyRecommendedMissionState,
  applyStartMissionState,
  buildExecutionSnapshot,
  missionStatusToPhase,
  type MissionExecutionHints,
} from "@/modules/missionExecution";
import type { MissionExecutionSnapshot } from "@/modules/missionExecution";
import { askGigi } from "@/modules/conversation/conversationBrain";
import type { OnboardingGoalId, WorkStyleId } from "@/modules/onboarding/types";
import {
  advanceOnboardingStep,
  completeOnboarding,
  generateFirstMissionForState,
  goBackOnboardingStep,
  isOnboardingComplete,
  resetOnboardingState,
  updateOnboardingGoal,
  updateOnboardingProjects,
  updateOnboardingWorkStyle,
} from "@/modules/onboarding/onboardingState";

interface GigiContextValue {
  state: GigiLocalState;
  isHydrated: boolean;
  isOnboardingComplete: boolean;
  execution: MissionExecutionSnapshot;
  startMission: () => void;
  completeMission: () => void;
  postponeMission: () => void;
  rejectMission: () => void;
  resetLocalData: () => void;
  applyRecommendedMission: (mission: Mission, hints?: MissionExecutionHints | null) => void;
  applyNextMission: () => boolean;
  hasNextMission: () => boolean;
  getDecision: () => ReturnType<typeof explainDecisionFromProjects>;
  getMissionProjectLabel: (projectId: string) => string | undefined;
  advanceOnboarding: () => void;
  goBackOnboarding: () => void;
  setOnboardingProjects: (selectedIds: string[], customNames: string[]) => void;
  setOnboardingGoal: (goal: OnboardingGoalId | null, customGoal?: string) => void;
  setOnboardingWorkStyle: (style: WorkStyleId | null) => void;
  generateAndApplyFirstMission: () => boolean;
  finishOnboarding: (options?: { firstMissionGenerated?: boolean }) => void;
  resetOnboarding: () => void;
}

const GigiContext = createContext<GigiContextValue | null>(null);

const PHASE_LABELS: Record<string, string> = {
  proposed: "Mission proposée",
  active: "Mission en cours",
  completed: "Mission terminée",
  postponed: "Reportée",
  dismissed: "Pas maintenant",
};

function persist(next: GigiLocalState) {
  saveState(next);
  return next;
}

export function GigiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GigiLocalState>(createInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setIsHydrated(true);
  }, []);

  const updateState = useCallback((updater: (prev: GigiLocalState) => GigiLocalState) => {
    setState((prev) => persist(updater(prev)));
  }, []);

  const execution = useMemo(() => buildExecutionSnapshot(state), [state]);

  const startMission = useCallback(() => {
    updateState((prev) => applyStartMissionState(prev));
  }, [updateState]);

  const completeMission = useCallback(() => {
    updateState((prev) => applyCompleteMissionState(prev));
  }, [updateState]);

  const postponeMission = useCallback(() => {
    updateState((prev) => applyPostponeMissionState(prev));
  }, [updateState]);

  const rejectMission = useCallback(() => {
    updateState((prev) => applyDismissMissionState(prev));
  }, [updateState]);

  const resetLocalData = useCallback(() => {
    const initial = createInitialState();
    const next: GigiLocalState = {
      ...initial,
      history: [
        createHistoryEntry(
          "data_reset",
          "Données locales réinitialisées.",
          "Gigi est revenu à l'état initial."
        ),
        ...initial.history,
      ],
    };
    saveState(next);
    setState(next);
  }, []);

  const applyRecommendedMission = useCallback(
    (mission: Mission, hints?: MissionExecutionHints | null) => {
      updateState((prev) => applyRecommendedMissionState(prev, mission, hints));
    },
    [updateState]
  );

  const applyNextMission = useCallback(() => {
    let applied = false;
    updateState((prev) => {
      const result = applyPrepareNextMissionState(prev);
      applied = result.applied;
      return result.state;
    });
    return applied;
  }, [updateState]);

  const hasNextMission = useCallback(() => {
    const res = askGigi("Quelle est la prochaine mission ?", state.projects, {
      completedMissionIds: state.completedMissionIds,
    });
    return !!res.mission;
  }, [state.projects, state.completedMissionIds]);

  const getDecision = useCallback(() => explainDecisionFromProjects(state.projects), [state.projects]);

  const getMissionProjectLabel = useCallback(
    (projectId: string) => {
      if (projectId !== state.mission.projectId) return undefined;
      const phase = missionStatusToPhase(state.mission.status);
      if (phase === "proposed") return undefined;
      return PHASE_LABELS[phase];
    },
    [state.mission]
  );

  const advanceOnboarding = useCallback(() => {
    updateState((prev) => advanceOnboardingStep(prev));
  }, [updateState]);

  const goBackOnboarding = useCallback(() => {
    updateState((prev) => goBackOnboardingStep(prev));
  }, [updateState]);

  const setOnboardingProjects = useCallback(
    (selectedIds: string[], customNames: string[]) => {
      updateState((prev) => updateOnboardingProjects(prev, selectedIds, customNames));
    },
    [updateState]
  );

  const setOnboardingGoal = useCallback(
    (goal: OnboardingGoalId | null, customGoal?: string) => {
      updateState((prev) => updateOnboardingGoal(prev, goal, customGoal));
    },
    [updateState]
  );

  const setOnboardingWorkStyle = useCallback(
    (style: WorkStyleId | null) => {
      updateState((prev) => updateOnboardingWorkStyle(prev, style));
    },
    [updateState]
  );

  const generateAndApplyFirstMission = useCallback(() => {
    let applied = false;
    updateState((prev) => {
      const mission = generateFirstMissionForState(prev);
      if (!mission) return prev;
      applied = true;
      const withMission = applyRecommendedMissionState(prev, mission);
      return completeOnboarding(withMission, { firstMissionGenerated: true });
    });
    return applied;
  }, [updateState]);

  const finishOnboarding = useCallback(
    (options?: { firstMissionGenerated?: boolean }) => {
      updateState((prev) => completeOnboarding(prev, options));
    },
    [updateState]
  );

  const resetOnboarding = useCallback(() => {
    updateState((prev) => resetOnboardingState(prev));
  }, [updateState]);

  const onboardingComplete = isHydrated && isOnboardingComplete(state);

  const value = useMemo(
    () => ({
      state,
      isHydrated,
      isOnboardingComplete: onboardingComplete,
      execution,
      startMission,
      completeMission,
      postponeMission,
      rejectMission,
      resetLocalData,
      applyRecommendedMission,
      applyNextMission,
      hasNextMission,
      getDecision,
      getMissionProjectLabel,
      advanceOnboarding,
      goBackOnboarding,
      setOnboardingProjects,
      setOnboardingGoal,
      setOnboardingWorkStyle,
      generateAndApplyFirstMission,
      finishOnboarding,
      resetOnboarding,
    }),
    [
      state,
      isHydrated,
      onboardingComplete,
      execution,
      startMission,
      completeMission,
      postponeMission,
      rejectMission,
      resetLocalData,
      applyRecommendedMission,
      applyNextMission,
      hasNextMission,
      getDecision,
      getMissionProjectLabel,
      advanceOnboarding,
      goBackOnboarding,
      setOnboardingProjects,
      setOnboardingGoal,
      setOnboardingWorkStyle,
      generateAndApplyFirstMission,
      finishOnboarding,
      resetOnboarding,
    ]
  );

  return <GigiContext.Provider value={value}>{children}</GigiContext.Provider>;
}

export function useGigi() {
  const ctx = useContext(GigiContext);
  if (!ctx) throw new Error("useGigi must be used within GigiProvider");
  return ctx;
}
