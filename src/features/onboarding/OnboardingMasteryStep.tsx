"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type TechnicalDomain =
  | "ai-augmented"
  | "system-design"
  | "reliability"
  | "communication";

const DOMAINS: {
  id: TechnicalDomain;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}[] = [
  {
    id: "ai-augmented",
    icon: "psychology",
    title: "AI-Augmented Engineering",
    description: "Integrate AI into your existing developer workflow.",
    tags: ["Copilot", "LLMs"],
  },
  {
    id: "system-design",
    icon: "architecture",
    title: "System Design & Architecture",
    description: "Master high-level patterns and scalable infrastructure.",
    tags: ["Microservices", "Scale"],
  },
  {
    id: "reliability",
    icon: "speed",
    title: "Reliability & Performance",
    description:
      "Focus on observability, latency, and high-availability systems.",
    tags: ["Observability"],
  },
  {
    id: "communication",
    icon: "forum",
    title: "Technical Communication",
    description:
      "Strengthen your ability to defend architecture and lead teams.",
    tags: ["Leadership", "RFCs"],
  },
];

export function domainLabel(id: TechnicalDomain) {
  return DOMAINS.find((d) => d.id === id)?.title ?? id;
}

export function domainLabels(ids: TechnicalDomain[]) {
  return ids.map(domainLabel).join(", ");
}

type Props = {
  domains: TechnicalDomain[];
  onToggleDomain: (domain: TechnicalDomain) => void;
  onContinue: () => void;
  onBack?: () => void;
  isLoading?: boolean;
};

export function OnboardingMasteryStep({
  domains,
  onToggleDomain,
  onContinue,
  onBack,
  isLoading,
}: Props) {
  const selected = useMemo(() => new Set(domains), [domains]);
  const canContinue = domains.length > 0 && !isLoading;

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-28 pt-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-outline-variant/30 pb-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="display-lg tracking-tight text-on-surface !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
              What do you want to master?
            </h1>
            <p className="body-lg max-w-3xl text-on-surface-variant">
              Choose one or more technical domains. Your diagnostic will cover
              competencies from these areas.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Step 02 // 03
          </div>
        </header>

        <section className="mb-6 flex-grow">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="headline-sm text-on-surface">Technical Domains</h2>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
              {domains.length
                ? `${domains.length} selected`
                : "Select at least one"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DOMAINS.map((item) => {
              const active = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleDomain(item.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border p-6 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant/50 bg-surface-container-low hover:border-primary/80",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity",
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute right-0 top-0 p-4 text-primary transition-all",
                      active
                        ? "opacity-100"
                        : "translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={
                        active
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {active ? "check_circle" : "add_circle"}
                    </span>
                  </div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg border text-primary",
                        active
                          ? "border-primary/30 bg-primary/20 shadow-[0_0_15px_rgba(77,142,255,0.3)]"
                          : "border-outline-variant/30 bg-surface-container",
                      )}
                    >
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "mb-1 headline-sm transition-colors",
                          active
                            ? "text-primary"
                            : "text-on-surface group-hover:text-primary",
                        )}
                      >
                        {item.title}
                      </h3>
                      <p className="body-sm text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "rounded px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-medium uppercase tracking-widest",
                            active
                              ? "border border-primary/20 bg-primary/10 text-primary"
                              : "bg-surface-container-highest text-on-surface-variant",
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-outline-variant/30 bg-surface/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-5 py-4 body-sm text-on-surface transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="group flex items-center gap-2 rounded-lg bg-primary px-10 py-4 headline-sm text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Continue Process"}
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
