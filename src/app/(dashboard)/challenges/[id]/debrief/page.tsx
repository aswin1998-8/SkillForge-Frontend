"use client";

import { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { DebriefFlow } from "@/features/challenges/DebriefFlow";

function DebriefContent({ challengeId }: { challengeId: number }) {
  const searchParams = useSearchParams();
  const attemptId = Number(searchParams.get("attempt") || 0);

  if (!attemptId) {
    return (
      <p className="body-sm text-on-surface-variant">
        Missing attempt id. Submit a challenge first.
      </p>
    );
  }

  return <DebriefFlow attemptId={attemptId} challengeId={challengeId} />;
}

export default function ChallengeDebriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="px-6 py-10">
      <Suspense
        fallback={
          <p className="body-sm text-on-surface-variant">Loading debrief…</p>
        }
      >
        <DebriefContent challengeId={Number(id)} />
      </Suspense>
    </div>
  );
}
