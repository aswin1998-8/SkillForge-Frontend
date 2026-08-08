"use client";

import { cn } from "@/lib/utils";

export type OnboardingGoal = "current-job" | "new-role";

const GOALS: {
  id: OnboardingGoal;
  option: string;
  icon: string;
  title: string;
  description: string;
  watermark: "up-right" | "right";
}[] = [
  {
    id: "current-job",
    option: "[ OPTION 01 ]",
    icon: "trending_up",
    title: "Become better at my current job",
    description:
      "Strengthen the skills you use today. Master your current tech stack and increase your daily velocity.",
    watermark: "up-right",
  },
  {
    id: "new-role",
    option: "[ OPTION 02 ]",
    icon: "rocket_launch",
    title: "Switch to a new role",
    description:
      "Build the skills required for your next role. Follow guided pathways designed for career transition.",
    watermark: "right",
  },
];

export function goalLabel(goal: OnboardingGoal) {
  return GOALS.find((g) => g.id === goal)?.title ?? goal;
}

type Props = {
  selected: OnboardingGoal | null;
  onSelect: (goal: OnboardingGoal) => void;
  onContinue: () => void;
  isLoading?: boolean;
};

export function OnboardingObjectiveStep({
  selected,
  onSelect,
  onContinue,
  isLoading,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[1024px] flex-col px-6 pb-10">
      <div className="mb-10 mt-10 flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
            Onboarding sequence
          </span>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
            STEP 02 // 03
          </span>
        </div>
        <div className="flex h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div className="w-1/3 bg-primary-fixed-dim opacity-50" />
          <div className="relative w-1/3 overflow-hidden bg-primary">
            <div className="absolute inset-0 h-full w-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-inverse-surface/30 to-transparent" />
          </div>
          <div className="w-1/3 bg-transparent" />
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-4">
        <h1 className="display-lg max-w-2xl text-on-background !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
          What are you trying to achieve?
        </h1>
        <p className="body-lg max-w-xl text-on-surface-variant">
          Select your primary technical objective to help ForgeIQ calibrate your
          learning pathways and skill assessments.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {GOALS.map((goal) => {
          const active = selected === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl text-left shadow-sm transition-all duration-300",
                active
                  ? "bg-surface-container-highest shadow-xl"
                  : "bg-surface-container hover:bg-surface-container-highest hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "absolute bottom-0 left-0 top-0 w-2 bg-primary transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute right-0 top-0 p-6 transition-opacity duration-500",
                  active ? "opacity-20" : "opacity-10 group-hover:opacity-20",
                )}
              >
                {goal.watermark === "up-right" ? (
                  <svg
                    className="text-on-surface"
                    fill="none"
                    height="120"
                    viewBox="0 0 120 120"
                    width="120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 100L100 20M100 20H40M100 20V80"
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth="8"
                    />
                    <circle cx="20" cy="100" fill="currentColor" r="6" />
                    <circle cx="100" cy="20" fill="currentColor" r="6" />
                  </svg>
                ) : (
                  <svg
                    className="text-on-surface"
                    fill="none"
                    height="120"
                    viewBox="0 0 120 120"
                    width="120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 60H100M100 60L70 30M100 60L70 90"
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth="8"
                    />
                    <circle cx="20" cy="60" fill="currentColor" r="6" />
                  </svg>
                )}
              </div>

              <div className="relative z-10 flex h-full flex-col p-10">
                <div className="mb-auto flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110",
                      active ? "bg-primary" : "bg-surface-bright",
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined text-[24px]",
                        active ? "text-on-primary" : "text-on-surface",
                      )}
                    >
                      {goal.icon}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant opacity-50">
                    {goal.option}
                  </span>
                </div>
                <div className="mt-10">
                  <h2 className="headline-md mb-2 text-on-surface">
                    {goal.title}
                  </h2>
                  <p
                    className={cn(
                      "body-sm transition-colors duration-300",
                      active
                        ? "text-on-surface"
                        : "text-on-surface-variant group-hover:text-on-surface",
                    )}
                  >
                    {goal.description}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-end pt-10">
        <button
          type="button"
          disabled={!selected || isLoading}
          onClick={onContinue}
          className={cn(
            "flex items-center gap-2 rounded-lg px-6 py-4 headline-sm transition-all duration-300",
            selected
              ? "cursor-pointer bg-primary text-on-primary shadow-md hover:bg-primary-container hover:text-on-primary-container"
              : "cursor-not-allowed bg-surface-container-highest text-on-surface-variant opacity-50",
          )}
        >
          {isLoading ? "Saving…" : "Continue Process"}
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
