"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetGapAnalysisQuery } from "@/services/api/gapApi";
import { useGetRoadmapQuery } from "@/services/api/progressApi";
import type {
  SkillGapRadarAxis,
  UserSkillGap,
} from "@/types/api";
import { cn } from "@/lib/utils";

type SeverityFilter = "all" | "high" | "medium" | "low";
type StatusFilter = "all" | "NOT_STARTED" | "IN_PROGRESS";

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function severityRank(severity?: string | null) {
  const s = (severity || "").toLowerCase();
  if (s === "high") return 0;
  if (s === "medium") return 1;
  if (s === "low") return 2;
  return 3;
}

function progressFor(gap: UserSkillGap) {
  if (typeof gap.progress_percent === "number") return gap.progress_percent;
  const s = (gap.status || "").toUpperCase();
  if (s === "CLOSED") return 100;
  if (s === "IN_PROGRESS") return 45;
  return 0;
}

function severityChip(severity?: string | null) {
  const s = (severity || "").toLowerCase();
  if (s === "high") {
    return "bg-error/10 text-error border-error/20";
  }
  if (s === "medium") {
    return "bg-tertiary/10 text-tertiary border-tertiary/20";
  }
  return "bg-outline-variant/30 text-on-surface-variant border-outline-variant/50";
}

function radarPoint(index: number, value: number, n: number, cx = 200, cy = 200, maxR = 160) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
  const r = Math.max(0, Math.min(1, value)) * maxR;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function polygonPoints(axes: SkillGapRadarAxis[], field: "current" | "target") {
  if (!axes.length) return "";
  return axes
    .map((axis, i) => {
      const p = radarPoint(i, axis[field], axes.length);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

function gridPolygon(level: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const p = radarPoint(i, level, n);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function RadarChart({ axes }: { axes: SkillGapRadarAxis[] }) {
  const n = Math.max(axes.length, 3);
  const displayAxes =
    axes.length >= 3
      ? axes
      : [
          ...axes,
          ...Array.from({ length: 3 - axes.length }, (_, i) => ({
            key: `pad-${i}`,
            label: "—",
            current: 0,
            target: 1,
          })),
        ];

  const labelPoints = displayAxes.map((axis, i) => {
    const p = radarPoint(i, 1.12, displayAxes.length, 200, 200, 160);
    return { ...axis, ...p };
  });

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center rounded-lg bg-surface/50 p-6">
      <svg className="h-full w-full max-w-[400px] overflow-visible" viewBox="0 0 400 400">
        <g className="text-outline-variant/30" fill="none" stroke="currentColor" strokeWidth="1">
          {[1, 0.75, 0.5, 0.25].map((level) => (
            <polygon key={level} points={gridPolygon(level, displayAxes.length)} />
          ))}
          {displayAxes.map((_, i) => {
            const p = radarPoint(i, 1, displayAxes.length);
            return <line key={i} x1="200" y1="200" x2={p.x} y2={p.y} />;
          })}
        </g>
        <polygon
          className="text-tertiary/10"
          fill="currentColor"
          points={polygonPoints(displayAxes, "target")}
          stroke="currentColor"
          strokeDasharray="4,4"
          strokeWidth="2"
        />
        <polygon
          className="text-primary/20"
          fill="currentColor"
          points={polygonPoints(displayAxes, "current")}
          stroke="currentColor"
          strokeWidth="2"
        />
        <g className="text-primary" fill="currentColor">
          {displayAxes.map((axis, i) => {
            const p = radarPoint(i, axis.current, displayAxes.length);
            return <circle key={`c-${axis.key}`} cx={p.x} cy={p.y} r="4" />;
          })}
        </g>
        <g className="text-tertiary" fill="currentColor">
          {displayAxes.map((axis, i) => {
            const p = radarPoint(i, axis.target, displayAxes.length);
            return <circle key={`t-${axis.key}`} cx={p.x} cy={p.y} opacity="0.5" r="3" />;
          })}
        </g>
        <g
          className="fill-on-surface-variant font-[family-name:var(--font-jetbrains-mono)] text-[10px]"
          textAnchor="middle"
        >
          {labelPoints.map((axis) => (
            <text key={`l-${axis.key}`} x={axis.x} y={axis.y}>
              {axis.label === "—" ? "" : axis.label}
            </text>
          ))}
        </g>
      </svg>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 rounded border border-outline-variant/30 bg-surface-container-high p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-on-surface">
            Current
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border border-dashed border-tertiary bg-tertiary/20" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-on-surface">
            Target Role
          </span>
        </div>
      </div>
      {!axes.length ? (
        <p className="absolute body-sm text-on-surface-variant">
          Complete a diagnostic to populate the radar.
        </p>
      ) : null}
      {n < 3 && axes.length > 0 ? null : null}
    </div>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  icon,
  accentClass,
  sparkPath,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: string;
  accentClass: string;
  sparkPath: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-container p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <span className={cn("material-symbols-outlined text-[20px]", accentClass)}>
          {icon}
        </span>
      </div>
      <div className="mb-4 flex items-end gap-2">
        <span className="display-lg leading-none text-on-surface !text-[40px] !leading-[48px]">
          {value}
          {suffix ? <span className="headline-md">{suffix}</span> : null}
        </span>
      </div>
      <div className="mt-auto h-8 w-full">
        <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path
            className={accentClass}
            d={sparkPath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

export function SkillGapsPage() {
  const { data, isLoading, error } = useGetGapAnalysisQuery();
  const { data: roadmap } = useGetRoadmapQuery();
  const [showFilters, setShowFilters] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const summary = data?.summary;
  const radarAxes = data?.radar?.axes || [];
  const marketTrends = data?.market_trends || [];

  const filteredGaps = useMemo(() => {
    const rows = [...(data?.open_gaps || [])].sort(
      (a, b) => severityRank(a.severity) - severityRank(b.severity),
    );
    return rows.filter((gap) => {
      const sev = (gap.severity || "").toLowerCase();
      if (severityFilter !== "all" && sev !== severityFilter) return false;
      if (statusFilter !== "all" && (gap.status || "").toUpperCase() !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [data?.open_gaps, severityFilter, statusFilter]);

  const roadmapSteps = roadmap?.steps || [];
  const firstOpenIndex = roadmapSteps.findIndex((s) => {
    const st = (s.status || "").toLowerCase();
    return st !== "closed" && st !== "mastered";
  });
  const recommended = roadmapSteps
    .map((step, index) => ({ step, index }))
    .filter(({ index }) => firstOpenIndex < 0 || index >= firstOpenIndex)
    .slice(0, 3);

  const closedCount = summary?.closed_count ?? 0;
  const avgProficiency = summary?.avg_proficiency ?? 0;
  const activeFocus = summary?.active_focus ?? filteredGaps.length;

  function exportJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skill-gap-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-10">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <div className="group relative overflow-hidden rounded-lg bg-surface-container p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
            <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="headline-md text-on-surface">Skill Gap Analysis</h1>
                <p className="mt-1 max-w-xl body-sm text-on-surface-variant">
                  Comparing current proficiency against target role requirements.
                  Focus on high-priority gaps to accelerate progression.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-1 rounded-md bg-surface-container-high px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface transition-colors hover:bg-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Filter
                </button>
                <button
                  type="button"
                  onClick={exportJson}
                  disabled={!data}
                  className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-primary shadow-sm transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export Report
                </button>
              </div>
            </div>

            {showFilters ? (
              <div className="relative z-10 mb-4 flex flex-wrap gap-3 rounded-lg border border-outline-variant/30 bg-surface/40 p-3">
                <label className="flex items-center gap-2 body-sm text-on-surface-variant">
                  Severity
                  <select
                    value={severityFilter}
                    onChange={(e) =>
                      setSeverityFilter(e.target.value as SeverityFilter)
                    }
                    className="rounded-md border border-outline-variant/40 bg-surface-dim px-2 py-1 text-on-surface"
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 body-sm text-on-surface-variant">
                  Status
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="rounded-md border border-outline-variant/40 bg-surface-dim px-2 py-1 text-on-surface"
                  >
                    <option value="all">All open</option>
                    <option value="NOT_STARTED">Open</option>
                    <option value="IN_PROGRESS">In progress</option>
                  </select>
                </label>
              </div>
            ) : null}

            {isLoading ? (
              <p className="relative z-10 body-sm text-on-surface-variant">
                Loading analysis…
              </p>
            ) : null}
            {error ? (
              <p className="relative z-10 body-sm text-error">
                Could not load skill gap analysis.
              </p>
            ) : null}

            <div className="relative z-10">
              <RadarChart axes={radarAxes} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard
              label="Gaps Closed"
              value={closedCount}
              icon="check_circle"
              accentClass="text-primary"
              sparkPath="M0 15 L20 18 L40 12 L60 8 L80 10 L100 2"
            />
            <KpiCard
              label="Avg Proficiency"
              value={avgProficiency}
              suffix="%"
              icon="trending_up"
              accentClass="text-tertiary"
              sparkPath="M0 18 L20 16 L40 10 L60 12 L80 6 L100 4"
            />
            <KpiCard
              label="Active Focus"
              value={activeFocus}
              suffix=""
              icon="target"
              accentClass="text-secondary"
              sparkPath="M0 16 L25 12 L50 14 L75 8 L100 6"
            />
          </div>
          <p className="-mt-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface-variant">
            Active focus = open + in-progress gaps
            {summary
              ? ` · ${summary.open_count} open / ${summary.in_progress_count} in progress`
              : ""}
          </p>

          <div>
            <h2 className="mb-4 headline-sm text-on-surface">Active Gap Inventory</h2>
            {filteredGaps.length ? (
              <div className="space-y-2">
                {filteredGaps.map((gap) => {
                  const title =
                    gap.skill_area || gap.skill?.name || gap.skill?.slug || "Skill";
                  const progress = progressFor(gap);
                  const href = gap.challenge_id
                    ? `/challenges/${gap.challenge_id}`
                    : "/roadmap";
                  const insight =
                    gap.market_insight ||
                    gap.latest_evidence_summary ||
                    gap.fragment;
                  const sev = (gap.severity || "low").toLowerCase();
                  return (
                    <Link
                      key={gap.id}
                      href={href}
                      className="group flex cursor-pointer flex-col items-start gap-6 rounded-lg bg-surface-container p-4 shadow-sm transition-colors hover:bg-surface-container-high sm:flex-row sm:items-center"
                    >
                      <div className="w-full flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="headline-sm !text-[16px] capitalize text-on-surface">
                            {formatLabel(title)}
                          </h3>
                          <span
                            className={cn(
                              "rounded border px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase",
                              severityChip(sev),
                            )}
                          >
                            {sev === "high"
                              ? "High Priority"
                              : sev === "medium"
                                ? "Medium"
                                : "Low"}
                          </span>
                        </div>
                        {gap.fragment ? (
                          <p className="mb-4 body-sm text-on-surface-variant">
                            {gap.fragment}
                          </p>
                        ) : null}
                        {insight ? (
                          <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">
                              insights
                            </span>
                            {insight}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:w-48">
                        <div className="flex justify-between font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
                          <span className="text-on-surface-variant">Progress</span>
                          <span className="text-primary">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-surface-container-highest py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface opacity-0 transition-opacity group-hover:opacity-100">
                          {gap.challenge_id ? "Jump to Challenge" : "Open Roadmap"}
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg bg-surface-container p-6">
                <p className="body-sm text-on-surface-variant">
                  No open gaps — finish challenges or take a diagnostic.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/diagnostic"
                    className="rounded-md bg-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-primary"
                  >
                    Take diagnostic
                  </Link>
                  <Link
                    href="/roadmap"
                    className="rounded-md bg-surface-container-high px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface"
                  >
                    Open roadmap
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-lg bg-surface-container p-4 shadow-sm">
            <h3 className="mb-1 flex items-center gap-2 headline-sm text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                trending_up
              </span>
              Market Trends
            </h3>
            <p className="mb-4 body-sm text-on-surface-variant">
              Evidence tied to your diagnostic competency areas.
            </p>
            {marketTrends.length ? (
              <div className="space-y-4">
                {marketTrends.map((trend, i) => (
                  <div key={`${trend.label}-${i}`} className="relative">
                    <div className="mb-1 flex justify-between gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-on-surface">
                      <span>{trend.label}</span>
                      {trend.source_date ? (
                        <span className="text-primary">{trend.source_date}</span>
                      ) : null}
                    </div>
                    <p className="mb-2 body-sm text-on-surface-variant">
                      {trend.stat_text}
                    </p>
                    <div className="flex h-4 gap-1">
                      <div className="h-full w-[20%] rounded-sm bg-primary/20" />
                      <div className="h-full w-[30%] rounded-sm bg-primary/40" />
                      <div className="h-full w-[25%] rounded-sm bg-primary/60" />
                      <div className="h-full w-[25%] rounded-sm bg-primary" />
                    </div>
                    {trend.source_name ? (
                      <p className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-outline">
                        {trend.source_name}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="body-sm text-on-surface-variant">
                No market evidence yet. Complete a diagnostic to surface trends for
                your stack.
              </p>
            )}
          </div>

          <div className="relative overflow-hidden rounded-lg bg-surface-container p-4 shadow-sm">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <h3 className="relative mb-2 headline-sm text-on-surface">
              Recommended Path
            </h3>
            <p className="relative mb-4 body-sm text-on-surface-variant">
              Based on your highest priority gaps and current roadmap unlock order.
            </p>
            {recommended.length ? (
              <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-px before:bg-outline-variant/30">
                {recommended.map(({ step, index }, i) => {
                  const title =
                    step.topic ||
                    step.gap?.skill?.name ||
                    step.challenge?.title ||
                    `Step ${index + 1}`;
                  const isCurrent = i === 0;
                  const href = step.challenge?.id
                    ? `/challenges/${step.challenge.id}`
                    : "/roadmap";
                  return (
                    <div key={`${title}-${index}`} className="relative">
                      <div
                        className={cn(
                          "absolute -left-[27px] top-1 h-2 w-2 rounded-full ring-4 ring-surface-container",
                          isCurrent
                            ? "bg-primary"
                            : "border border-outline-variant/50 bg-surface-container-highest",
                        )}
                      />
                      {isCurrent ? (
                        <Link href={href} className="block">
                          <h4 className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] capitalize text-on-surface">
                            {formatLabel(title)}
                          </h4>
                          <span className="text-xs text-on-surface-variant">
                            Current unlock
                          </span>
                        </Link>
                      ) : (
                        <>
                          <h4 className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] capitalize text-on-surface-variant">
                            {formatLabel(title)}
                          </h4>
                          <span className="text-xs text-outline">Locked</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="relative body-sm text-on-surface-variant">
                No roadmap steps yet. Finish a diagnostic to generate your path.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
