"use client";

import { useEffect, useMemo, useState } from "react";
import type { DiagnosticAttempt, DiagnosticQuestion } from "@/types/api";
import {
  useSaveAnswersMutation,
  useSubmitAttemptMutation,
} from "@/services/api/diagnosticApi";
import { getApiErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

export const DEMO_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    text: "You are building an AI agent that uses a vector database for retrieval-augmented generation (RAG). The agent is consistently returning irrelevant context documents when querying the database, despite the embeddings being correctly generated using a state-of-the-art model. The database contains a mix of very short FAQ answers and extremely long technical manuals.\n\nBased on this behavior, what architectural or configuration issue would you investigate first, and how would you redesign the chunking strategy to resolve the disparity in document lengths?",
    question_type: "SCENARIO",
    skill: { id: 1, name: "RAG Architectures", slug: "rag", description: "" },
    difficulty: 3,
    ordering: 1,
  },
  {
    id: 2,
    text: "Your team ships a multi-tenant SaaS API. Latency spikes appear only for a subset of tenants during peak hours. CPU and DB CPU look fine, but Redis connection count climbs steadily.\n\nWhat failure modes would you investigate first, and how would you instrument the system to confirm root cause before changing capacity?",
    question_type: "SCENARIO",
    skill: { id: 2, name: "Reliability", slug: "reliability", description: "" },
    difficulty: 3,
    ordering: 2,
  },
  {
    id: 3,
    text: "You need to design an embedding pipeline that ingests PDFs, HTML, and chat transcripts into a shared vector index used by support and engineering tools.\n\nOutline the ingestion stages, where you enforce tenant isolation, and how you would handle re-indexing after a model upgrade without downtime.",
    question_type: "SCENARIO",
    skill: {
      id: 3,
      name: "System Design",
      slug: "system-design",
      description: "",
    },
    difficulty: 4,
    ordering: 3,
  },
];

type QuestionFormProps = {
  attempt?: DiagnosticAttempt | null;
  questions: DiagnosticQuestion[];
  title?: string;
  competency?: string;
  onSubmitted?: () => void;
  demo?: boolean;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function splitScenario(text: string) {
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return { body: text, prompt: null as string | null };
  }
  return {
    body: parts.slice(0, -1).join("\n\n"),
    prompt: parts[parts.length - 1] ?? null,
  };
}

export function QuestionForm({
  attempt,
  questions,
  title = "Diagnostic Assessment",
  competency,
  onSubmitted,
  demo = false,
}: QuestionFormProps) {
  const initial = useMemo(() => {
    const map: Record<number, string> = {};
    for (const q of questions) {
      const existing = attempt?.answers.find((a) => a.question_id === q.id);
      map[q.id] = existing?.answer_text ?? "";
    }
    return map;
  }, [attempt?.answers, questions]);

  const [answers, setAnswers] = useState(initial);
  const [index, setIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(42 * 60 + 15);
  const [saveAnswers, { isLoading: saving, error: saveError }] =
    useSaveAnswersMutation();
  const [submitAttempt, { isLoading: submitting, error: submitError }] =
    useSubmitAttemptMutation();

  useEffect(() => {
    setAnswers(initial);
  }, [initial]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const question = questions[index];
  const total = questions.length || 1;
  const progress = Math.round(((index + 1) / total) * 100);
  const answerText = question ? (answers[question.id] ?? "") : "";
  const { body, prompt } = question
    ? splitScenario(question.text)
    : { body: "", prompt: null };

  const subtitle =
    competency ||
    (question
      ? `Core Competency: ${question.skill.name}`
      : "Core Competency: Technical Reasoning");

  async function persist() {
    if (demo || !attempt) return;
    await saveAnswers({
      attemptId: attempt.id,
      body: {
        answers: Object.entries(answers).map(([question_id, answer_text]) => ({
          question_id: Number(question_id),
          answer_text,
        })),
      },
    }).unwrap();
  }

  async function handlePrevious() {
    if (index === 0) return;
    try {
      await persist();
    } catch {
      // still navigate in demo / soft-fail
    }
    setIndex((i) => Math.max(0, i - 1));
  }

  async function handleSaveContinue() {
    try {
      await persist();
    } catch {
      // demo / soft-fail
    }

    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    if (!demo && attempt) {
      try {
        await submitAttempt(attempt.id).unwrap();
        onSubmitted?.();
        return;
      } catch {
        // fall through
      }
    }
    onSubmitted?.();
  }

  function clearAnswer() {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: "" }));
  }

  if (!question) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        No questions on this diagnostic.
      </p>
    );
  }

  const busy = saving || submitting;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="headline-md text-on-background">
            {attempt?.diagnostic_title || title}
          </h1>
          <p className="body-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 rounded bg-surface-container px-4 py-2">
          <span className="material-symbols-outlined text-[18px] text-outline">
            timer
          </span>
          <span
            className={cn(
              "font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em]",
              timeRemaining < 300 ? "text-error" : "text-on-surface",
            )}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-outline">
          <span>
            QUESTION {index + 1} / {total}
          </span>
          <span>{progress}% COMPLETED</span>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl bg-surface-container-low p-10 shadow-lg">
        <div className="absolute left-0 top-0 h-full w-1 bg-secondary" />

        <div className="flex flex-col gap-4">
          <h2 className="headline-sm text-on-surface">
            {question.question_type === "SCENARIO" ||
            question.question_type.toLowerCase().includes("scenario")
              ? "Scenario Analysis"
              : "Technical Prompt"}
          </h2>
          <p className="body-lg leading-relaxed whitespace-pre-wrap text-on-surface-variant">
            {body}
          </p>
          {prompt ? (
            <p className="body-lg leading-relaxed text-on-surface-variant">
              {prompt}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="answer-editor"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary"
            >
              RESPONSE EDITOR
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                title="Format Code"
                className="text-outline transition-colors hover:text-on-surface"
                onClick={() => {
                  if (!question) return;
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: (prev[question.id] ?? "").trim(),
                  }));
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  code
                </span>
              </button>
              <button
                type="button"
                title="Clear"
                className="text-outline transition-colors hover:text-on-surface"
                onClick={clearAnswer}
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
              </button>
            </div>
          </div>
          <div className="group relative h-96">
            <textarea
              id="answer-editor"
              spellCheck={false}
              value={answerText}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: e.target.value,
                }))
              }
              placeholder="// Enter your technical analysis and proposed architectural changes here..."
              className="h-full w-full resize-none rounded bg-surface p-4 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface shadow-inner transition-all focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <div className="absolute bottom-2 right-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-outline opacity-0 transition-opacity group-hover:opacity-100">
              {answerText.length} chars
            </div>
          </div>
        </div>
      </div>

      {(saveError || submitError) && !demo ? (
        <p className="text-sm text-error">
          {getApiErrorMessage(saveError || submitError)}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={() => void handlePrevious()}
          disabled={index === 0 || busy}
          className="flex items-center gap-2 rounded px-6 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          PREVIOUS
        </button>
        <button
          type="button"
          onClick={() => void handleSaveContinue()}
          disabled={busy}
          className="flex items-center gap-2 rounded bg-primary px-6 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-primary shadow-md transition-all duration-150 hover:-translate-y-px hover:bg-primary-fixed hover:shadow-lg active:translate-y-0 disabled:opacity-50"
        >
          {busy
            ? "Saving…"
            : index < questions.length - 1
              ? "SAVE & CONTINUE"
              : demo
                ? "FINISH"
                : "SUBMIT DIAGNOSTIC"}
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
