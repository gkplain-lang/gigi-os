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
import { askGigi } from "@/modules/conversation/conversationBrain";

interface GigiContextValue {
  state: GigiLocalState;
  isHydrated: boolean;
  startMission: () => void;
  completeMission: () => void;
  postponeMission: () => void;
  rejectMission: () => void;
  resetLocalData: () => void;
  applyRecommendedMission: (mission: Mission) => void;
  applyNextMission: () => boolean;
  hasNextMission: () => boolean;
  getDecision: () => ReturnType<typeof explainDecisionFromProjects>;
  getMissionProjectLabel: (projectId: string) => string | undefined;
}

const GigiContext = createContext<GigiContextValue | null>(null);

const MISSION_STATUS_LABELS: Record<string, string> = {
  in_progress: "Mission en cours",
  completed: "Mission terminée",
  postponed: "Reporté",
  rejected_for_now: "Pas maintenant",
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

  const startMission = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mission: { ...prev.mission, status: "in_progress" },
      history: [
        createHistoryEntry(
          "mission_started",
          `Mission démarrée : ${prev.mission.title.replace(/\.$/, "")}.`
        ),
        ...prev.history,
      ],
    }));
  }, [updateState]);

  const completeMission = useCallback(() => {
    updateState((prev) => {
      const alreadyCompleted = prev.completedMissionIds.includes(prev.mission.id);
      return {
        ...prev,
        mission: { ...prev.mission, status: "completed" },
        completedMissionIds: alreadyCompleted
          ? prev.completedMissionIds
          : [...prev.completedMissionIds, prev.mission.id],
        projects: prev.projects.map((p) =>
          p.id === prev.mission.projectId ? { ...p } : p
        ),
        history: [
          createHistoryEntry(
            "mission_completed",
            `Mission terminée : ${prev.mission.title.replace(/\.$/, "")}.`
          ),
          ...prev.history,
        ],
      };
    });
  }, [updateState]);

  const postponeMission = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mission: { ...prev.mission, status: "postponed" },
      postponedMissionIds: [...prev.postponedMissionIds, prev.mission.id],
      history: [
        createHistoryEntry("mission_postponed", "Mission reportée."),
        ...prev.history,
      ],
    }));
  }, [updateState]);

  const rejectMission = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mission: { ...prev.mission, status: "rejected_for_now" },
      rejectedMissionIds: [...prev.rejectedMissionIds, prev.mission.id],
      history: [
        createHistoryEntry("mission_rejected", "Mission refusée pour maintenant."),
        ...prev.history,
      ],
    }));
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
    (mission: Mission) => {
      updateState((prev) => ({
        ...prev,
        mission: { ...mission, status: "recommended" },
        history: [
          createHistoryEntry(
            "decision_created",
            `Gigi a recommandé : ${mission.title.replace(/\.$/, "")}.`
          ),
          ...prev.history,
        ],
      }));
    },
    [updateState]
  );

  // Reuses the existing deterministic brain to pick the next available mission
  // (completed ones are already excluded by askGigi). Pure composition — no logic change.
  const applyNextMission = useCallback(() => {
    let applied = false;
    updateState((prev) => {
      const res = askGigi("Quelle est la prochaine mission ?", prev.projects, {
        completedMissionIds: prev.completedMissionIds,
      });
      if (!res.mission) return prev;
      applied = true;
      return {
        ...prev,
        mission: { ...res.mission, status: "recommended" },
        history: [
          createHistoryEntry(
            "decision_created",
            `Gigi a recommandé : ${res.mission.title.replace(/\.$/, "")}.`
          ),
          ...prev.history,
        ],
      };
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
      if (state.mission.status === "recommended") return undefined;
      return MISSION_STATUS_LABELS[state.mission.status];
    },
    [state.mission]
  );

  const value = useMemo(
    () => ({
      state,
      isHydrated,
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
    }),
    [
      state,
      isHydrated,
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
    ]
  );

  return <GigiContext.Provider value={value}>{children}</GigiContext.Provider>;
}

export function useGigi() {
  const ctx = useContext(GigiContext);
  if (!ctx) throw new Error("useGigi must be used within GigiProvider");
  return ctx;
}
