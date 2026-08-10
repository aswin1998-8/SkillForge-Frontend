"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type FrameworkSlug = "react" | "nextjs" | "django" | "fastapi";

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
  subtitle = "Select the stacks you use today. Fundamentals for each language family are included automatically.",
}: Props) {
  const selected = useMemo(() => new Set(frameworks), [frameworks]);
  const canContinue = frameworks.length > 0 && !isLoading;

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-28 pt-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-outline-variant/30 pb-6 md:flex-row md:items-end">
          <div>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
              Onboarding sequence
            </span>
            <h1 className="display-sm mt-3 text-on-background">{title}</h1>
            <p className="body-md mt-2 max-w-2xl text-on-surface-variant">{subtitle}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FRAMEWORKS.map((fw) => {
            const active = selected.has(fw.id);
            return (
              <button
                key={fw.id}
                type="button"
                onClick={() => onToggleFramework(fw.id)}
                className={cn(
                  "flex flex-col rounded-2xl border p-6 text-left transition-all",
                  active
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-outline-variant/40 bg-surface-container hover:border-outline-variant",
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="material-symbols-outlined text-[28px] text-primary">
                    {fw.icon}
                  </span>
                  {active ? (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  ) : null}
                </div>
                <h2 className="headline-sm text-on-surface">{fw.title}</h2>
                <p className="body-sm mt-2 text-on-surface-variant">{fw.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fw.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-high px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-outline-variant/30 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          {onBack ? (
            <button type="button" onClick={onBack} className="body-sm text-on-surface-variant">
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="rounded-xl bg-primary px-8 py-3 headline-sm text-on-primary disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
