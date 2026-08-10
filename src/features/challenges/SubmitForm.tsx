"use client";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/errors";
import type { ChallengeAttempt, ChallengeSubmitRequest } from "@/types/api";
import { useSubmitChallengeMutation } from "@/services/api/challengeApi";

type SubmitFormProps = {
  challengeId: number;
  payload: ChallengeSubmitRequest;
  onSubmitted: (attempt: ChallengeAttempt) => void;
};

export function SubmitForm({
  challengeId,
  payload,
  onSubmitted,
}: SubmitFormProps) {
  const [submit, { isLoading, error }] = useSubmitChallengeMutation();

  async function handleSubmit() {
    const attempt = await submit({ challengeId, body: payload }).unwrap();
    onSubmitted(attempt);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/50 px-4 py-3">
      <p className="text-sm text-muted">
        Submit locks this attempt for review.
      </p>
      <div className="flex items-center gap-3">
        {error ? (
          <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
        ) : null}
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting…" : "Submit challenge"}
        </Button>
      </div>
    </div>
  );
}
