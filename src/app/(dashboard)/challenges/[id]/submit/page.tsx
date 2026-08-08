"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfidenceForm } from "@/features/challenges/ConfidenceForm";

function SubmitContent({ challengeId }: { challengeId: number }) {
  const searchParams = useSearchParams();
  const attemptId = Number(searchParams.get("attempt") || 0);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-accent">Submitted</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Challenge locked in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Rate your confidence, then watch Sessions for the debrief when it
          becomes available.
        </p>
      </div>

      {attemptId ? (
        <ConfidenceForm attemptId={attemptId} />
      ) : (
        <p className="text-sm text-muted">Missing attempt id.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/sessions">View sessions</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/challenges/${challengeId}`}>Back to challenge</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ChallengeSubmitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <SubmitContent challengeId={Number(id)} />
    </Suspense>
  );
}
