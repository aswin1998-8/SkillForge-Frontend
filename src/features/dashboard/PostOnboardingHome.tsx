"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TodayChallengeCard } from "@/features/challenges/TodayChallengeCard";
import { useGetRoadmapQuery } from "@/services/api/progressApi";
import type { DashboardData } from "@/types/api";

type Props = {
  dashboard: DashboardData;
};

function formatTopic(topic: string) {
  return topic.replaceAll("_", " ");
}

export function PostOnboardingHome({ dashboard }: Props) {
  const hasRoadmap = Boolean(dashboard.has_roadmap || dashboard.roadmap_steps_count);
  const diagnosticDone = Boolean(dashboard.diagnostic_completed || hasRoadmap);
  const roadmapComplete = Boolean(dashboard.roadmap_complete);
  const rediagnosticUnlocked = Boolean(dashboard.rediagnostic_unlocked);
  const bump = dashboard.diagnostic_difficulty_bump ?? 0;
  const cycle = dashboard.diagnostic_cycle ?? 1;

  const { data: roadmap } = useGetRoadmapQuery(undefined, {
    skip: !diagnosticDone,
  });

  const focusTopics =
    dashboard.roadmap_focus_topics?.length
      ? dashboard.roadmap_focus_topics
      : roadmap?.focus_skills || [];
  const steps = roadmap?.steps ?? [];
  const previewSteps = steps.slice(0, 4);
  const firstOpenIndex = steps.findIndex((s) => {
    const status = (s.status || "not_started").toLowerCase();
    return status !== "closed" && status !== "mastered";
  });
  const closedCount =
    dashboard.roadmap_steps_closed ??
    steps.filter((s) => {
      const status = (s.status || "").toLowerCase();
      return status === "closed" || status === "mastered";
    }).length;
  const totalSteps =
    dashboard.roadmap_steps_total ??
    dashboard.roadmap_steps_count ??
    steps.length;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="headline-md text-on-surface">
          {roadmapComplete
            ? "Roadmap complete"
            : diagnosticDone
              ? "Your practice plan"
              : "Welcome back"}
        </h1>
        <p className="mt-2 body-md text-on-surface-variant">
          {roadmapComplete
            ? "You’ve closed every step. Take a harder diagnostic to generate a fresh practice path."
            : diagnosticDone
              ? "Complete the current challenge to unlock the next step on your diagnostic roadmap."
              : "Finish your diagnostic to generate a personalized roadmap, then practice challenges in order."}
        </p>
      </div>

      {rediagnosticUnlocked ? (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-5">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider text-primary">
            Cycle {cycle} unlocked
          </p>
          <h2 className="mt-2 headline-sm text-on-surface">
            Roadmap complete — take a harder diagnostic
          </h2>
          <p className="mt-2 body-sm text-on-surface-variant">
            Higher-tier questions and scenarios
            {bump > 0 ? ` (difficulty bump +${bump})` : ""}. Your next plan
            replaces this one.
          </p>
          <Button asChild className="mt-4">
            <Link href="/diagnostic">Start harder diagnostic</Link>
          </Button>
        </div>
      ) : null}

      {diagnosticDone && !roadmapComplete ? <TodayChallengeCard /> : null}

      {diagnosticDone && roadmapComplete ? (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-5">
          <h2 className="headline-sm text-on-surface">Practice complete</h2>
          <p className="mt-2 body-sm text-on-surface-variant">
            {closedCount} of {totalSteps} roadmap steps closed. No challenge is
            assigned until you re-diagnose.
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
        <div>
          <p className="body-sm text-on-surface">Skill Gap Analysis</p>
          <p className="body-sm text-on-surface-variant">
            {dashboard.open_gaps_count
              ? `${dashboard.open_gaps_count} open gap${dashboard.open_gaps_count === 1 ? "" : "s"}`
              : "Review diagnostic gaps and closed practice areas"}
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/skill-gaps">View skill gaps</Link>
        </Button>
      </div>

      {diagnosticDone && previewSteps.length > 0 && !roadmapComplete ? (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="headline-sm text-on-surface">Roadmap preview</h2>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider text-on-surface-variant">
              {totalSteps} steps
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {previewSteps.map((step, index) => {
              const title =
                step.topic ||
                step.gap?.skill?.name ||
                step.challenge?.title ||
                `Step ${index + 1}`;
              const status = (step.status || "not_started").toLowerCase();
              const isCurrent =
                status !== "closed" &&
                status !== "mastered" &&
                index === firstOpenIndex;
              return (
                <li
                  key={`${title}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-lowest px-3 py-2"
                >
                  <span className="body-sm capitalize text-on-surface">
                    {formatTopic(title)}
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-on-surface-variant">
                    {status === "closed" || status === "mastered"
                      ? "Done"
                      : isCurrent
                        ? "Current"
                        : "Locked"}
                  </span>
                </li>
              );
            })}
          </ul>
          {focusTopics.length ? (
            <p className="mt-3 body-sm text-on-surface-variant">
              Focus from your answers:{" "}
              {focusTopics.map(formatTopic).join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!diagnosticDone ? (
          <Button asChild>
            <Link href="/diagnostic">Continue diagnostic</Link>
          </Button>
        ) : null}
        {rediagnosticUnlocked ? (
          <Button asChild>
            <Link href="/diagnostic">Harder diagnostic</Link>
          </Button>
        ) : null}
        <Button asChild variant={diagnosticDone ? "default" : "secondary"}>
          <Link href="/roadmap">Full roadmap</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/skill-gaps">Skill gaps</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sessions">Sessions</Link>
        </Button>
      </div>
    </div>
  );
}
