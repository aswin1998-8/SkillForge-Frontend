"use client";

import Link from "next/link";
import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";
import { useGetRoadmapQuery } from "@/services/api/progressApi";
import { resolveFocusFrameworkLabels } from "@/lib/growthPath";
import { cn } from "@/lib/utils";
import type { RoadmapStep } from "@/types/api";

function normalizeStatus(status?: string) {
  const s = (status || "not_started").toLowerCase();
  if (s === "closed" || s === "mastered") return "closed";
  if (s === "in_progress" || s === "active") return "in_progress";
  return "not_started";
}

function statusMeta(status?: string) {
  const normalized = normalizeStatus(status);
  if (normalized === "closed") {
    return {
      label: "Closed",
      icon: "check_circle",
      barClass: "bg-secondary",
      progress: 100,
      statusClass: "text-secondary",
    };
  }
  if (normalized === "in_progress") {
    return {
      label: "In progress",
      icon: "radio_button_checked",
      barClass: "bg-primary",
      progress: 45,
      statusClass: "text-primary animate-pulse",
    };
  }
  return {
    label: "Not started",
    icon: "radio_button_unchecked",
    barClass: "bg-outline",
    progress: 0,
    statusClass: "text-outline-variant",
  };
}

function stepHref(step: RoadmapStep, fallback: string) {
  if (step.challenge?.id) return `/challenges/${step.challenge.id}`;
  const suggested = step.suggested_challenges?.[0];
  if (suggested?.id) return `/challenges/${suggested.id}`;
  return fallback;
}

function stepTitle(step: RoadmapStep, index: number) {
  return (
    step.topic ||
    step.gap?.skill?.name ||
    step.challenge?.title ||
    `Step ${index + 1}`
  );
}

function stepSubtitle(step: RoadmapStep) {
  if (step.challenge?.title) {
    return step.challenge.title;
  }
  if (step.modality) {
    return "Challenge not linked yet — rematch from diagnostic stack";
  }
  return "Diagnostic practice step";
}

function statusLabel(
  normalized: string,
  isActionable: boolean,
): string {
  if (normalized === "closed") return "Mastered";
  if (isActionable) return "Current";
  return "Upcoming";
}

export function RoadmapCurrentJobView() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();
  const { data, isLoading, error } = useGetRoadmapQuery();

  const roleTitle =
    profile?.current_role ||
    user?.profile?.current_role ||
    "Engineer";

  const targetLabel =
    profile?.target_role_label ||
    user?.profile?.target_role_label ||
    user?.profile?.target_role?.name ||
    "";

  const focusDomain = resolveFocusFrameworkLabels(
    profile?.technical_goal || user?.profile?.technical_goal,
  );
  const steps = data?.steps ?? [];
  const firstOpenIndex = steps.findIndex(
    (s) => normalizeStatus(s.status) !== "closed",
  );
  const closedCount = steps.filter(
    (s) => normalizeStatus(s.status) === "closed",
  ).length;
  const mastery = steps.length
    ? Math.round((closedCount / steps.length) * 100)
    : 0;
  const fallbackChallenge =
    data?.suggested_challenges?.[0]?.id != null
      ? `/challenges/${data.suggested_challenges[0].id}`
      : "/challenges/today";
  const activeStep =
    steps.find((s) => normalizeStatus(s.status) === "in_progress") ||
    (firstOpenIndex >= 0 ? steps[firstOpenIndex] : undefined) ||
    steps[0];

  const focusFromSynthesis =
    data?.focus_skills?.[0] ||
    (activeStep ? stepTitle(activeStep, 0) : null);

  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] w-full min-w-0 flex-col overflow-x-hidden bg-background sm:min-h-[calc(100vh-64px)]">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="relative flex w-full min-w-0 flex-col items-start justify-between gap-6 border-b border-outline-variant/30 bg-surface-dim px-4 py-6 sm:px-6 sm:py-10 xl:flex-row xl:items-end">
        <div className="flex min-w-0 max-w-3xl flex-col gap-2">
          <div className="mb-1 flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-widest text-primary sm:px-4 sm:text-[12px]">
              {data?.source === "diagnostic_synthesis"
                ? "From your diagnostic"
                : "Active Growth Plan"}
            </span>
            <span className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant sm:text-[13px]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-fixed" />{" "}
              Sequential unlock
            </span>
          </div>
          <h1 className="display-lg leading-tight tracking-tight text-on-surface !text-[32px] !leading-[40px] sm:!text-[48px] sm:!leading-[56px]">
            Growth Plan:
            <br />
            <span className="break-words text-primary">{roleTitle}</span>
          </h1>
          <p className="mt-2 break-words headline-sm text-on-surface-variant">
            Focus: {focusDomain}
            {targetLabel ? ` · toward ${targetLabel}` : ""}
          </p>
        </div>

        <div className="group relative w-full min-w-0 overflow-hidden rounded-xl border border-outline-variant/50 bg-surface p-4 sm:w-auto sm:min-w-[200px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex w-full justify-between font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
            <span>Overall Mastery</span>
            <span className="text-primary">{mastery}%</span>
          </div>
          <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${mastery}%` }}
            />
          </div>
          <div className="mt-1 w-full text-right body-sm text-on-surface-variant">
            {closedCount} of {steps.length || 0} steps closed
          </div>
        </div>
      </div>

      {mastery >= 100 && steps.length > 0 ? (
        <div className="relative z-10 border-b border-outline-variant/30 bg-primary/10 px-6 py-4">
          <p className="mx-auto max-w-[1440px] body-sm text-on-surface">
            Plan complete — return{" "}
            <Link href="/dashboard" className="text-primary underline-offset-2 hover:underline">
              Home
            </Link>{" "}
            to unlock a harder diagnostic.
          </p>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="group relative border-l border-primary/30 pb-4 pl-6 sm:pl-10">
            <div className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-surface">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
            <div className="-mt-1 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="rounded-md bg-primary/10 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                  Roadmap
                </span>
                <span className="body-sm text-on-surface-variant">
                  {isLoading ? "Loading…" : `${steps.length} steps`}
                </span>
              </div>
              <h2 className="headline-md text-on-surface">Practice path</h2>
              <p className="mb-2 max-w-2xl body-lg text-on-surface-variant">
                Built from your diagnostic answers across your selected stack.
                Every competency stays visible — complete the current challenge
                to unlock the next one.
              </p>

              {error ? (
                <p className="body-sm text-danger">Could not load roadmap.</p>
              ) : null}

              {!isLoading && !steps.length ? (
                <div className="rounded-xl border border-outline-variant/40 bg-surface-container p-6">
                  <p className="body-sm text-on-surface-variant">
                    No roadmap steps yet. Complete a diagnostic to generate your
                    path from your scores — not a generic stub curriculum.
                  </p>
                  <Link
                    href="/diagnostic"
                    className="mt-4 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-primary shadow-sm transition-colors"
                  >
                    Start diagnostic
                  </Link>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {steps.map((step, i) => {
                  const meta = statusMeta(step.status);
                  const href = stepHref(step, fallbackChallenge);
                  const normalized = normalizeStatus(step.status);
                  const isActionable =
                    normalized !== "closed" && i === firstOpenIndex;
                  const cardClass = cn(
                    "group/card relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container p-4 transition-colors",
                    isActionable
                      ? "border-primary/60 hover:border-primary/80"
                      : "opacity-90",
                  );
                  const body = (
                    <>
                      <div
                        className={cn(
                          "absolute right-0 top-0 p-2 transition-all",
                          meta.statusClass,
                        )}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {normalized === "closed"
                            ? "check_circle"
                            : isActionable
                              ? "play_circle"
                              : "schedule"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 pr-8">
                        <div className="flex items-center gap-2 body-lg text-on-surface">
                          <span className="material-symbols-outlined text-primary">
                            {step.modality === "CODING"
                              ? "code"
                              : step.modality === "RESEARCH"
                                ? "travel_explore"
                                : "bolt"}
                          </span>
                          <span className="capitalize">
                            {stepTitle(step, i).replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="body-sm text-on-surface-variant">
                          {stepSubtitle(step)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-wider text-on-surface-variant">
                        <span>{step.modality || "THEORY"}</span>
                        <span>·</span>
                        <span>
                          {statusLabel(normalized, isActionable)}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                        <div
                          className={cn("h-full", meta.barClass)}
                          style={{
                            width: `${
                              normalized === "closed"
                                ? 100
                                : isActionable
                                  ? 45
                                  : 0
                            }%`,
                          }}
                        />
                      </div>
                    </>
                  );
                  return isActionable ? (
                    <Link
                      key={`${step.topic ?? step.gap?.id ?? i}-${i}`}
                      href={href}
                      className={cardClass}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      key={`${step.topic ?? step.gap?.id ?? i}-${i}`}
                      className={cardClass}
                    >
                      {body}
                    </div>
                  );
                })}
              </div>

              {activeStep ? (
                <Link
                  href={stepHref(activeStep, fallbackChallenge)}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 body-sm text-on-primary"
                >
                  Open current challenge
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-96">
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-highest p-6 shadow-lg">
            <h3 className="border-b border-outline-variant/20 pb-2 headline-sm text-on-surface">
              Current focus
            </h3>
            {activeStep ? (
              <div className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-primary">
                  {activeStep.modality || "Practice"}
                </span>
                <p className="body-sm capitalize text-on-surface">
                  {(focusFromSynthesis || stepTitle(activeStep, 0)).replaceAll(
                    "_",
                    " ",
                  )}
                </p>
                <p className="body-sm text-on-surface-variant">
                  {stepSubtitle(activeStep)}
                </p>
                <p className="body-sm text-on-surface-variant">
                  Complete this challenge to unlock the next roadmap step.
                </p>
                <Link
                  href={stepHref(activeStep, "/challenges/today")}
                  className="mt-2 rounded-lg bg-primary px-4 py-2 text-center body-sm text-on-primary"
                >
                  Continue
                </Link>
              </div>
            ) : (
              <p className="body-sm text-on-surface-variant">
                Complete a diagnostic to unlock focus areas.
              </p>
            )}
          </div>

          {(data?.focus_skills || []).length > 0 ? (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
              <h3 className="headline-sm text-on-surface">Gap topics</h3>
              <ul className="mt-3 space-y-2">
                {(data?.focus_skills || []).map((skill) => (
                  <li
                    key={skill}
                    className="body-sm capitalize text-on-surface-variant"
                  >
                    {skill.replaceAll("_", " ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
