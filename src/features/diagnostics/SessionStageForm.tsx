"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useRevealSessionAnswerMutation,
  useRunSessionTestsMutation,
  useSelfRateSessionAnswerMutation,
  useSubmitSessionAnswersMutation,
} from "@/services/api/diagnosticApi";
import { getApiErrorMessage } from "@/lib/errors";
import type { DiagnosticSession, SessionQuestion } from "@/types/api";

type Props = {
  session: DiagnosticSession;
  questions: SessionQuestion[];
  onUpdated: (next: DiagnosticSession) => void;
};

const OPEN_ENDED = new Set([
  "scenario",
  "defend",
  "diagnose",
  "architect",
  "explain",
  "communicate",
]);

export function SessionStageForm({ session, questions, onUpdated }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [choices, setChoices] = useState<Record<number, number | null>>({});
  const [confidence, setConfidence] = useState<Record<number, number>>({});
  const [rubricRatings, setRubricRatings] = useState<
    Record<number, Record<string, "yes" | "no" | "partial">>
  >({});
  const [revealed, setRevealed] = useState<
    Record<number, { reference_text: string; rubric_points: string[] }>
  >({});
  const [testResults, setTestResults] = useState<Array<Record<string, unknown>>>([]);

  const [submit, { isLoading, error }] = useSubmitSessionAnswersMutation();
  const [revealAnswer, { isLoading: revealing }] = useRevealSessionAnswerMutation();
  const [selfRate, { isLoading: selfRating }] = useSelfRateSessionAnswerMutation();
  const [runTests, { isLoading: runningTests }] = useRunSessionTestsMutation();

  useEffect(() => {
    const textMap: Record<number, string> = {};
    const choiceMap: Record<number, number | null> = {};
    for (const q of questions) {
      textMap[q.id] = q.answer?.answer_text || "";
      choiceMap[q.id] = q.answer?.choice_id ?? null;
    }
    setAnswers(textMap);
    setChoices(choiceMap);
    setTestResults([]);

    const resumeAt = questions.findIndex((q) => {
      if (q.status === "ASKED" || q.status === "REVEALED") return true;
      if (q.status === "ANSWERED" && OPEN_ENDED.has(q.modality || "")) return true;
      return false;
    });
    setIndex(resumeAt >= 0 ? resumeAt : 0);
  }, [questions]);

  const question = questions[index];
  const total = questions.length || 1;
  const modality = question?.modality || "foundational";
  const isOpenEnded = OPEN_ENDED.has(modality);
  const isCoding = modality === "coding" || modality === "find_issues";
  const isFoundational = modality === "foundational";
  const currentAnswer = question?.answer;
  const showReveal =
    isOpenEnded && currentAnswer && !revealed[question.id] && currentAnswer.id;
  const showSelfRate =
    isOpenEnded &&
    (revealed[question.id] || question.status === "REVEALED") &&
    question.status !== "SELF_RATED";

  const canProceed = useMemo(() => {
    if (!question) return false;
    if (isFoundational) return choices[question.id] != null;
    if (isCoding) return (answers[question.id] || "").trim().length > 0;
    if (isOpenEnded) {
      if (showSelfRate) {
        const points = revealed[question.id]?.rubric_points || [];
        const ratings = rubricRatings[question.id] || {};
        return points.every((p) => ratings[p]);
      }
      if (currentAnswer?.id) return true;
      return (
        (answers[question.id] || "").trim().length > 0 &&
        (confidence[question.id] || 0) >= 1
      );
    }
    return (answers[question.id] || "").trim().length > 0;
  }, [
    question,
    isFoundational,
    isCoding,
    isOpenEnded,
    choices,
    answers,
    confidence,
    rubricRatings,
    revealed,
    showSelfRate,
    currentAnswer,
  ]);

  async function submitCurrentQuestion() {
    if (!question) return;

    if (showSelfRate && currentAnswer?.id) {
      const next = await selfRate({
        sessionId: session.id,
        answerId: currentAnswer.id,
        rubric_alignment: rubricRatings[question.id] || {},
      }).unwrap();
      onUpdated(next);
      return;
    }

    if (showReveal && currentAnswer?.id) {
      const payload = await revealAnswer({
        sessionId: session.id,
        answerId: currentAnswer.id,
      }).unwrap();
      setRevealed((prev) => ({
        ...prev,
        [question.id]: {
          reference_text: payload.reference_text,
          rubric_points: payload.rubric_points,
        },
      }));
      return;
    }

    const body = {
      answers: [
        {
          question_id: question.id,
          answer_text: answers[question.id] || "",
          ...(isFoundational && choices[question.id]
            ? { choice_id: choices[question.id]! }
            : {}),
          ...(isOpenEnded ? { confidence_rating: confidence[question.id] || 3 } : {}),
        },
      ],
    };
    const next = await submit({ sessionId: session.id, body }).unwrap();
    onUpdated(next);

    if (isOpenEnded) {
      const updatedQ = next.current_questions?.find((q) => q.id === question.id)
        || next.questions.find((q) => q.id === question.id);
      if (updatedQ?.answer?.id) {
        const payload = await revealAnswer({
          sessionId: session.id,
          answerId: updatedQ.answer.id,
        }).unwrap();
        setRevealed((prev) => ({
          ...prev,
          [question.id]: {
            reference_text: payload.reference_text,
            rubric_points: payload.rubric_points,
          },
        }));
      }
    }
  }

  async function handleRunTests() {
    if (!question) return;
    const result = await runTests({
      sessionId: session.id,
      question_id: question.id,
      code: answers[question.id] || "",
    }).unwrap();
    setTestResults(result.test_results || []);
  }

  if (!question) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">Waiting for questions…</p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
            {(session.current_stage || "").replaceAll("_", " ")} · {modality}
          </p>
          <h1 className="mt-1 headline-md text-on-surface">
            {session.current_role || "Diagnostic"}
          </h1>
        </div>
        <span className="rounded bg-surface-container-high px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
          {index + 1} / {total}
        </span>
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

      {isFoundational ? (
        <div className="space-y-3">
          {(question.choices || []).map((choice) => (
            <label
              key={choice.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/40 p-4"
            >
              <input
                type="radio"
                name={`choice-${question.id}`}
                checked={choices[question.id] === choice.id}
                onChange={() =>
                  setChoices((prev) => ({ ...prev, [question.id]: choice.id }))
                }
              />
              <span className="body-md text-on-surface">{choice.choice_text}</span>
            </label>
          ))}
        </div>
      ) : null}

      {isCoding ? (
        <>
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
            }
            rows={14}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim p-4 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface outline-none focus:border-primary"
            placeholder="Write your solution (define solve(input) )…"
          />
          <button
            type="button"
            onClick={() => void handleRunTests()}
            disabled={runningTests}
            className="self-start rounded-lg border border-outline-variant/40 px-4 py-2 body-sm"
          >
            {runningTests ? "Running tests…" : "Run visible tests"}
          </button>
          {testResults.length ? (
            <pre className="overflow-auto rounded-xl bg-surface-container-high p-4 text-xs">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          ) : null}
        </>
      ) : null}

      {isOpenEnded && !currentAnswer ? (
        <>
          <label className="body-sm text-on-surface-variant">
            Confidence before seeing the reference (1–5)
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={confidence[question.id] || 3}
            onChange={(e) =>
              setConfidence((prev) => ({
                ...prev,
                [question.id]: Number(e.target.value),
              }))
            }
          />
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
            }
            rows={8}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim p-4 text-sm"
            placeholder="Write your reasoning before viewing the reference answer…"
          />
        </>
      ) : null}

      {isOpenEnded && revealed[question.id] ? (
        <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="headline-sm text-primary">Reference answer</p>
          <p className="body-md whitespace-pre-wrap text-on-surface">
            {revealed[question.id].reference_text}
          </p>
          {showSelfRate ? (
            <div className="space-y-3">
              <p className="body-sm text-on-surface-variant">
                Did your answer cover each rubric point?
              </p>
              {revealed[question.id].rubric_points.map((point) => (
                <div key={point} className="rounded-lg bg-surface-container p-3">
                  <p className="body-sm text-on-surface">{point}</p>
                  <div className="mt-2 flex gap-2">
                    {(["yes", "partial", "no"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setRubricRatings((prev) => ({
                            ...prev,
                            [question.id]: {
                              ...(prev[question.id] || {}),
                              [point]: value,
                            },
                          }))
                        }
                        className={`rounded px-3 py-1 text-xs capitalize ${
                          rubricRatings[question.id]?.[point] === value
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {!isFoundational && !isCoding && !isOpenEnded ? (
        <textarea
          value={answers[question.id] || ""}
          onChange={(e) =>
            setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
          }
          rows={8}
          className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim p-4 text-sm"
        />
      ) : null}

      {currentAnswer?.grading_detail ? (
        <pre className="overflow-auto rounded-xl bg-surface-container-high p-4 text-xs">
          {JSON.stringify(currentAnswer.grading_detail, null, 2)}
        </pre>
      ) : null}

      {error ? (
        <p className="body-sm text-error">{getApiErrorMessage(error)}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-lg border border-outline-variant/40 px-4 py-2 body-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={isLoading || revealing || selfRating || !canProceed}
          onClick={() => void submitCurrentQuestion()}
          className="rounded-xl bg-primary px-6 py-3 headline-sm text-on-primary disabled:opacity-60"
        >
          {isLoading || revealing || selfRating
            ? "Submitting…"
            : showSelfRate
              ? "Save self-rating"
              : isOpenEnded && !currentAnswer
                ? "Submit answer"
                : "Continue"}
        </button>
      </div>
    </div>
  );
}
