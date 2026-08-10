import { TodayChallengeCard } from "@/features/challenges/TodayChallengeCard";

export default function TodayChallengePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Current challenge</h1>
        <p className="text-sm text-muted">
          Your unlocked roadmap challenge — finish it to open the next step.
        </p>
      </div>
      <TodayChallengeCard />
    </div>
  );
}
