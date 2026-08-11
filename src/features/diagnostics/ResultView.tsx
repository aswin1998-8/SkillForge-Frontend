"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DiagnosticAttempt } from "@/types/api";

function gapLabel(
  g: string | { skill_slug?: string; severity?: string; notes?: string },
): string {
  if (typeof g === "string") return g;
  return [g.skill_slug, g.severity, g.notes].filter(Boolean).join(" — ");
}

function focusItems(focus: string | string[] | undefined): string[] {
  if (!focus) return [];
  if (Array.isArray(focus)) return focus;
  return focus ? [focus] : [];
}

export function ResultView({ attempt }: { attempt: DiagnosticAttempt }) {
  const result = attempt.result;
  const gapReport = attempt.gap_report ?? [];
  const transfers = attempt.transfer_report ?? [];
  const scores = attempt.skill_scores ?? {};

  return (
    <div className="space-y-6 px-4 py-6 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Results</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {attempt.diagnostic_title}
          </h1>
        </div>
        <Badge variant="accent">{attempt.status}</Badge>
      </div>

      {Object.keys(scores).length ? (
        <section className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Skill scores</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(scores).map(([slug, info]) => (
              <li
                key={slug}
                className="flex items-center justify-between rounded border border-border/60 px-3 py-2 text-sm"
              >
                <span>{slug}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px]">
                  {Math.round((info.score || 0) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {gapReport.length ? (
        <section className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Gap report</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {gapReport.map((g) => (
              <li
                key={String(g.skill_slug)}
                className="border-l-2 border-danger/40 pl-3"
              >
                <strong>{String(g.skill_name || g.skill_slug)}</strong> —{" "}
                {String(g.classification)}
                {g.explanation ? (
                  <p className="mt-1 text-muted">{String(g.explanation)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {transfers.length ? (
        <section className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Transferable skills</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {transfers.map((t, idx) => (
              <li key={`${t.from_skill_slug}-${t.to_skill_slug}-${idx}`}>
                {String(t.from_skill_name || t.from_skill_slug)} →{" "}
                {String(t.to_skill_name || t.to_skill_slug)}
                {t.rationale ? (
                  <span className="text-muted"> — {String(t.rationale)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!result ? (
        !gapReport.length ? (
          <p className="text-sm text-muted">No result payload yet.</p>
        ) : null
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-accent">Strengths</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(result.strengths ?? []).map((s) => (
                <li key={s} className="border-l-2 border-accent/40 pl-3">
                  {s}
                </li>
              ))}
              {!result.strengths?.length ? (
                <li className="text-muted">None listed</li>
              ) : null}
            </ul>
          </section>
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-danger">Gaps</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(result.gaps ?? []).map((g, i) => (
                <li key={i} className="border-l-2 border-danger/40 pl-3">
                  {gapLabel(g)}
                </li>
              ))}
              {!result.gaps?.length ? (
                <li className="text-muted">None listed</li>
              ) : null}
            </ul>
          </section>
          <section className="rounded-lg border border-border p-4 md:col-span-2">
            <h2 className="text-sm font-semibold">Recommended focus</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {focusItems(result.recommended_focus).map((f) => (
                <Badge key={f} variant="accent">
                  {f}
                </Badge>
              ))}
              {!focusItems(result.recommended_focus).length ? (
                <span className="text-sm text-muted">No focus items</span>
              ) : null}
            </div>
          </section>
        </div>
      )}

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/roadmap">Open roadmap</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/challenges/today">Today&apos;s challenge</Link>
        </Button>
      </div>
    </div>
  );
}
