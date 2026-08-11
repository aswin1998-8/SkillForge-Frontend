"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useGetDiagnosticSessionQuery } from "@/services/api/diagnosticApi";
import { SessionStageForm } from "@/features/diagnostics/SessionStageForm";
import { SessionResultView } from "@/features/diagnostics/SessionResultView";
import { StageTransitionScreen } from "@/features/diagnostics/StageTransitionScreen";
import { getApiErrorMessage } from "@/lib/errors";
import type { DiagnosticSession } from "@/types/api";

export default function DiagnosticSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const sessionId = Number(id);
  const invalid = Number.isNaN(sessionId);
  const [local, setLocal] = useState<DiagnosticSession | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingSession, setPendingSession] = useState<DiagnosticSession | null>(
    null,
  );
  const [transitionLabel, setTransitionLabel] = useState("your answers");
  const pendingRef = useRef<DiagnosticSession | null>(null);
  pendingRef.current = pendingSession;

  const { data, error, isLoading, refetch } = useGetDiagnosticSessionQuery(
    sessionId,
    { skip: invalid },
  );

  useEffect(() => {
    if (data && !transitioning) setLocal(data);
  }, [data, transitioning]);

  const session = local ?? data ?? null;

  const finishTransition = useCallback(() => {
    if (pendingRef.current) {
      setLocal(pendingRef.current);
      setPendingSession(null);
    }
    setTransitioning(false);
  }, []);

  if (invalid) {
    return <p className="p-6 text-sm text-error">Invalid diagnostic session.</p>;
  }

  if (isLoading && !session) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        Loading diagnostic session…
      </p>
    );
  }

  if ((error && !session) || !session) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-error">{getApiErrorMessage(error)}</p>
        <button
          type="button"
          className="body-sm text-primary underline"
          onClick={() => void refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (transitioning) {
    return (
      <StageTransitionScreen
        stageLabel={transitionLabel}
        onReady={finishTransition}
      />
    );
  }

  if (session.status === "FAILED") {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-error">
          {session.error || "Diagnostic session failed."}
        </p>
      </div>
    );
  }

  if (session.status === "COMPLETED") {
    return <SessionResultView session={session} />;
  }

  const stageQuestions = session.current_questions?.length
    ? session.current_questions
    : session.questions.filter(
        (q) => q.stage === session.current_stage && q.status === "ASKED",
      );

  if (!stageQuestions.length) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6">
        <p className="body-sm text-on-surface-variant">
          Preparing the next stage…
        </p>
      </div>
    );
  }

  return (
    <SessionStageForm
      session={session}
      questions={stageQuestions}
      onUpdated={setLocal}
      onStageSubmitted={(next) => {
        setTransitionLabel(session.current_stage || "your answers");
        setPendingSession(next);
        setTransitioning(true);
      }}
    />
  );
}
