"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";
import { useStartDiagnosticSessionMutation } from "@/services/api/diagnosticApi";
import { getApiErrorMessage } from "@/lib/errors";
import {
  getStoredFocusFrameworks,
  growthPathToDiagnosticGoal,
  resolveGrowthPath,
} from "@/lib/growthPath";

type Props = {
  targetProfile?: string;
};

export function DiagnosticIntro({ targetProfile }: Props) {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const [startSession] = useStartDiagnosticSessionMutation();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetRoleLabel =
    targetProfile ||
    user?.profile?.target_role_label ||
    user?.profile?.target_role?.name ||
    user?.profile?.current_role ||
    "Your target stack";

  const goal = growthPathToDiagnosticGoal(
    resolveGrowthPath(user?.profile?.technical_goal),
  );

  async function beginDiagnostic() {
    if (starting) return;
    setError(null);
    setStarting(true);
    try {
      const framework_slugs = getStoredFocusFrameworks();
      if (!framework_slugs.length) {
        throw new Error(
          "Select at least one framework before starting the diagnostic.",
        );
      }
      const session = await startSession({
        goal,
        framework_slugs,
      }).unwrap();
      if (!session?.id) {
        throw new Error("Start did not return a session id.");
      }
      router.push(`/diagnostic/session/${session.id}`);
    } catch (err) {
      setStarting(false);
      setError(
        getApiErrorMessage(err, "Could not start the diagnostic session."),
      );
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
  }, [starting, goal]);

  if (starting) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="body-md text-on-surface-variant">Starting diagnostic…</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-5%] top-[-10%] h-1/2 w-1/2 rounded-full bg-primary opacity-30 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] h-1/2 w-1/2 rounded-full bg-secondary opacity-20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-3xl flex-col items-center space-y-10 text-center">
          <div className="inline-flex cursor-default items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-2 shadow-lg backdrop-blur-md">
            <span className="material-symbols-outlined text-[20px] text-tertiary">
              psychology
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
              {goal === "sharpen_current" ? "Sharpen" : "Switch"} ·{" "}
              <span className="font-bold text-tertiary">{targetRoleLabel}</span>
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="display-lg leading-tight text-on-background">
              Let&apos;s find your <br />
              <span className="italic text-primary">real gaps.</span>
            </h1>
            <p className="body-lg mx-auto max-w-2xl text-on-surface-variant">
              A rule-based adaptive assessment across your selected frameworks —
              foundational knowledge through coding and reasoning challenges.
            </p>
          </div>

          <div className="flex w-full flex-col items-center space-y-3 pt-8">
            {error ? <p className="body-sm text-error">{error}</p> : null}

            <button
              type="button"
              onClick={() => void beginDiagnostic()}
              disabled={starting}
              className="group relative overflow-hidden rounded-lg bg-primary-container px-10 py-4 headline-sm text-on-primary-container shadow-lg transition-all hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="relative flex items-center gap-2">
                Begin Diagnostic
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
