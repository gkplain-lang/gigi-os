"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUp, Check, RefreshCw } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { GigiMark } from "@/components/brand/GigiMark";
import { AiEngineBadge } from "@/components/ai/AiEngineBadge";
import { askAiBrain, aiBrainToGigiResponse, tryBuildAiMemoryContext, useAiAvailability } from "@/modules/ai";
import type { AiBrainMode } from "@/modules/ai";
import { useMemoryStatus } from "@/modules/memory";
import type {
  ConversationContext,
  ConversationExchange,
} from "@/modules/conversation/conversationTypes";
import {
  CONVERSATION_PLACEHOLDER,
  CONVERSATION_PROMPT_CHIPS,
  CONVERSATION_PROPOSAL_EMPTY,
} from "@/modules/dailyUse";
import {
  CONVERSATION_LABELS,
  REFINED_EMPTY_STATES,
  REFINED_PAGE_META,
  SIMULATION_NOTE,
} from "@/modules/dailyUseRefinement";
import { GigiAnswer } from "./GigiAnswer";

const PROMPT_CHIPS = [...CONVERSATION_PROMPT_CHIPS];

export function ConversationPageContent() {
  const { state, isHydrated, applyRecommendedMission } = useGigi();
  const { isAiConfigured } = useAiAvailability();
  const { memoryStatus } = useMemoryStatus();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState<ConversationExchange[]>([]);
  const [brainMode, setBrainMode] = useState<AiBrainMode>("local_only");
  const [asking, setAsking] = useState(false);
  const prefilledAsk = useRef(false);

  const ask = useCallback(
    async (objective: string, contextOverride?: ConversationContext) => {
      const trimmed = objective.trim();
      if (!trimmed || asking) return;

      const context: ConversationContext = {
        currentMissionId: state.mission.id,
        currentProjectId: state.mission.projectId,
        completedMissionIds: state.completedMissionIds,
        ...contextOverride,
      };

      setAsking(true);

      const memoryContext = tryBuildAiMemoryContext({
        localState: state,
        memoryStatus,
      });

      const aiResult = await askAiBrain(
        {
          userMessage: trimmed,
          currentMission: state.mission,
          projects: state.projects,
          history: state.history.map((h) => ({
            title: h.title,
            type: h.type,
            date: h.date,
          })),
          memoryStatus: {
            mode: memoryStatus.mode,
            label: memoryStatus.label,
            lastBackupAt: memoryStatus.lastBackupAt,
          },
          completedMissionIds: state.completedMissionIds,
          postponedMissionIds: state.postponedMissionIds,
          rejectedMissionIds: state.rejectedMissionIds,
          conversationContext: context,
          memoryContext,
          historyEvents: state.history,
          executionHints: state.executionHints ?? null,
        },
        { preferLocal: !isAiConfigured }
      );

      setBrainMode(aiResult.mode);
      const response = aiBrainToGigiResponse(aiResult);

      setExchanges((prev) => [
        ...prev,
        {
          id: `x-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          objective: trimmed,
          response,
          applied: false,
        },
      ]);
      setInput("");
      setAsking(false);
    },
    [asking, isAiConfigured, memoryStatus, state]
  );

  useEffect(() => {
    if (!isHydrated || prefilledAsk.current) return;
    const askParam = searchParams.get("ask")?.trim();
    if (!askParam) return;
    prefilledAsk.current = true;
    void ask(askParam);
  }, [ask, isHydrated, searchParams]);

  if (!isHydrated) return null;

  const latest = exchanges[exchanges.length - 1];

  const applyLatest = () => {
    if (!latest?.response.mission) return;
    applyRecommendedMission(latest.response.mission, {
      tasks: latest.response.tasks,
      nextStep: latest.response.nextStep ?? null,
      reason: latest.response.why ?? null,
    });
    setExchanges((prev) =>
      prev.map((x) => (x.id === latest.id ? { ...x, applied: true } : x))
    );
  };

  const alternativeLatest = () => {
    if (!latest) return;
    void ask("Propose autre chose", {
      excludeMissionId: latest.response.mission?.id,
      excludeProjectId: latest.response.mission?.projectId,
    });
  };

  const proposalPanel = (
    <div
      className={
        latest?.response.mission
          ? "gigi-mission-proposal p-5"
          : "gigi-command-card rounded-xl p-5"
      }
    >
      <p className="gigi-mission-control-label">{CONVERSATION_LABELS.proposalTitle}</p>
      {latest?.response.mission ? (
        <>
          <p className="mt-2 text-[12px] font-medium text-accent-soft/85">
            {latest.response.priorityProjectName}
          </p>
          <p className="mt-1.5 text-[16px] font-semibold leading-snug text-text-primary">
            {latest.response.mission.title}
          </p>

          {latest.applied ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[rgba(155,181,159,0.4)] bg-[rgba(155,181,159,0.12)] px-3 py-2.5 text-[13.5px] text-text-secondary">
              <Check className="h-4 w-4 text-ok" strokeWidth={2.4} />
              Mission appliquée
              <Link href="/" className="ml-auto text-accent-soft hover:underline">
                Voir
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {latest.response.tasks?.[0] && (
                <p className="text-[12.5px] leading-relaxed text-text-muted">
                  Première tâche :{" "}
                  <span className="text-text-secondary">{latest.response.tasks[0]}</span>
                </p>
              )}
              <p className="text-[11.5px] text-text-muted/80">{CONVERSATION_LABELS.applyHint}</p>
              <button
                type="button"
                onClick={applyLatest}
                className="gigi-btn-primary gigi-focus w-full rounded-lg px-4 py-2.5 text-[14px] font-medium"
              >
                {CONVERSATION_LABELS.applyMission}
              </button>
              <button
                type="button"
                onClick={alternativeLatest}
                className="gigi-btn gigi-focus inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Propose autre chose
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">
          {CONVERSATION_PROPOSAL_EMPTY}
        </p>
      )}
    </div>
  );

  return (
    <div className="gigi-page-shell gigi-shell-glow animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content relative z-[1]">
        <PageHeader
          title="Gigi"
          meta={REFINED_PAGE_META.conversation}
          right={<AiEngineBadge mode={brainMode} />}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="gigi-assistant-panel">
            <div className="gigi-assistant-header">
              <GigiMark size="sm" title="Gigi" className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                  Copilote de décision
                </p>
                <p className="mt-0.5 text-[12.5px] text-text-secondary" title={SIMULATION_NOTE.long}>
                  {SIMULATION_NOTE.short}
                </p>
              </div>
            </div>

            {exchanges.length === 0 && (
              <div className="gigi-assistant-prompt-zone">
                <p className="text-[15px] font-medium text-text-primary">
                  {REFINED_EMPTY_STATES.conversation.title}
                </p>
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-text-secondary">
                  {REFINED_EMPTY_STATES.conversation.body}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => void ask(chip)}
                      className="gigi-premium-chip gigi-focus"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {exchanges.length > 0 && (
              <div className="space-y-8 px-4 py-5 md:px-6">
                {exchanges.map((exchange) => (
                  <div key={exchange.id} className="space-y-4">
                    <div className="flex justify-end">
                      <p className="max-w-lg rounded-2xl rounded-tr-md border border-[rgba(124,140,255,0.42)] bg-[rgba(124,140,255,0.2)] px-4 py-2.5 text-[14px] leading-relaxed text-text-primary shadow-[0_0_24px_-12px_rgba(124,140,255,0.5)]">
                        {exchange.objective}
                      </p>
                    </div>
                    <GigiAnswer response={exchange.response} onChoice={(p) => ask(p)} />
                  </div>
                ))}
              </div>
            )}

            {latest?.response.mission && !latest.applied && (
              <div className="border-t border-border px-4 py-4 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyLatest}
                    className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2.5 text-[14px] font-medium"
                  >
                    Appliquer cette mission
                  </button>
                  <button
                    type="button"
                    onClick={alternativeLatest}
                    className="gigi-btn gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Propose autre chose
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-border p-4 md:p-5">
              <div className="gigi-input-premium flex items-end gap-2 rounded-2xl p-2 pl-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  rows={exchanges.length === 0 ? 2 : 1}
                  placeholder={CONVERSATION_PLACEHOLDER}
                  className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void ask(input)}
                  disabled={!input.trim() || asking}
                  aria-label="Envoyer à Gigi"
                  className="gigi-btn-primary gigi-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                >
                  <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.4} />
                </button>
              </div>
              {exchanges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => void ask(chip)}
                      className="gigi-premium-chip gigi-focus text-[12px] !py-1.5 !px-3"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-3">
              {proposalPanel}
              <p className="px-1 text-[11px] leading-relaxed text-text-muted">
                Gigi propose une mission à partir de ton contexte local — tu restes aux commandes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
