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
import type { EnqueuePreparedActionInput, QueuedActionStatus } from "@/modules/actionQueue";
import {
  enqueueManyPreparedActions,
  enqueuePreparedAction,
  loadActionQueueState,
  saveActionQueueState,
  updateQueuedActionStatus,
  type ActionQueueState,
} from "@/modules/actionQueue";

interface ActionQueueContextValue {
  state: ActionQueueState;
  isHydrated: boolean;
  addToQueue: (input: EnqueuePreparedActionInput) => boolean;
  addManyToQueue: (inputs: EnqueuePreparedActionInput[]) => number;
  setStatus: (actionId: string, status: QueuedActionStatus) => void;
}

const ActionQueueContext = createContext<ActionQueueContextValue | null>(null);

export function ActionQueueProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ActionQueueState>({ actions: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(loadActionQueueState());
    setIsHydrated(true);
  }, []);

  const addToQueue = useCallback((input: EnqueuePreparedActionInput) => {
    let added = false;
    setState((prev) => {
      const next = enqueuePreparedAction(prev, input);
      added = next.actions.length > prev.actions.length;
      saveActionQueueState(next);
      return next;
    });
    return added;
  }, []);

  const addManyToQueue = useCallback((inputs: EnqueuePreparedActionInput[]) => {
    if (inputs.length === 0) return 0;
    let count = 0;
    setState((prev) => {
      const before = prev.actions.length;
      const next = enqueueManyPreparedActions(prev, inputs);
      count = next.actions.length - before;
      saveActionQueueState(next);
      return next;
    });
    return count;
  }, []);

  const setStatus = useCallback((actionId: string, status: QueuedActionStatus) => {
    setState((prev) => {
      const next = updateQueuedActionStatus(prev, actionId, status);
      saveActionQueueState(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      isHydrated,
      addToQueue,
      addManyToQueue,
      setStatus,
    }),
    [state, isHydrated, addToQueue, addManyToQueue, setStatus]
  );

  return <ActionQueueContext.Provider value={value}>{children}</ActionQueueContext.Provider>;
}

export function useActionQueue() {
  const ctx = useContext(ActionQueueContext);
  if (!ctx) {
    throw new Error("useActionQueue must be used within ActionQueueProvider");
  }
  return ctx;
}
