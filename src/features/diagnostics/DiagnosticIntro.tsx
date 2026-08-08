"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";
import {
  useGetDiagnosticsQuery,
  useStartDiagnosticMutation,
} from "@/services/api/diagnosticApi";

type Props = {
  targetProfile?: string;
};

export function DiagnosticIntro({ targetProfile }: Props) {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const { data: diagnostics } = useGetDiagnosticsQuery();
  const [start] = useStartDiagnosticMutation();
  const [starting, setStarting] = useState(false);

  const profile =
    targetProfile ||
    user?.profile?.target_role?.name ||
    user?.profile?.current_role ||
    "AI Engineer";

  const questionCount = diagnostics?.[0]?.questions?.length ?? 18;
  const firstDiagnosticId = diagnostics?.[0]?.id;

  async function beginDiagnostic() {
    if (starting) return;
    setStarting(true);
    try {
      if (firstDiagnosticId) {
        const attempt = await start(firstDiagnosticId).unwrap();
        router.push(`/diagnostic/${attempt.id}`);
        return;
      }
      router.push("/diagnostic/demo");
    } catch {
      router.push("/diagnostic/demo");
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Enter" || starting) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      void beginDiagnostic();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starting, firstDiagnosticId]);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-5%] top-[-10%] h-1/2 w-1/2 rounded-full bg-primary opacity-30 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] h-1/2 w-1/2 rounded-full bg-secondary opacity-20 blur-[120px] mix-blend-screen" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#dae2fd 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="absolute left-6 top-6 flex items-center gap-2 opacity-60">
          <div className="h-2 w-2 animate-pulse bg-primary" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
            Sys_Ready
          </span>
        </div>
        <div className="absolute right-6 top-6 opacity-40">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant [writing-mode:vertical-rl] rotate-180">
            SESSION_ID: FRGIQ-09X-2B
          </span>
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center space-y-10 text-center">
          <div className="inline-flex cursor-default items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-2 shadow-lg backdrop-blur-md transition-transform hover:scale-105">
            <span className="material-symbols-outlined text-[20px] text-tertiary">
              psychology
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
              Target Profile:{" "}
              <span className="font-bold text-tertiary">{profile}</span>
            </span>
          </div>

          <div className="relative space-y-4">
            <h1 className="display-lg bg-gradient-to-r from-on-background via-on-background to-on-surface-variant bg-clip-text leading-tight text-transparent">
              Let&apos;s find your <br />
              <span className="pr-2 italic text-primary">real gaps.</span>
            </h1>
            <p className="body-lg mx-auto max-w-2xl leading-relaxed text-on-surface-variant">
              This isn&apos;t a quiz you pass or fail. We&apos;ll evaluate how
              you think about real technical problems, architecture decisions,
              and edge cases.
            </p>
            <div className="absolute -left-12 top-1/2 hidden h-px w-8 bg-gradient-to-r from-transparent to-primary/50 md:block" />
            <div className="absolute -right-12 top-1/2 hidden h-px w-8 bg-gradient-to-l from-transparent to-primary/50 md:block" />
          </div>

          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 pt-6 md:grid-cols-12">
            <div className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-xl md:col-span-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100px] bg-primary/5 transition-transform group-hover:scale-110" />
              <div className="relative z-10 mb-10 flex items-start justify-between">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  timer
                </span>
                <span className="rounded bg-surface-container-highest px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                  EST. DURATION
                </span>
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-geist)] text-[48px] font-bold leading-[56px] tracking-[-0.04em] text-on-surface">
                    ~25
                  </span>
                  <span className="body-sm font-[family-name:var(--font-jetbrains-mono)] text-on-surface-variant">
                    minutes
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="h-1 w-1 rounded-full bg-outline" />
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px]">
                    {questionCount} Technical Scenarios
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative col-span-1 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-xl md:col-span-7">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface-container-highest/20 to-transparent" />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="headline-sm text-on-surface">Evaluation Matrix</h3>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                  radar
                </span>
              </div>
              <ul className="space-y-4 text-left">
                {[
                  {
                    icon: "verified",
                    color: "text-primary group-hover/item:bg-primary/20",
                    title: "Core Knowledge",
                    copy: "What you actually know vs. memorize.",
                  },
                  {
                    icon: "route",
                    color: "text-tertiary group-hover/item:bg-tertiary/20",
                    title: "Reasoning Breaks",
                    copy: "Where your architectural logic fails.",
                  },
                  {
                    icon: "manufacturing",
                    color: "text-secondary group-hover/item:bg-secondary/20",
                    title: "Production Skills",
                    copy: "Missing real-world operational context.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="group/item flex items-start gap-4"
                  >
                    <div
                      className={`mt-[2px] flex h-6 w-6 items-center justify-center rounded border border-outline-variant/30 bg-surface-container-highest transition-colors ${item.color}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="body-lg text-on-surface">{item.title}</h4>
                      <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                        {item.copy}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex w-full flex-col items-center space-y-4 pt-10">
            <div className="mb-2 flex h-12 w-full max-w-md items-center justify-center gap-1 opacity-50">
              {[12, 8, 4, 8, 12].map((w, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-full bg-primary"
                  style={{
                    width: w * 4,
                    height: i === 2 ? 16 : i === 1 || i === 3 ? 8 : 4,
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => void beginDiagnostic()}
              disabled={starting}
              className="group relative overflow-hidden rounded-lg bg-primary-container px-10 py-4 headline-sm text-on-primary-container shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center gap-2">
                {starting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      refresh
                    </span>
                    Initializing…
                  </>
                ) : (
                  <>
                    Begin Diagnostic
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </>
                )}
              </span>
            </button>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
              Press{" "}
              <kbd className="mx-1 rounded border border-outline-variant/30 bg-surface-container-high px-2 py-1 text-on-surface">
                Enter
              </kbd>{" "}
              to start
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-outline-variant/20 pt-4 opacity-70">
        <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>DATA ENCRYPTION: ACTIVE</span>
        </div>
        <div className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
          v2.4.1_DIAG
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
