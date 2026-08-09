"use client";

import { use, useEffect, useState } from "react";
import { useGetAttemptQuery, useGetNextTurnMutation } from "@/services/api/diagnosticApi";
import { AdaptiveQuestionForm } from "@/features/diagnostics/AdaptiveQuestionForm";
import { ProcessingState } from "@/features/diagnostics/ProcessingState";
import { ResultView } from "@/features/diagnostics/ResultView";
import { getApiErrorMessage } from "@/lib/errors";
import type { DiagnosticAttempt } from "@/types/api";

export default function DiagnosticAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const attemptId = Number(id);
  const invalidId = Number.isNaN(attemptId) || id === "demo";
  const [phase, setPhase] = useState<"form" | "processing" | "result">("form");
  const [localAttempt, setLocalAttempt] = useState<DiagnosticAttempt | null>(null);
  const [nextError, setNextError] = useState<string | null>(null);
  const [fetchNextTurn, { isLoading: loadingNext }] = useGetNextTurnMutation();

  const {
    data: attempt,
    error,
    isLoading,
    refetch,
  } = useGetAttemptQuery(attemptId, {
    skip: invalidId,
    pollingInterval: !invalidId && phase === "processing" ? 2500 : 0,
  });

  const current = localAttempt ?? attempt ?? null;

  useEffect(() => {
    if (!attempt) return;
    setLocalAttempt(attempt);
    if (attempt.status === "COMPLETED") {
      setPhase("result");
    } else if (
      attempt.status === "SUBMITTED" ||
      attempt.status === "PROCESSING"
    ) {
      setPhase("processing");
    } else if (attempt.status === "FAILED") {
      setPhase("result");
    } else {
      setPhase("form");
    }
  }, [attempt]);

  // If attempt is in progress but has no active turn yet, ask the API to generate one.
  useEffect(() => {
    if (!current || current.status !== "IN_PROGRESS") return;
    if (current.active_turn) return;
    if (loadingNext || nextError) return;

    let cancelled = false;
    (async () => {
      try {
        const next = await fetchNextTurn(current.id).unwrap();
        if (!cancelled) setLocalAttempt(next);
      } catch (err) {
        if (!cancelled) {
          setNextError(
            getApiErrorMessage(err, "Could not generate the next AI question."),
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.id, current?.status, current?.active_turn, fetchNextTurn, loadingNext, nextError]);

  if (invalidId) {
    return (
      <p className="p-6 text-sm text-error">
        Invalid diagnostic attempt. Start again from Begin Diagnostic.
      </p>
    );
  }

  if (isLoading && !current) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        Loading your adaptive assessment…
      </p>
    );
  }

  if ((error && !current) || !current) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-error">{getApiErrorMessage(error)}</p>
      </div>
    );
  }

  if (phase === "processing") {
    return <ProcessingState />;
  }

  if (phase === "result" || current.status === "COMPLETED" || current.result) {
    return <ResultView attempt={current} />;
  }

  if (!current.active_turn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
        <p className="body-sm text-on-surface-variant">
          {loadingNext
            ? "Calling AI to generate your next question…"
            : "Preparing your first question…"}
        </p>
        {nextError ? <p className="body-sm text-error">{nextError}</p> : null}
        <button
          type="button"
          className="body-sm text-primary underline-offset-4 hover:underline"
          onClick={() => {
            setNextError(null);
            void (async () => {
              try {
                const next = await fetchNextTurn(current.id).unwrap();
                setLocalAttempt(next);
              } catch (err) {
                setNextError(
                  getApiErrorMessage(err, "Could not generate the next AI question."),
                );
              }
            })();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AdaptiveQuestionForm
      attempt={current}
      onUpdated={(next) => {
        setLocalAttempt(next);
        if (next.status === "COMPLETED") {
          setPhase("result");
          void refetch();
        }
      }}
    />
  );
}
