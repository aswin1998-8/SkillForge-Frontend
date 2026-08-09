"use client";

import Link from "next/link";
import type { DiagnosticSession } from "@/types/api";

export function SessionResultView({ session }: { session: DiagnosticSession }) {
  const synth = session.synthesis || {};
  const strengths = synth.strengths || [];
  const gaps = synth.gaps || [];
  const transfers = synth.transferable_skills || [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div>
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-on-surface-variant">
          Diagnostic complete
        </p>
        <h1 className="mt-1 display-lg !text-[36px] !leading-[44px] text-on-surface">
          Your synthesis
        </h1>
        <p className="mt-2 body-sm text-on-surface-variant">
          Goal: {session.goal.replaceAll("_", " ")}
          {session.target_role ? ` · ${session.target_role}` : ""}
        </p>
      </div>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
        <h2 className="headline-sm text-on-surface">Strengths</h2>
        <ul className="mt-3 space-y-2 body-sm text-on-surface-variant">
          {strengths.map((s, i) => (
            <li key={`${s.skill_area}-${i}`}>
              <strong className="text-on-surface">{s.skill_area}</strong>
              {s.evidence ? ` — ${s.evidence}` : ""}
            </li>
          ))}
          {!strengths.length ? <li>None listed</li> : null}
        </ul>
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
        <h2 className="headline-sm text-on-surface">Gaps</h2>
        <ul className="mt-3 space-y-2 body-sm text-on-surface-variant">
          {gaps.map((g, i) => (
            <li key={`${g.skill_area}-${i}`}>
              <strong className="text-on-surface">{g.skill_area}</strong> (Block{" "}
              {g.block}) — {g.severity}
            </li>
          ))}
          {!gaps.length ? <li>None listed</li> : null}
        </ul>
      </section>

      {session.goal === "switch_role" ? (
        <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
          <h2 className="headline-sm text-on-surface">Transferable skills</h2>
          <ul className="mt-3 space-y-2 body-sm text-on-surface-variant">
            {transfers.map((t, i) => (
              <li key={i}>
                {t.from_current_role} → {t.applies_to_target}
              </li>
            ))}
            {!transfers.length ? <li>None listed</li> : null}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
        <h2 className="headline-sm text-on-surface">Roadmap preview</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 body-sm text-on-surface-variant">
          {(synth.roadmap || []).map((r, i) => (
            <li key={i}>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-primary">
                {r.challenge_modality}
              </span>
              {" — "}
              {r.topic}
            </li>
          ))}
          {!synth.roadmap?.length
            ? session.roadmap_items.map((r) => (
                <li key={r.id}>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-primary">
                    {r.challenge_modality}
                  </span>
                  {" — "}
                  {r.topic}
                </li>
              ))
            : null}
        </ol>
      </section>

      <div className="flex gap-3">
        <Link
          href="/roadmap"
          className="rounded-xl bg-primary px-6 py-3 headline-sm text-on-primary"
        >
          Open roadmap
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-outline-variant/40 px-6 py-3 body-sm text-on-surface"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
