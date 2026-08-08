"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DiagnosticAttempt } from "@/types/api";

export function ResultView({ attempt }: { attempt: DiagnosticAttempt }) {
  const result = attempt.result;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Results</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {attempt.diagnostic_title}
          </h1>
        </div>
        <Badge variant="accent">{attempt.status}</Badge>
      </div>

      {!result ? (
        <p className="text-sm text-muted">No result payload yet.</p>
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
              {(result.gaps ?? []).map((g) => (
                <li key={g} className="border-l-2 border-danger/40 pl-3">
                  {g}
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
              {(result.recommended_focus ?? []).map((f) => (
                <Badge key={f} variant="accent">
                  {f}
                </Badge>
              ))}
              {!result.recommended_focus?.length ? (
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
