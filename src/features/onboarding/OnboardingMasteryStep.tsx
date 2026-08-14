"use client";

import { useMemo } from "react";
import { OnboardingShell } from "@/components/layout/OnboardingShell";
import { cn } from "@/lib/utils";

export type FrameworkSlug =
  | "react"
  | "nextjs"
  | "django"
  | "fastapi"
  | "postgresql";

const FRAMEWORKS: {
  id: FrameworkSlug;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}[] = [
  {
    id: "react",
    icon: "code_blocks",
    title: "React",
    description: "Components, hooks, state, and rendering performance.",
    tags: ["Hooks", "State"],
  },
  {
    id: "nextjs",
    icon: "web",
    title: "Next.js",
    description: "App Router, SSR/SSG, data fetching, and deployment.",
    tags: ["Routing", "SSR"],
  },
  {
    id: "django",
    icon: "dns",
    title: "Django",
    description: "ORM, views, auth, middleware, and API patterns.",
    tags: ["ORM", "Auth"],
  },
  {
    id: "fastapi",
    icon: "bolt",
    title: "FastAPI",
    description: "Async APIs, validation, dependencies, and testing.",
    tags: ["Async", "Pydantic"],
  },
  {
    id: "postgresql",
    icon: "database",
    title: "PostgreSQL",
    description: "Schema design, indexing, transactions, and query plans.",
    tags: ["SQL", "Indexes"],
  },
];

export function frameworkLabel(id: FrameworkSlug) {
  return FRAMEWORKS.find((f) => f.id === id)?.title ?? id;
}

export function frameworkLabels(ids: FrameworkSlug[]) {
  return ids.map(frameworkLabel).join(", ");
}

type Props = {
  frameworks: FrameworkSlug[];
  onToggleFramework: (framework: FrameworkSlug) => void;
  onContinue: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
};

export function OnboardingMasteryStep({
  frameworks,
  onToggleFramework,
  onContinue,
  onBack,
  isLoading,
  title = "Which frameworks should we assess?",
  subtitle = "Select the stacks for this diagnostic. Fundamentals for each language family are included automatically.",
}: Props) {
  const selected = useMemo(() => new Set(frameworks), [frameworks]);
  const canContinue = frameworks.length > 0 && !isLoading;

  return (
    <OnboardingShell
      maxWidthClassName="max-w-4xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="body-sm text-on-surface-variant"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-primary shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Continue"}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      }
    >
      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-widest text-primary">
        Onboarding
      </span>
      <h1 className="mt-2 text-[28px] font-semibold leading-8 tracking-tight text-on-surface sm:text-[32px] sm:leading-9">
        {title}
      </h1>
      <p className="mt-1.5 max-w-2xl body-sm text-on-surface-variant">
        {subtitle}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FRAMEWORKS.map((fw) => {
          const active = selected.has(fw.id);
          return (
            <button
              key={fw.id}
              type="button"
              onClick={() => onToggleFramework(fw.id)}
              className={cn(
                "flex flex-col rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-outline-variant/40 bg-surface-container hover:border-outline-variant",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="material-symbols-outlined text-[22px] text-primary">
                  {fw.icon}
                </span>
                {active ? (
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    check_circle
                  </span>
                ) : null}
              </div>
              <h2 className="headline-sm text-on-surface">{fw.title}</h2>
              <p className="mt-1 body-sm text-on-surface-variant">
                {fw.description}
              </p>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
