"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";
import { useGetRoadmapQuery } from "@/services/api/progressApi";
import { resolveGrowthPath } from "@/lib/growthPath";
import { RoadmapCurrentJobView } from "@/features/roadmap/RoadmapCurrentJobView";
import { cn } from "@/lib/utils";
import type { RoadmapData, User } from "@/types/api";

type NodeStatus = "mastered" | "active" | "locked";

type PlanNode = {
  id: string;
  title: string;
  description: string;
  hours?: string;
  level: string;
  status: NodeStatus;
  criticalGap?: boolean;
  progress?: number;
  remaining?: string;
  href?: string;
};

type Phase = {
  id: string;
  title: string;
  active?: boolean;
  locked?: boolean;
  nodes: PlanNode[];
};

const DEMO_PHASES: Phase[] = [
  {
    id: "p1",
    title: "Phase 1: Foundations",
    nodes: [
      {
        id: "se-fundamentals",
        title: "SE Fundamentals",
        description:
          "API Architecture, State Management, Async Operations & Streaming.",
        hours: "8h",
        level: "Beginner",
        status: "mastered",
      },
    ],
  },
  {
    id: "p2",
    title: "Phase 2: Core AI Integration",
    active: true,
    nodes: [
      {
        id: "rag",
        title: "RAG & Retrieval",
        description:
          "Vector databases, chunking strategies, semantic search integration.",
        level: "Intermediate",
        status: "active",
        criticalGap: true,
        progress: 15,
        remaining: "Est. 24h remaining",
        href: "/challenges/today",
      },
      {
        id: "prompt",
        title: "Prompt Engineering",
        description:
          "Few-shot prompting, chain of thought, instruction tuning.",
        hours: "16h",
        level: "Intermediate",
        status: "locked",
      },
    ],
  },
  {
    id: "p3",
    title: "Phase 3: Advanced Systems",
    locked: true,
    nodes: [
      {
        id: "agent",
        title: "Agent Reliability",
        description: "Tool use, autonomous reasoning, error recovery loops.",
        level: "Advanced",
        status: "locked",
        criticalGap: true,
      },
      {
        id: "security",
        title: "AI Security",
        description:
          "Prompt injection defenses, output sanitization, sandboxing.",
        level: "Advanced",
        status: "locked",
        criticalGap: true,
      },
    ],
  },
];

function NodeCard({ node }: { node: PlanNode }) {
  if (node.status === "mastered") {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-primary/30 bg-surface-container-low p-4 transition-all hover:border-primary/60">
        <div className="absolute right-0 top-0 p-2">
          <span
            className="material-symbols-outlined text-[20px] text-green-400"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <div className="flex flex-col gap-1 pr-6">
          <h3 className="m-0 headline-sm text-on-surface">{node.title}</h3>
          <p className="m-0 line-clamp-2 body-sm text-on-surface-variant">
            {node.description}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-4 border-t border-outline-variant/10 pt-2">
          {node.hours ? (
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
                {node.hours}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">
              signal_cellular_alt
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
              {node.level}
            </span>
          </div>
          <span className="ml-auto inline-block rounded border border-green-500/20 bg-green-500/10 px-1 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-green-400">
            Mastered
          </span>
        </div>
      </div>
    );
  }

  if (node.status === "active") {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border-2 border-primary bg-surface-container-highest p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute right-0 top-0 p-2">
          <span className="material-symbols-outlined animate-pulse text-[20px] text-primary">
            pending
          </span>
        </div>
        <div className="relative z-10 flex flex-col gap-1 pr-6">
          {node.criticalGap ? (
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded border border-error/20 bg-error/10 px-1 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-error">
                Critical Gap
              </span>
            </div>
          ) : null}
          <h3 className="m-0 headline-sm text-on-surface">{node.title}</h3>
          <p className="m-0 line-clamp-2 body-sm text-on-surface-variant">
            {node.description}
          </p>
        </div>
        <div className="relative z-10 mt-2 flex flex-col gap-2">
          <div className="h-[4px] w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full bg-primary"
              style={{ width: `${node.progress ?? 15}%` }}
            />
          </div>
          <div className="flex justify-between font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-on-surface-variant">
            <span>{node.progress ?? 15}% Complete</span>
            <span>{node.remaining ?? "Est. 24h remaining"}</span>
          </div>
        </div>
        <div className="relative z-10 mt-auto flex items-center gap-4 border-t border-outline-variant/10 pt-2">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">
              signal_cellular_alt
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
              {node.level}
            </span>
          </div>
          <Link
            href={node.href || "/challenges/today"}
            className="ml-auto flex items-center gap-1 rounded bg-[#3b82f6] px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium text-white transition-colors hover:bg-[#3b82f6]/90"
          >
            Start Next Challenge
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:border-outline-variant/60",
        node.criticalGap && "border-dashed",
      )}
    >
      <div className="absolute right-0 top-0 p-2">
        <span className="material-symbols-outlined text-[20px] text-outline-variant">
          lock
        </span>
      </div>
      <div className="flex flex-col gap-1 pr-6 opacity-70">
        {node.criticalGap ? (
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded border border-error/10 bg-error/5 px-1 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-error/80">
              Critical Gap
            </span>
          </div>
        ) : null}
        <h3 className="m-0 headline-sm text-on-surface">{node.title}</h3>
        <p className="m-0 line-clamp-2 body-sm text-on-surface-variant">
          {node.description}
        </p>
      </div>
      <div className="mt-auto flex items-center gap-4 border-t border-outline-variant/10 pt-2 opacity-70">
        {node.hours ? (
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
              {node.hours}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">
              signal_cellular_alt
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
              {node.level}
            </span>
          </div>
        )}
        <span className="ml-auto inline-block rounded border border-outline-variant/30 bg-surface-variant px-1 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-on-surface-variant">
          Locked
        </span>
      </div>
    </div>
  );
}

function RoadmapRoleSwitchView({
  data,
  user,
}: {
  data?: RoadmapData;
  user?: User;
}) {
  const currentRole = user?.profile?.current_role || "Frontend Developer";
  const targetRole = user?.profile?.target_role?.name || "AI Engineer";
  const completion = 42;

  const challengeHref =
    data?.suggested_challenges?.[0]?.id != null
      ? `/challenges/${data.suggested_challenges[0].id}`
      : "/challenges/today";

  const phases: Phase[] = data?.steps?.length
    ? [
        {
          id: "api-phase",
          title: "Your Gap Path",
          active: true,
          nodes: data.steps.map((step, i) => {
            const status: NodeStatus =
              step.status === "CLOSED"
                ? "mastered"
                : i === 0 || step.status === "IN_PROGRESS"
                  ? "active"
                  : "locked";
            const firstChallenge = step.suggested_challenges[0];
            return {
              id: String(step.gap.id),
              title: step.gap.skill.name,
              description:
                step.gap.skill.description ||
                firstChallenge?.title ||
                "Close this gap with focused practice.",
              level:
                i === 0 ? "Intermediate" : i === 1 ? "Advanced" : "Beginner",
              status,
              criticalGap: status !== "mastered",
              progress: status === "active" ? 15 : undefined,
              remaining: status === "active" ? "Est. 24h remaining" : undefined,
              href: firstChallenge
                ? `/challenges/${firstChallenge.id}`
                : challengeHref,
            };
          }),
        },
      ]
    : DEMO_PHASES.map((phase) => ({
        ...phase,
        nodes: phase.nodes.map((n) =>
          n.status === "active" ? { ...n, href: challengeHref } : n,
        ),
      }));

  const criticalGaps =
    data?.steps
      ?.filter((s) => s.status !== "CLOSED")
      .slice(0, 2)
      .map((s, i) => ({
        title: s.gap.skill.name,
        detail: s.status === "NOT_STARTED" ? "Unknown" : "Concept Only",
        icon: i === 0 ? "api" : "security",
      })) ?? [
      { title: "Agent Reliability", detail: "Concept Only", icon: "api" },
      { title: "AI Security", detail: "Unknown", icon: "security" },
    ];

  return (
    <div className="flex w-full">
      <div className="flex-1 px-5 py-10">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="display-lg m-0 tracking-tight text-on-background !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
                  Growth Plan
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded border border-outline-variant/20 bg-surface-container px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface-variant">
                    {currentRole}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    arrow_right_alt
                  </span>
                  <span className="rounded border border-primary/20 bg-primary/10 px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-primary">
                    {targetRole}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="text-[40px] font-bold leading-tight text-[#3b82f6]">
                  {completion}%
                </div>
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                  COMPLETION
                </div>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="relative flex flex-col gap-10 pl-10">
            <div className="absolute bottom-6 left-[15px] top-6 z-0 w-[2px] bg-outline-variant/20" />
            <div className="absolute left-[15px] top-6 z-0 h-[40%] w-[2px] bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />

            {phases.map((phase) => (
              <div
                key={phase.id}
                className={cn(
                  "group relative z-10 flex flex-col gap-6",
                  phase.locked && "opacity-80",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-surface-container",
                      phase.locked
                        ? "border-outline-variant/50"
                        : "border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                      phase.active && "bg-primary/10",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full",
                        phase.locked
                          ? "h-2 w-2 bg-outline-variant"
                          : "h-3 w-3 bg-[#3b82f6]",
                        phase.active && "animate-pulse",
                      )}
                    />
                  </div>
                  <h2
                    className={cn(
                      "m-0 headline-md",
                      phase.locked
                        ? "text-on-surface-variant"
                        : "text-on-surface",
                    )}
                  >
                    {phase.title}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 pl-2 md:grid-cols-2">
                  {phase.nodes.map((node) => (
                    <NodeCard key={node.id} node={node} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 flex-col gap-10 overflow-y-auto border-l border-outline-variant/20 bg-surface-container-lowest p-6 xl:flex">
        <div className="flex flex-col gap-4">
          <h3 className="m-0 flex items-center gap-1 headline-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">
              track_changes
            </span>
            Current Focus
          </h3>
          <div className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-surface-container p-4">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-primary">
              {data?.focus_skills?.[0] || "RAG & Retrieval"}
            </div>
            <p className="m-0 text-[13px] leading-5 text-on-surface-variant">
              Implementing chunking strategies for long-form documents to
              improve semantic search recall.
            </p>
            <button
              type="button"
              className="mt-1 w-full rounded border border-outline-variant/30 bg-surface-container-highest py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium text-on-surface transition-colors hover:bg-surface-container-high"
            >
              View Resources
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="m-0 flex items-center gap-1 headline-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-error">
              warning
            </span>
            Critical Gaps
          </h3>
          <div className="flex flex-col gap-2">
            {criticalGaps.map((gap) => (
              <div
                key={gap.title}
                className="flex items-start gap-2 rounded border border-error/20 bg-surface-container-low p-2"
              >
                <span className="material-symbols-outlined mt-[2px] text-[16px] text-error">
                  {gap.icon}
                </span>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface">
                    {gap.title}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {gap.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export function RoadmapView() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();
  const { data } = useGetRoadmapQuery();
  const [pathReady, setPathReady] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  useEffect(() => {
    const path = resolveGrowthPath(
      profile?.technical_goal || user?.profile?.technical_goal,
    );
    setIsCurrentJob(path === "current-job");
    setPathReady(true);
  }, [profile?.technical_goal, user?.profile?.technical_goal]);

  if (!pathReady) {
    return (
      <p className="p-6 body-sm text-on-surface-variant">Loading growth plan…</p>
    );
  }

  if (isCurrentJob) {
    return <RoadmapCurrentJobView />;
  }

  return <RoadmapRoleSwitchView data={data} user={user} />;
}
