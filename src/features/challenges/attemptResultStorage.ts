import type { ChallengeAttempt } from "@/types/api";

export function storeAttemptResult(attempt: ChallengeAttempt) {
  try {
    sessionStorage.setItem(
      `sf_challenge_attempt_${attempt.id}`,
      JSON.stringify(attempt),
    );
  } catch {
    // ignore
  }
}

export function loadAttemptResult(attemptId: number): ChallengeAttempt | null {
  try {
    const raw = sessionStorage.getItem(`sf_challenge_attempt_${attemptId}`);
    if (!raw) return null;
    return JSON.parse(raw) as ChallengeAttempt;
  } catch {
    return null;
  }
}
