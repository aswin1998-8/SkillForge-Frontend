"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAttemptQuery,
  useGetDiagnosticQuery,
} from "@/services/api/diagnosticApi";
import {
  DEMO_QUESTIONS,
  QuestionForm,
} from "@/features/diagnostics/QuestionForm";
import { ProcessingState } from "@/features/diagnostics/ProcessingState";
import { ResultView } from "@/features/diagnostics/ResultView";
import { getApiErrorMessage } from "@/lib/errors";

export default function DiagnosticAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isDemo = id === "demo" || Number.isNaN(Number(id));
  const attemptId = Number(id);
  const [phase, setPhase] = useState<"form" | "processing" | "result">("form");

  const {
    data: attempt,
    error,
    isLoading,
    refetch,
  } = useGetAttemptQuery(attemptId, {
    skip: isDemo,
    pollingInterval: !isDemo && phase === "processing" ? 2500 : 0,
  });

  const { data: diagnostic } = useGetDiagnosticQuery(
    attempt?.diagnostic_id ?? 0,
    { skip: isDemo || !attempt?.diagnostic_id },
  );

  useEffect(() => {
    if (!attempt) return;
    const status = attempt.status;
    if (status === "COMPLETED") {
      setPhase("result");
    } else if (
      status === "SUBMITTED" ||
      status === "PROCESSING" ||
      status === "FAILED"
    ) {
      setPhase(status === "FAILED" ? "result" : "processing");
    }
  }, [attempt]);

  if (isDemo) {
    return (
      <QuestionForm
        demo
        questions={DEMO_QUESTIONS}
        title="Diagnostic Assessment"
        competency="Core Competency: RAG Architectures & Vector Similarity"
        onSubmitted={() => router.push("/roadmap")}
      />
    );
  }

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">Loading attempt…</p>
    );
  }

  if (error || !attempt) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-error">{getApiErrorMessage(error)}</p>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm text-on-primary"
          onClick={() => router.push("/diagnostic/demo")}
        >
          Continue in demo mode
        </button>
      </div>
    );
  }

  if (phase === "processing") {
    return <ProcessingState />;
  }

  if (phase === "result" || attempt.result) {
    return <ResultView attempt={attempt} />;
  }

  return (
    <QuestionForm
      attempt={attempt}
      questions={diagnostic?.questions?.length ? diagnostic.questions : DEMO_QUESTIONS}
      competency={
        diagnostic?.description ||
        "Core Competency: RAG Architectures & Vector Similarity"
      }
      onSubmitted={() => {
        setPhase("processing");
        void refetch();
      }}
    />
  );
}
