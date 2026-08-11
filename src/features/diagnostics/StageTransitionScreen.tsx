"use client";

import { useEffect, useState } from "react";

type Props = {
  stageLabel?: string;
  onReady?: () => void;
  /** Minimum time to show the interstitial before calling onReady */
  minMs?: number;
};

/**
 * Short analyzing interstitial shown after each diagnostic stage submit
 * while the next stage (or final results) is prepared.
 */
export function StageTransitionScreen({
  stageLabel = "your answers",
  onReady,
  minMs = 1400,
}: Props) {
  const [pct, setPct] = useState(18);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setPct((p) => Math.min(92, p + 7 + Math.floor(Math.random() * 6)));
    }, 180);
    const done = window.setTimeout(() => {
      setPct(100);
      onReady?.();
    }, minMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [minMs, onReady]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-primary">
        Grading stage
      </p>
      <h1 className="headline-md text-on-surface">
        Analyzing {stageLabel.replaceAll("_", " ").toLowerCase()}…
      </h1>
      <p className="body-sm text-on-surface-variant">
        Checking answers against expected solutions and rubric signals.
      </p>
      <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
        {pct}%
      </p>
    </div>
  );
}
