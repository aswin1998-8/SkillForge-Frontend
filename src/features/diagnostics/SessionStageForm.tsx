"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  useRunSessionTestsMutation,
  useSubmitSessionAnswersMutation,
} from "@/services/api/diagnosticApi";
import { getApiErrorMessage } from "@/lib/errors";
import type { DiagnosticSession, SessionQuestion } from "@/types/api";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-xl border border-outline-variant/40 text-sm text-on-surface-variant">
      Loading editor…
    </div>
  ),
});

type Props = {
  session: DiagnosticSession;
  questions: SessionQuestion[];
  onUpdated: (next: DiagnosticSession) => void;
  onStageSubmitted?: (next: DiagnosticSession) => void;
};

const OPEN_ENDED = new Set([
  "scenario",
  "defend",
  "diagnose",
  "architect",
  "explain",
  "communicate",
]);

type DraftState = {
  answers: Record<number, string>;
  choices: Record<number, number | null>;
  index: number;
};

function draftKey(sessionId: number, stage: string | null | undefined) {
  return `sf_diag_draft_${sessionId}_${stage || "unknown"}`;
}

function loadDraft(sessionId: number, stage: string | null | undefined): DraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(sessionId, stage));
    if (!raw) return null;
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

function saveDraft(
  sessionId: number,
  stage: string | null | undefined,
  draft: DraftState,
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(draftKey(sessionId, stage), JSON.stringify(draft));
  } catch {
    // ignore quota / private mode
  }
}

function clearDraft(sessionId: number, stage: string | null | undefined) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(draftKey(sessionId, stage));
  } catch {
    // ignore
  }
}

function monacoLanguage(question: SessionQuestion) {
  const lang = (question.language || "").toLowerCase();
  if (lang.includes("python")) return "python";
  if (lang.includes("sql")) return "sql";
  if (lang.includes("java") && !lang.includes("javascript")) return "java";
  if (lang.includes("typescript")) return "typescript";
  return "javascript";
}

export function SessionStageForm({
  session,
  questions,
  onUpdated,
  onStageSubmitted,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [choices, setChoices] = useState<Record<number, number | null>>({});
  const [testResults, setTestResults] = useState<Array<Record<string, unknown>>>([]);
  const [hydrated, setHydrated] = useState(false);

  const [submit, { isLoading, error }] = useSubmitSessionAnswersMutation();
  const [runTests, { isLoading: runningTests }] = useRunSessionTestsMutation();

  const questionIdsKey = useMemo(
    () => questions.map((q) => q.id).join(","),
    [questions],
  );

  useEffect(() => {
    const textMap: Record<number, string> = {};
    const choiceMap: Record<number, number | null> = {};
    for (const q of questions) {
      textMap[q.id] = q.answer?.answer_text || "";
      choiceMap[q.id] = q.answer?.choice_id ?? null;
    }

    const draft = loadDraft(session.id, session.current_stage);
    if (draft) {
      setAnswers({ ...textMap, ...draft.answers });
      setChoices({ ...choiceMap, ...draft.choices });
      const maxIndex = Math.max(0, questions.length - 1);
      setIndex(Math.min(Math.max(0, draft.index || 0), maxIndex));
    } else {
      setAnswers(textMap);
      setChoices(choiceMap);
      const firstUnanswered = questions.findIndex((q) => {
        if (q.modality === "foundational") return q.answer?.choice_id == null;
        return !(q.answer?.answer_text || "").trim();
      });
      setIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
    }
    setTestResults([]);
    setHydrated(true);
    // Only re-hydrate when session/stage or question ids change — not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, session.current_stage, questionIdsKey]);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(session.id, session.current_stage, { answers, choices, index });
  }, [answers, choices, index, hydrated, session.id, session.current_stage]);

  const question = questions[index];
  const modality = question?.modality || "foundational";
  const isOpenEnded = OPEN_ENDED.has(modality);
  const isCoding = modality === "coding" || modality === "find_issues";
  const isFoundational = modality === "foundational";
  const askedSoFar = session.questions?.length || 1;
  const budget = session.question_budget || 15;
  const skippedAreas = session.skipped_easy_areas || [];

  const canProceed = useMemo(() => {
    if (!question) return false;
    if (isFoundational) return choices[question.id] != null;
    return (answers[question.id] || "").trim().length > 0;
  }, [question, isFoundational, choices, answers]);

  function setAnswerText(qid: number, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
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

  const isLast = index >= questions.length - 1;

  function questionReady(q: SessionQuestion) {
    if (!q) return false;
    if (q.modality === "foundational") return choices[q.id] != null;
    return (answers[q.id] || "").trim().length > 0;
  }

  function goNext() {
    if (!question || !canProceed || isLast) return;
    setIndex((i) => Math.min(i + 1, questions.length - 1));
    setTestResults([]);
  }

  function goBack() {
    setIndex((i) => Math.max(i - 1, 0));
    setTestResults([]);
  }

  async function submitStage() {
    const incomplete = questions.findIndex((q) => !questionReady(q));
    if (incomplete >= 0) {
      setIndex(incomplete);
      return;
    }
    const body = {
      answers: questions.map((q) => ({
        question_id: q.id,
        answer_text: answers[q.id] || "",
        ...(q.modality === "foundational" && choices[q.id]
          ? { choice_id: choices[q.id]! }
          : {}),
      })),
    };
    const next = await submit({ sessionId: session.id, body }).unwrap();
    clearDraft(session.id, session.current_stage);
    onUpdated(next);
    if (next.status === "COMPLETED") {
      onStageSubmitted?.(next);
    }
  }

  if (!question) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">Waiting for questions…</p>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 pb-28 pt-6 sm:gap-6 sm:px-6 sm:pt-10">
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
          {index + 1} / {questions.length}
          <span className="mx-1 text-outline">·</span>
          {askedSoFar} / {budget}
        </span>
      </div>

      {skippedAreas.length ? (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 body-sm text-on-surface">
          Skipping easier items in{" "}
          {skippedAreas.map((a) => a.replaceAll("_", " ")).join(", ")} — moving
          to a harder check.
        </div>
      ) : null}

      <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-4 sm:p-6">
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
        <div className="space-y-3">
          <div className="min-w-0 overflow-hidden rounded-xl border border-outline-variant/50">
            <div className="flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest px-3 py-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
                {monacoLanguage(question)}
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
                define solve(input)
              </span>
            </div>
            {/* Fixed px height — height="100%" expands and pushes Next off-screen */}
            <MonacoEditor
              height={280}
              theme="vs-dark"
              language={monacoLanguage(question)}
              value={answers[question.id] || ""}
              onChange={(code) => setAnswerText(question.id, code ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily:
                  "var(--font-jetbrains-mono), ui-monospace, monospace",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => void handleRunTests()}
            disabled={runningTests || !(answers[question.id] || "").trim()}
            className="rounded-lg border border-outline-variant/40 px-4 py-2 body-sm disabled:opacity-50"
          >
            {runningTests ? "Running tests…" : "Run visible tests"}
          </button>
          {testResults.length ? (
            <pre className="max-h-40 overflow-auto rounded-xl bg-surface-container-high p-4 text-xs">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      {isOpenEnded || (!isFoundational && !isCoding) ? (
        <textarea
          value={answers[question.id] || ""}
          onChange={(e) => setAnswerText(question.id, e.target.value)}
          rows={8}
          className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim p-4 text-sm text-on-surface outline-none focus:border-primary"
          placeholder="Write your answer…"
        />
      ) : null}

      {error ? (
        <p className="body-sm text-error">{getApiErrorMessage(error)}</p>
      ) : null}

      {/* Sticky actions so Next is always reachable on coding steps */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-outline-variant/30 bg-background/95 px-4 py-3 backdrop-blur-md md:left-64">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            disabled={index === 0 || isLoading}
            onClick={goBack}
            className="rounded-xl border border-outline-variant/40 px-5 py-2.5 body-sm text-on-surface disabled:opacity-40"
          >
            Back
          </button>
          {isLast ? (
            <button
              type="button"
              disabled={isLoading || !canProceed}
              onClick={() => void submitStage()}
              className="rounded-xl bg-primary px-6 py-2.5 headline-sm text-on-primary disabled:opacity-60"
            >
              {isLoading ? "Submitting…" : "Submit stage"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed || isLoading}
              onClick={goNext}
              className="rounded-xl bg-primary px-6 py-2.5 headline-sm text-on-primary disabled:opacity-60"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
