"use client";

import { useEffect, useState } from "react";

const LOG_LINES = [
  "Evaluating trade-off matrices...",
  "Analyzing latency optimization...",
  "Simulating memory constraints...",
  "Validating edge-case handling...",
  "Compiling reasoning vectors...",
];

const STEPS = [
  {
    code: "01 / CONCEPTS",
    detail: "Validated theoretical foundations",
    status: "done" as const,
  },
  {
    code: "02 / SE FUNDAMENTALS",
    detail: "System design and coding patterns",
    status: "done" as const,
  },
  {
    code: "03 / PRODUCTION REASONING",
    detail: "Evaluating real-world trade-offs...",
    status: "active" as const,
  },
  {
    code: "04 / AI ARCHITECTURE",
    detail: "Queued",
    status: "pending" as const,
  },
  {
    code: "05 / RELIABILITY",
    detail: "Queued",
    status: "pending" as const,
  },
];

type Props = {
  targetRoleLabel: string;
};

function targetToken(label: string) {
  const cleaned = label
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return cleaned || "TARGET_ROLE";
}

export function DiagnosticAnalyzingScreen({ targetRoleLabel }: Props) {
  const role = targetRoleLabel.trim() || "your target role";
  const [logLine, setLogLine] = useState(LOG_LINES[0]);
  const [pct, setPct] = useState(48);
  const [logVisible, setLogVisible] = useState(true);

  useEffect(() => {
    let lineIdx = 0;
    const logTimer = window.setInterval(() => {
      lineIdx = (lineIdx + 1) % LOG_LINES.length;
      setLogVisible(false);
      window.setTimeout(() => {
        setLogLine(LOG_LINES[lineIdx]);
        setLogVisible(true);
      }, 300);
    }, 2500);

    const pctTimer = window.setInterval(() => {
      setPct((prev) => (prev < 78 ? prev + 1 : prev));
    }, 1200);

    return () => {
      window.clearInterval(logTimer);
      window.clearInterval(pctTimer);
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-10 lg:px-10">
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <h1 className="display-lg tracking-tight text-on-surface">
          Analyzing your technical profile.
        </h1>
        <p className="body-lg max-w-2xl text-on-surface-variant">
          Mapping your experience against the {role} role.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="relative col-span-1 flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl bg-surface-container-lowest p-10 shadow-lg lg:col-span-7">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

          <svg
            className="w-full max-w-[320px] text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 400 400"
            aria-hidden
          >
            <style>{`
              @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 0.8; }
                100% { transform: scale(1.6); opacity: 0; }
              }
              @keyframes spin-slow {
                100% { transform: rotate(360deg); }
              }
              @keyframes dash-move {
                to { stroke-dashoffset: -24; }
              }
              .ring-anim { transform-origin: center; animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
              .ring-anim-delay { transform-origin: center; animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 1.25s; }
              .spin-anim { transform-origin: center; animation: spin-slow 12s linear infinite; }
              .spin-anim-reverse { transform-origin: center; animation: spin-slow 18s linear infinite reverse; }
              .dash-anim { animation: dash-move 1s linear infinite; }
            `}</style>
            <g className="text-surface-variant" opacity="0.3" strokeWidth="0.5">
              <line x1="0" x2="400" y1="200" y2="200" />
              <line x1="200" x2="200" y1="0" y2="400" />
              <circle cx="200" cy="200" r="160" />
            </g>
            <circle
              className="text-primary-fixed"
              cx="200"
              cy="200"
              opacity="0.4"
              r="60"
              strokeWidth="1"
            />
            <circle
              className="text-primary-fixed spin-anim-reverse"
              cx="200"
              cy="200"
              opacity="0.5"
              r="100"
              strokeDasharray="2 12"
              strokeWidth="1"
            />
            <circle
              className="text-primary spin-anim"
              cx="200"
              cy="200"
              opacity="0.3"
              r="140"
              strokeDasharray="12 12"
              strokeWidth="1.5"
            />
            <circle className="ring-anim" cx="200" cy="200" r="40" strokeWidth="1.5" />
            <circle
              className="ring-anim-delay"
              cx="200"
              cy="200"
              r="40"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="200" fill="currentColor" r="12" />
            <g className="text-secondary" opacity="0.8">
              <circle cx="280" cy="120" fill="currentColor" r="4" />
              <line
                className="dash-anim"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="200"
                x2="280"
                y1="200"
                y2="120"
              />
              <circle cx="120" cy="260" fill="currentColor" r="4" />
              <line
                className="dash-anim"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="200"
                x2="120"
                y1="200"
                y2="260"
              />
            </g>
          </svg>

          <div className="absolute left-6 top-6 flex flex-col gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
            <span>TARGET: {targetToken(role)}</span>
            <span>MODEL: GEMINI</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="flex flex-col gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-primary">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                PROCESSING CLUSTERS
              </span>
              <span
                className="text-on-surface-variant transition-opacity duration-300"
                style={{ opacity: logVisible ? 1 : 0 }}
              >
                {logLine}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
                COMPLETION
              </span>
              <span className="display-lg leading-none text-on-surface">{pct}%</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6 rounded-xl bg-surface-container p-6 shadow-xl lg:col-span-5 lg:p-10">
          <h2 className="headline-sm mb-2 flex items-center justify-between text-on-surface">
            Execution Log
            <span className="rounded bg-surface-container-highest px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
              PID: {8492 + (role.length % 100)}
            </span>
          </h2>

          <div className="relative flex flex-1 flex-col justify-center">
            <div className="absolute bottom-6 left-[15px] top-4 w-[2px] bg-surface-container-highest" />

            {STEPS.map((step) => {
              if (step.status === "active") {
                return (
                  <div
                    key={step.code}
                    className="-mx-2 flex items-start gap-4 rounded-lg bg-surface-container-high px-2 py-2 shadow-sm"
                  >
                    <div className="relative z-10 mt-[2px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-md">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40" />
                      <span
                        className="material-symbols-outlined animate-spin text-[16px]"
                        style={{ animationDuration: "3s" }}
                      >
                        sync
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="flex items-center gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-primary">
                        {step.code}
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      </span>
                      <span className="body-sm text-on-surface">{step.detail}</span>
                    </div>
                  </div>
                );
              }

              if (step.status === "done") {
                return (
                  <div
                    key={step.code}
                    className="group relative flex items-start gap-4 py-2"
                  >
                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-primary shadow-sm transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-primary">
                        {step.code}
                      </span>
                      <span className="body-sm text-on-surface-variant">{step.detail}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.code}
                  className="relative flex items-start gap-4 py-2 opacity-40"
                >
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">circle</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
                      {step.code}
                    </span>
                    <span className="body-sm text-on-surface-variant">{step.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
