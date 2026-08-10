"use client";

import Link from "next/link";
import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";
import { resolveFocusFrameworkLabels } from "@/lib/growthPath";
import { cn } from "@/lib/utils";

const PHASE1_CARDS = [
  {
    id: "xstate",
    icon: "memory",
    iconClass: "text-secondary",
    title: "State Machines (XState)",
    progress: 100,
    barClass: "bg-secondary",
    statusIcon: "check_circle",
    statusClass: "opacity-50 group-hover/card:opacity-100 group-hover/card:text-primary",
  },
  {
    id: "render",
    icon: "speed",
    iconClass: "text-primary",
    title: "Render Optimization at Scale",
    progress: 45,
    barClass: "bg-primary",
    statusIcon: "radio_button_checked",
    statusClass: "text-primary opacity-80 animate-pulse",
    glow: true,
  },
  {
    id: "mfe",
    icon: "hub",
    iconClass: "",
    title: "Micro-frontends Architecture",
    progress: 0,
    barClass: "bg-outline",
    statusIcon: "radio_button_unchecked",
    statusClass: "text-outline-variant",
    muted: true,
  },
];

const PHASE2_ITEMS = [
  "Core Web Vitals Regression Testing Pipeline",
  "Edge Compute & SSR Caching Strategies",
];

const BENCHMARKS = [
  { label: "System Design", level: 4, color: "bg-secondary", text: "text-secondary" },
  { label: "Cross-team Impact", level: 3, color: "bg-primary", text: "text-primary" },
  {
    label: "Domain Depth (Frontend)",
    level: 5,
    color: "bg-tertiary",
    text: "text-tertiary",
  },
];

export function RoadmapCurrentJobView() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();

  const roleTitle =
    profile?.current_role ||
    user?.profile?.current_role ||
    "Senior Frontend Developer";

  const focusDomain = resolveFocusFrameworkLabels(profile?.technical_goal);
  const focusLine =
    focusDomain.toLowerCase().includes("performance") ||
    focusDomain.toLowerCase().includes("reliability")
      ? "System Architecture & Performance Engineering"
      : focusDomain.toLowerCase().includes("communication")
        ? "Technical Communication & Leadership"
        : focusDomain.toLowerCase().includes("ai")
          ? "AI-Augmented Engineering"
          : "System Architecture & Performance Engineering";

  const mastery = 68;

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="relative flex w-full flex-col items-start justify-between gap-6 border-b border-outline-variant/30 bg-surface-dim px-6 py-10 xl:flex-row xl:items-end">
        <div className="flex max-w-3xl flex-col gap-2">
          <div className="mb-1 flex flex-wrap items-center gap-4">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
              Active Growth Plan
            </span>
            <span className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface-variant">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-fixed" />{" "}
              Tracking Domain Mastery
            </span>
          </div>
          <h1 className="display-lg leading-tight tracking-tight text-on-surface !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
            Growth Plan:
            <br />
            <span className="text-primary">{roleTitle}</span>
          </h1>
          <p className="mt-2 headline-sm text-on-surface-variant">
            Focus: {focusLine}
          </p>
        </div>

        <div className="group relative min-w-[200px] overflow-hidden rounded-xl border border-outline-variant/50 bg-surface p-4">
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
            <div className="absolute left-0 top-0 h-full w-8 animate-[shimmer_2s_infinite] bg-white/20 blur-sm" />
          </div>
          <div className="mt-1 w-full text-right body-sm text-on-surface-variant">
            Estimated time to completion:{" "}
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-on-surface">
              ~4 months
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-10 xl:flex-row">
        <div className="flex flex-1 flex-col gap-10">
          <div className="group relative border-l border-primary/30 pb-10 pl-10">
            <div className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-surface">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
            <div className="-mt-1 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="rounded-md bg-primary/10 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                  Phase 1
                </span>
                <span className="body-sm text-on-surface-variant">In Progress</span>
              </div>
              <h2 className="headline-md text-on-surface">
                Advanced Frontend Patterns
              </h2>
              <p className="mb-4 max-w-2xl body-lg text-on-surface-variant">
                Deepening structural knowledge. Moving beyond component creation
                to architecting resilient, scaleable UI layers for enterprise
                applications.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {PHASE1_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className={cn(
                      "group/card relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container p-4 transition-colors hover:border-primary/50",
                      card.glow &&
                        "shadow-[0_0_15px_rgba(173,198,255,0.05)]",
                      card.muted && "opacity-80 hover:border-outline-variant",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute right-0 top-0 p-2 transition-all",
                        card.statusClass,
                      )}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {card.statusIcon}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-2 body-lg",
                        card.muted ? "text-on-surface-variant" : "text-on-surface",
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined",
                          card.iconClass,
                        )}
                      >
                        {card.icon}
                      </span>
                      {card.title}
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className={cn("h-full", card.barClass)}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative border-l border-outline-variant/30 pb-10 pl-10 opacity-60 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline-variant bg-surface" />
            <div className="-mt-1 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="rounded-md bg-surface-container-highest px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-outline">
                  Phase 2
                </span>
                <span className="body-sm text-outline-variant">Locked</span>
              </div>
              <h2 className="headline-md text-on-surface">
                System Design & Performance
              </h2>
              <p className="max-w-2xl body-lg text-on-surface-variant">
                Mastering the intersection of frontend delivery and backend
                infrastructure to minimize latency globally.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {PHASE2_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-lg border border-outline-variant/20 bg-surface-container/50 p-4"
                  >
                    <span className="material-symbols-outlined text-outline">
                      lock
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface-variant">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative border-l border-transparent pl-10 opacity-40 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline-variant/50 bg-surface" />
            <div className="-mt-1 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="rounded-md bg-surface-container-highest/50 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-outline/50">
                  Phase 3
                </span>
                <span className="body-sm text-outline-variant">Locked</span>
              </div>
              <h2 className="headline-md text-on-surface">
                Technical Leadership
              </h2>
              <p className="max-w-2xl body-lg text-on-surface-variant">
                Influencing engineering culture and driving broad technical
                initiatives across multiple teams.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-96">
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-highest p-6 shadow-lg">
            <span className="material-symbols-outlined pointer-events-none absolute -right-10 -top-10 text-9xl text-surface-container-lowest opacity-20">
              network_node
            </span>
            <h3 className="border-b border-outline-variant/20 pb-2 headline-sm text-on-surface">
              Current Deep Dive
            </h3>
            <div className="flex flex-col gap-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-primary">
                Performance Engineering
              </span>
              <p className="body-sm text-on-surface-variant">
                Focusing on reducing TTFB and INP metrics across the primary web
                application suite.
              </p>
            </div>
            <div className="mt-4 rounded-lg border border-outline-variant/20 bg-surface p-4 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface-variant">
              <div className="mb-2 flex justify-between">
                <span>INP (p75)</span>{" "}
                <span className="text-error">240ms</span>
              </div>
              <div className="mb-4 h-1 w-full rounded-full bg-surface-container-highest">
                <div className="h-full bg-error" style={{ width: "80%" }} />
              </div>
              <div className="flex justify-between">
                <span>Target</span>{" "}
                <span className="text-[#10B981]">&lt;100ms</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-surface-container p-6">
            <h3 className="border-b border-outline-variant/20 pb-2 headline-sm text-on-surface">
              Mastery Benchmarks
            </h3>
            <p className="mb-2 body-sm text-on-surface-variant">
              Current assessment against Staff/Principal level expectations in
              your domain.
            </p>
            <div className="flex flex-col gap-6">
              {BENCHMARKS.map((b) => (
                <div key={b.label} className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "flex justify-between font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium text-on-surface",
                    )}
                  >
                    <span>{b.label}</span>
                    <span className={b.text}>Level {b.level}/5</span>
                  </div>
                  <div className="flex h-2 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm",
                          i < b.level
                            ? b.color
                            : "border border-outline-variant/20 bg-surface-container-highest",
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/settings"
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/50 bg-inverse-on-surface py-4 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-bright"
          >
            <span className="material-symbols-outlined text-sm">
              edit_document
            </span>
            Update Plan Context
          </Link>
        </div>
      </div>

      <footer className="mt-10 border-t border-outline-variant/20 bg-surface-container-lowest py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 body-sm text-on-surface-variant md:flex-row">
          <div>© 2024 Honed Systems Inc.</div>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-primary" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Status
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
