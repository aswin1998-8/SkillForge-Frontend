"use client";

import { use, useEffect, useState } from "react";
import { useGetDiagnosticSessionQuery } from "@/services/api/diagnosticApi";
import { DiagnosticAnalyzingScreen } from "@/features/diagnostics/DiagnosticAnalyzingScreen";
import { ProcessingState } from "@/features/diagnostics/ProcessingState";
import { SessionStageForm } from "@/features/diagnostics/SessionStageForm";
import { SessionResultView } from "@/features/diagnostics/SessionResultView";
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

  const { data, error, isLoading, refetch } = useGetDiagnosticSessionQuery(
    sessionId,
    {
      skip: invalid,
      pollingInterval:
        local?.status === "GENERATING" ||
        local?.status === "SYNTHESIZING" ||
        local?.status === "PENDING"
          ? 2000
          : 0,
    },
  );

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const session = local ?? data ?? null;

  if (invalid) {
    return (
      <p className="p-6 text-sm text-error">Invalid diagnostic session.</p>
    );
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

  if (session.status === "FAILED") {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-error">
          {session.error || "Diagnostic session failed."}
        </p>
        <button
          type="button"
          className="body-sm text-primary underline"
          onClick={() => void refetch()}
        >
          Refresh
        </button>
      </div>
    );
  }

  if (
    session.status === "PENDING" ||
    session.status === "GENERATING" ||
    session.status === "SYNTHESIZING"
  ) {
    if (session.status === "SYNTHESIZING") {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <ProcessingState />
        </div>
      );
    }
    return (
      <DiagnosticAnalyzingScreen
        targetRoleLabel={
          session.target_role || session.current_role || "your profile"
        }
      />
    );
  }

  if (session.status === "COMPLETED") {
    return <SessionResultView session={session} />;
  }

  const questions = session.current_questions?.length
    ? session.current_questions
    : session.questions.filter(
        (q) =>
          q.block === session.current_block &&
          q.stage === session.current_stage &&
          q.status === "ASKED",
      );

  if (!questions.length) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
        <p className="body-sm text-on-surface-variant">
          Preparing the next stage…
        </p>
      </div>
    );
  }

  return (
    <SessionStageForm
      session={session}
      questions={questions}
      onUpdated={setLocal}
    />
  );
}
