"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";
import {
  useGetActiveDiagnosticSessionQuery,
  useStartDiagnosticSessionMutation,
} from "@/services/api/diagnosticApi";
import { DiagnosticAnalyzingScreen } from "@/features/diagnostics/DiagnosticAnalyzingScreen";
import { getApiErrorMessage } from "@/lib/errors";
import {
  getStoredFocusFrameworks,
  growthPathToDiagnosticGoal,
  resolveGrowthPath,
} from "@/lib/growthPath";

type Props = {
  targetProfile?: string;
};

const LOADING_MIN_MS = 2800;

export function DiagnosticIntro({ targetProfile }: Props) {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const { data: activePayload, isLoading: loadingActive } =
    useGetActiveDiagnosticSessionQuery();
  const [startSession] = useStartDiagnosticSessionMutation();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = activePayload?.active_session ?? null;

  const targetRoleLabel =
    targetProfile ||
    user?.profile?.target_role_label ||
    user?.profile?.target_role?.name ||
    user?.profile?.current_role ||
    "Your target stack";

  const goal = growthPathToDiagnosticGoal(
    resolveGrowthPath(user?.profile?.technical_goal),
  );

  useEffect(() => {
    if (!activeSession?.id) return;
    router.replace(`/diagnostic/session/${activeSession.id}`);
  }, [activeSession?.id, router]);

  async function beginDiagnostic() {
    if (starting) return;
    if (activeSession?.id) {
      router.push(`/diagnostic/session/${activeSession.id}`);
      return;
    }
    setError(null);
    setStarting(true);
    const startedAt = Date.now();
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
      const elapsed = Date.now() - startedAt;
      if (elapsed < LOADING_MIN_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, LOADING_MIN_MS - elapsed),
        );
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
      if (e.key !== "Enter" || starting || loadingActive || activeSession) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      void beginDiagnostic();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starting, goal, loadingActive, activeSession]);

  if (loadingActive || activeSession) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        {activeSession ? "Resuming your diagnostic…" : "Checking for an in-progress diagnostic…"}
      </p>
    );
  }

  if (starting) {
    return <DiagnosticAnalyzingScreen targetRoleLabel={targetRoleLabel} />;
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
              {(user?.profile?.diagnostic_difficulty_bump ?? 0) > 0
                ? `Harder cycle ${user?.profile?.diagnostic_cycle ?? 2} — higher-tier questions and scenarios.`
                : "A rule-based adaptive assessment across your selected frameworks — foundational knowledge through coding and reasoning challenges."}
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
                {(user?.profile?.diagnostic_difficulty_bump ?? 0) > 0
                  ? "Begin harder diagnostic"
                  : "Begin Diagnostic"}
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
