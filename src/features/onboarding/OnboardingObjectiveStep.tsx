"use client";

import { OnboardingShell } from "@/components/layout/OnboardingShell";
import { cn } from "@/lib/utils";

export type OnboardingGoal = "current-job" | "new-role";

const GOALS: {
  id: OnboardingGoal;
  option: string;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    id: "current-job",
    option: "01",
    icon: "trending_up",
    title: "Become better at my current job",
    description:
      "Strengthen the skills you use today and increase daily velocity.",
  },
  {
    id: "new-role",
    option: "02",
    icon: "rocket_launch",
    title: "Switch to a new role",
    description:
      "Build the skills required for your next role with a guided path.",
  },
];

export function goalLabel(goal: OnboardingGoal) {
  return GOALS.find((g) => g.id === goal)?.title ?? goal;
}

type Props = {
  selected: OnboardingGoal | null;
  onSelect: (goal: OnboardingGoal) => void;
  onContinue: () => void;
  onBack?: () => void;
  isLoading?: boolean;
};

export function OnboardingObjectiveStep({
  selected,
  onSelect,
  onContinue,
  onBack,
  isLoading,
}: Props) {
  return (
    <OnboardingShell
      maxWidthClassName="max-w-3xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-4 py-2.5 body-sm text-on-surface transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back
          </button>
          <button
            type="button"
            disabled={!selected || isLoading}
            onClick={onContinue}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2.5 headline-sm transition-all",
              selected
                ? "bg-primary text-on-primary shadow-md hover:bg-primary-container hover:text-on-primary-container"
                : "cursor-not-allowed bg-surface-container-highest text-on-surface-variant opacity-50",
            )}
          >
            {isLoading ? "Saving…" : "Continue"}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      }
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-widest text-primary">
          Onboarding
        </span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-wider text-on-surface-variant">
          STEP 02 / 03
        </span>
      </div>
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div className="h-full w-2/3 bg-primary" />
      </div>

      <h1 className="text-[28px] font-semibold leading-8 tracking-tight text-on-surface sm:text-[32px] sm:leading-9">
        What are you trying to achieve?
      </h1>
      <p className="mt-1.5 body-sm text-on-surface-variant">
        Pick one objective so we can calibrate your path.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {GOALS.map((goal) => {
          const active = selected === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "flex min-h-0 flex-col rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-outline-variant/30 bg-surface-container hover:border-outline-variant",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    active ? "bg-primary text-on-primary" : "bg-surface-bright",
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {goal.icon}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
                  {goal.option}
                </span>
              </div>
              <h2 className="headline-sm text-on-surface">{goal.title}</h2>
              <p className="mt-1.5 body-sm text-on-surface-variant">
                {goal.description}
              </p>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
