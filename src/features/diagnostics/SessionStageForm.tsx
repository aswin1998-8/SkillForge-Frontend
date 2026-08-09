"use client";

import { useEffect, useMemo, useState } from "react";
import { useSubmitSessionAnswersMutation } from "@/services/api/diagnosticApi";
import { getApiErrorMessage } from "@/lib/errors";
import type { DiagnosticSession, SessionQuestion } from "@/types/api";

type Props = {
  session: DiagnosticSession;
  questions: SessionQuestion[];
  onUpdated: (next: DiagnosticSession) => void;
};

export function SessionStageForm({ session, questions, onUpdated }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submit, { isLoading, error }] = useSubmitSessionAnswersMutation();

  useEffect(() => {
    setIndex(0);
    const map: Record<number, string> = {};
    for (const q of questions) {
      map[q.id] = q.answer?.answer_text || "";
    }
    setAnswers(map);
  }, [questions]);

  const question = questions[index];
  const total = questions.length || 1;
  const allFilled = useMemo(
    () => questions.every((q) => (answers[q.id] || "").trim().length > 0),
    [questions, answers],
  );

  async function submitStage() {
    const body = {
      answers: questions.map((q) => ({
        question_id: q.id,
        answer_text: answers[q.id] || "",
      })),
    };
    const next = await submit({ sessionId: session.id, body }).unwrap();
    onUpdated(next);
  }

  if (!question) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        Waiting for questions…
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      {session.low_stakes ? (
        <div className="rounded-xl border border-tertiary/30 bg-tertiary/10 p-4 text-left">
          <p className="headline-sm text-tertiary">Starting line check</p>
          <p className="mt-1 body-sm text-on-surface-variant">
            No worries if you haven&apos;t hit this yet — we&apos;re just finding
            your starting line, not expecting expertise here.
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
            Block {session.current_block} ·{" "}
            {(session.current_stage || "").replaceAll("_", " ")}
          </p>
          <h1 className="mt-1 headline-md text-on-surface">
            {session.goal === "switch_role" && session.current_block === "B"
              ? session.target_role || "Target role"
              : session.current_role || "Current role"}
          </h1>
        </div>
        <span className="rounded bg-surface-container-high px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
          {index + 1} / {total}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-6">
        {question.competency_area ? (
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">
            {question.competency_area.replaceAll("_", " ")}
          </p>
        ) : null}
        <p className="body-lg whitespace-pre-wrap text-on-surface">
          {question.question_text}
        </p>
      </div>

      <label
        htmlFor="session-answer"
        className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.06em] text-on-surface-variant"
      >
        Your answer
      </label>
      <textarea
        id="session-answer"
        value={answers[question.id] || ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
        }
        rows={
          question.question_type === "CODE" ||
          session.current_stage === "CODING" ||
          session.current_stage === "FIND_ISSUES"
            ? 14
            : 8
        }
        className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim p-4 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface outline-none focus:border-primary"
        placeholder="Write your reasoning…"
      />

      {error ? (
        <p className="body-sm text-error">{getApiErrorMessage(error)}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-lg border border-outline-variant/40 px-4 py-2 body-sm text-on-surface disabled:opacity-40"
        >
          Previous
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className="rounded-xl bg-primary px-6 py-3 headline-sm text-on-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={isLoading || !allFilled}
            onClick={() => void submitStage()}
            className="rounded-xl bg-primary px-6 py-3 headline-sm text-on-primary disabled:opacity-60"
          >
            {isLoading ? "Submitting…" : "Submit stage"}
          </button>
        )}
      </div>
    </div>
  );
}
