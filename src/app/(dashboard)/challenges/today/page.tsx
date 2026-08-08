import { TodayChallengeCard } from "@/features/challenges/TodayChallengeCard";

export default function TodayChallengePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-muted">
          One focused challenge aligned to your open gaps.
        </p>
      </div>
      <TodayChallengeCard />
    </div>
  );
}
