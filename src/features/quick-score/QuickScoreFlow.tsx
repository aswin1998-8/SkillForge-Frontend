"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  useGetQuickScoreQuestionsQuery,
  useSubmitQuickScoreMutation,
} from "@/services/api/quickScoreApi";
import { useTrackEventMutation } from "@/services/api/challengeApi";
import type { QuickScoreAttempt } from "@/types/api";
import { OnboardingShell } from "@/components/layout/OnboardingShell";
import { getApiErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

type QuickScoreFlowProps = {
  onComplete: (attempt: QuickScoreAttempt) => void;
  onBack?: () => void;
  currentRole?: string;
  knownSkills?: string[];
};

function inferTrack(
  currentRole?: string,
  knownSkills?: string[],
): "frontend" | "backend" {
  const text = `${currentRole || ""} ${(knownSkills || []).join(" ")}`.toLowerCase();
  const backendSignals = [
    "django",
    "fastapi",
    "python",
    "backend",
    "postgres",
    "sql",
  ];
  const frontendSignals = [
    "react",
    "next",
    "frontend",
    "typescript",
    "javascript",
  ];
  const be = backendSignals.filter((s) => text.includes(s)).length;
  const fe = frontendSignals.filter((s) => text.includes(s)).length;
  return be > fe ? "backend" : "frontend";
}

export function QuickScoreFlow({
  onComplete,
  onBack,
  currentRole,
  knownSkills,
}: QuickScoreFlowProps) {
  const track = useMemo(
    () => inferTrack(currentRole, knownSkills),
    [currentRole, knownSkills],
  );
  const { data, isLoading, error } = useGetQuickScoreQuestionsQuery(track);
  const [submitQuickScore, { isLoading: submitting }] =
    useSubmitQuickScoreMutation();
  const [trackEvent] = useTrackEventMutation();

  const questions = data?.questions ?? [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [attempt, setAttempt] = useState<QuickScoreAttempt | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const current = questions[index];
  const progress = questions.length
    ? Math.round(((index + (attempt ? 1 : 0)) / questions.length) * 100)
    : 0;

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setAttempt(null);
  }, [track, data?.track]);

  async function selectChoice(choiceId: number) {
    if (!current || attempt) return;
    const nextAnswers = { ...answers, [current.id]: choiceId };
    setAnswers(nextAnswers);

    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    setSubmitError(null);
    try {
      const result = await submitQuickScore({
        track: data?.track || track,
        answers: questions.map((q) => ({
          question_id: q.id,
          choice_id: nextAnswers[q.id]!,
        })),
      }).unwrap();
      setAttempt(result);
      void trackEvent({
        name: "quick_score_completed",
        properties: {
          attempt_id: result.id,
          band: result.band,
          total_score: result.total_score,
        },
      });
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not submit quick score."));
    }
  }

  async function shareResult() {
    if (!attempt) return;
    setSharing(true);
    try {
      const res = await fetch(`${API_BASE}/quick-score/${attempt.id}/og.png`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Share image unavailable");
      const blob = await res.blob();
      const file = new File([blob], `skill-confidence-${attempt.id}.png`, {
        type: "image/png",
      });

      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))
      ) {
        await navigator.share({
          title: "My Skill Gap Analysis",
          text: `${attempt.band_label} — ${attempt.total_score}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }

      void trackEvent({
        name: "quick_score_shared",
        properties: { attempt_id: attempt.id },
      });
    } catch {
      // User cancelled share or download failed — ignore
    } finally {
      setSharing(false);
    }
  }

  function handleContinueToDiagnostic() {
    if (!attempt) return;
    void trackEvent({
      name: "quick_score_to_diagnostic",
      properties: { attempt_id: attempt.id },
    });
    onComplete(attempt);
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center">
        <p className="body-md text-on-surface-variant">Loading quick score…</p>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <OnboardingShell
        maxWidthClassName="max-w-xl"
        footer={
          <div className="flex items-center justify-between gap-3">
            {onBack ? (
              <button type="button" onClick={onBack} className="body-sm text-primary">
                Back
              </button>
            ) : (
              <span />
            )}
            {!error ? (
              <button
                type="button"
                onClick={() =>
                  onComplete({
                    id: 0,
                    track,
                    total_score: 0,
                    band: "emerging_gaps",
                    band_label: "Continue",
                    paragraph: "",
                    paragraph_key: "",
                    created_at: new Date().toISOString(),
                  })
                }
                className="rounded-lg bg-primary px-4 py-2.5 body-sm text-on-primary"
              >
                Continue
              </button>
            ) : null}
          </div>
        }
      >
        <p className="body-sm text-on-surface-variant">
          {error
            ? getApiErrorMessage(error, "Could not load quick score.")
            : "You’ve already completed the available quick score questions for this track. Continue to your personalized diagnostic."}
        </p>
      </OnboardingShell>
    );
  }

  if (attempt) {
    return (
      <OnboardingShell
        maxWidthClassName="max-w-xl"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => void shareResult()}
              disabled={sharing}
              className="rounded-xl border border-outline-variant/40 px-4 py-2.5 body-sm text-on-surface disabled:opacity-60"
            >
              {sharing ? "Sharing…" : "Share score"}
            </button>
            <button
              type="button"
              onClick={handleContinueToDiagnostic}
              className="rounded-xl bg-primary px-5 py-2.5 headline-sm text-on-primary"
            >
              Get full gap report + roadmap
            </button>
          </div>
        }
      >
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-primary">
          Skill Gap Analysis
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-8 text-on-surface">
          {attempt.band_label}
        </h1>
        <p className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[24px] text-primary">
          {attempt.total_score}
          <span className="text-[13px] text-on-surface-variant"> / 100</span>
        </p>
        <p className="mt-4 body-sm text-on-surface-variant">{attempt.paragraph}</p>
        <Link
          href="/how-this-works"
          className="mt-4 inline-block body-sm text-primary underline-offset-4 hover:underline"
        >
          How scoring works
        </Link>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell
      maxWidthClassName="max-w-xl"
      footer={
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="body-sm text-on-surface-variant"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <Link
            href="/how-this-works"
            className="body-sm text-primary underline-offset-4 hover:underline"
          >
            How this works
          </Link>
        </div>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-7 rounded-full bg-primary" />
          <div className="h-1.5 w-7 rounded-full bg-primary/40" />
          <div className="h-1.5 w-7 rounded-full bg-surface-container-highest" />
        </div>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider text-on-surface-variant">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>

      <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-primary">
        Quick score · {current?.competency_area}
      </p>
      <h1 className="mt-2 text-[22px] font-semibold leading-7 text-on-surface sm:text-[24px]">
        {current?.prompt_text}
      </h1>

      <div className="mt-5 flex flex-col gap-2.5">
        {current?.choices.map((choice) => {
          const selected = answers[current.id] === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={submitting}
              onClick={() => void selectChoice(choice.id)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left body-sm transition-all",
                selected
                  ? "border-primary bg-primary/10 text-on-surface"
                  : "border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-primary/50",
                submitting && "opacity-60",
              )}
            >
              {choice.choice_text}
            </button>
          );
        })}
      </div>

      {submitError ? (
        <p className="mt-3 body-sm text-danger">{submitError}</p>
      ) : null}
    </OnboardingShell>
  );
}
