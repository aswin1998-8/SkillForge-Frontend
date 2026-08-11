"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loadAttemptResult } from "@/features/challenges/attemptResultStorage";
import type { ChallengeAttempt } from "@/types/api";

function SubmitResultContent({
  challengeId,
  attemptId,
}: {
  challengeId: number;
  attemptId: number;
}) {
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    setAttempt(loadAttemptResult(attemptId));
  }, [attemptId]);

  if (!attemptId) {
    return <p className="text-sm text-muted">Missing attempt id.</p>;
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <p className="body-sm text-on-surface-variant">
          Results are only available right after submit in this browser session.
        </p>
        <Button asChild>
          <Link href="/roadmap">Continue roadmap</Link>
        </Button>
      </div>
    );
  }

  const grading = (attempt.submission?.metadata?.grading || {}) as Record<
    string,
    unknown
  >;
  const score = typeof grading.score === "number" ? grading.score : null;
  const isCorrect = Boolean(grading.is_correct);
  const method = String(grading.method || "graded");

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-accent">Submitted</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Challenge graded
        </h1>
        <p className="mt-2 text-sm text-muted">
          Checked against the expected answer and rubric — no self-rating step.
        </p>
      </div>

      <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-5">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider text-on-surface-variant">
          {method.replaceAll("_", " ")}
        </p>
        <p className="mt-2 headline-sm text-on-surface">
          {score != null
            ? `Score ${(score * 100).toFixed(0)}%`
            : isCorrect
              ? "Passed"
              : "Needs work"}
        </p>
        {score != null ? (
          <p className="mt-1 body-sm text-on-surface-variant">
            {isCorrect
              ? "You cleared the pass threshold."
              : "Keep practicing — focus on the missing rubric signals."}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/roadmap">Continue roadmap</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/challenges/${challengeId}`}>Back to challenge</Link>
        </Button>
      </div>
    </div>
  );
}

function SubmitContent({ challengeId }: { challengeId: number }) {
  const searchParams = useSearchParams();
  const attemptId = Number(searchParams.get("attempt") || 0);
  return (
    <SubmitResultContent challengeId={challengeId} attemptId={attemptId} />
  );
}

export default function ChallengeSubmitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted">Loading…</p>}>
      <SubmitContent challengeId={Number(id)} />
    </Suspense>
  );
}
