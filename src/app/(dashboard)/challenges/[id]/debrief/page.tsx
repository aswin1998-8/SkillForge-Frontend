"use client";

import { Suspense, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Debrief is removed from the happy path — redirect to graded submit results.
 */
function DebriefRedirect({ challengeId }: { challengeId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attempt = searchParams.get("attempt");

  useEffect(() => {
    const qs = attempt ? `?attempt=${attempt}` : "";
    router.replace(`/challenges/${challengeId}/submit${qs}`);
  }, [attempt, challengeId, router]);

  return (
    <p className="p-6 body-sm text-on-surface-variant">Redirecting…</p>
  );
}

export default function ChallengeDebriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <p className="p-6 body-sm text-on-surface-variant">Redirecting…</p>
      }
    >
      <DebriefRedirect challengeId={Number(id)} />
    </Suspense>
  );
}
