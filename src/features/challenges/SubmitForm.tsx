"use client";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/errors";
import type { ChallengeAttempt, ChallengeSubmitRequest } from "@/types/api";
import {
  useSubmitChallengeMutation,
  useTrackEventMutation,
} from "@/services/api/challengeApi";
import { storeAttemptResult } from "@/features/challenges/attemptResultStorage";

type SubmitFormProps = {
  challengeId: number;
  payload: ChallengeSubmitRequest;
  onSubmitted: (attempt: ChallengeAttempt) => void;
  disabled?: boolean;
};

export function SubmitForm({
  challengeId,
  payload,
  onSubmitted,
  disabled,
}: SubmitFormProps) {
  const [submit, { isLoading, error }] = useSubmitChallengeMutation();
  const [trackEvent] = useTrackEventMutation();

  async function handleSubmit() {
    const attempt = await submit({ challengeId, body: payload }).unwrap();
    storeAttemptResult(attempt);
    void trackEvent({
      name: "challenge_submitted",
      properties: { challenge_id: challengeId, attempt_id: attempt.id },
    });
    onSubmitted(attempt);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/50 px-4 py-3">
      <p className="text-sm text-muted">
        {disabled
          ? "This challenge is locked until you finish the current roadmap step."
          : "Submit grades your work against the expected answer."}
      </p>
      <div className="flex items-center gap-3">
        {error ? (
          <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
        ) : null}
        <Button onClick={handleSubmit} disabled={isLoading || disabled}>
          {isLoading ? "Submitting…" : "Submit challenge"}
        </Button>
      </div>
    </div>
  );
}
