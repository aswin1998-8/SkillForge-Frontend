"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/services/api/profileApi";
import { useGetDashboardQuery } from "@/services/api/progressApi";
import { useResetProgressMutation } from "@/services/api/adminApi";
import {
  clearStoredGrowthPathState,
  resolveGrowthPath,
} from "@/lib/growthPath";
import { getApiErrorMessage } from "@/lib/errors";

export function SettingsPage() {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();
  const { data: dashboard } = useGetDashboardQuery();
  const [updateProfile, { isLoading: savingObjective }] =
    useUpdateProfileMutation();
  const [editingObjective, setEditingObjective] = useState(false);
  const [objectiveDraft, setObjectiveDraft] = useState("");
  const [objectiveError, setObjectiveError] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetProgress, { isLoading: resetting }] = useResetProgressMutation();

  const storedGoal = profile?.technical_goal?.trim() || "";
  const goal = storedGoal || "Not set";
  const showTargetRole = resolveGrowthPath(storedGoal) !== "current-job";
  const targetRole =
    profile?.target_role?.name?.trim() ||
    profile?.target_role_label?.trim() ||
    "Not set";

  const openGaps = dashboard?.open_gaps_count ?? 0;
  const closedGaps = dashboard?.closed_gaps_count ?? 0;
  const gapTotal = openGaps + closedGaps;
  const readiness =
    gapTotal > 0 ? Math.round((closedGaps / gapTotal) * 100) : null;

  useEffect(() => {
    if (editingObjective) return;
    setObjectiveDraft(storedGoal);
  }, [storedGoal, editingObjective]);

  async function handleSaveObjective() {
    setObjectiveError(null);
    try {
      await updateProfile({ technical_goal: objectiveDraft.trim() }).unwrap();
      setEditingObjective(false);
    } catch (err) {
      setObjectiveError(
        getApiErrorMessage(err, "Could not save your objective."),
      );
    }
  }

  async function handleNuclearReset() {
    if (resetConfirm !== "RESET" || resetting) return;
    setResetError(null);
    try {
      await resetProgress({ confirm: "RESET" }).unwrap();
      clearStoredGrowthPathState();
      router.replace("/dashboard");
    } catch (err) {
      setResetError(
        getApiErrorMessage(err, "Could not reset progress. Staff access required."),
      );
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      <div className="mx-auto flex w-full flex-col items-start gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10 md:px-10">
        <div className="flex w-full min-w-0 flex-grow flex-col gap-8 sm:gap-10">
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                01
              </span>
              <h2 className="headline-sm text-on-surface">Career Goals</h2>
            </div>
            <div className="flex flex-col gap-6 rounded-xl border border-outline-variant/30 bg-surface-container p-4">
              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-on-surface-variant">
                  Primary Objective
                </label>
                {editingObjective ? (
                  <textarea
                    value={objectiveDraft}
                    onChange={(e) => setObjectiveDraft(e.target.value)}
                    className="mt-1 min-h-[80px] w-full rounded-lg border border-outline-variant/50 bg-surface-dim p-3 body-lg text-on-surface focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="body-lg text-on-surface">{goal}</p>
                )}
                {objectiveError ? (
                  <p className="body-sm text-error">{objectiveError}</p>
                ) : null}
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (editingObjective) {
                        void handleSaveObjective();
                      } else {
                        setObjectiveDraft(storedGoal);
                        setObjectiveError(null);
                        setEditingObjective(true);
                      }
                    }}
                    disabled={savingObjective}
                    className="self-start font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary hover:underline disabled:opacity-50"
                  >
                    {editingObjective
                      ? savingObjective
                        ? "Saving…"
                        : "Save"
                      : "Edit Objective"}
                  </button>
                  {editingObjective ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingObjective(false);
                        setObjectiveDraft(storedGoal);
                        setObjectiveError(null);
                      }}
                      className="self-start font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant hover:underline"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>

              {showTargetRole || readiness != null ? (
                <>
                  <div className="h-px w-full bg-outline-variant/30" />

                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    {showTargetRole ? (
                      <div className="flex flex-grow flex-col gap-2">
                        <label className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-on-surface-variant">
                          Target Role{" "}
                          <span className="flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary-container/20 px-2 py-1 text-secondary">
                            <span className="material-symbols-outlined text-[12px]">
                              schedule
                            </span>
                            In Progress
                          </span>
                        </label>
                        <div className="headline-md text-on-surface">
                          {targetRole}
                        </div>
                      </div>
                    ) : null}
                    {readiness != null ? (
                      <div className="flex w-full flex-col gap-2 md:w-64">
                        <div className="flex items-end justify-between">
                          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                            Transition Readiness
                          </span>
                          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary">
                            {readiness}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full border border-outline-variant/30 bg-surface-dim">
                          <div
                            className="relative h-full bg-primary"
                            style={{ width: `${readiness}%` }}
                          >
                            <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          </section>

          {user?.is_staff ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-error">
                  Admin
                </span>
                <h2 className="headline-sm text-on-surface">Reset progress</h2>
              </div>
              <div className="flex flex-col gap-4 rounded-xl border border-error/30 bg-surface-container p-4">
                <p className="body-sm text-on-surface-variant">
                  Irreversible. Wipes diagnostics, roadmap, gaps, challenge
                  attempts, sessions, and onboarding fields for{" "}
                  <span className="text-on-surface">{user.email}</span>. Your
                  login stays; Home returns to the initial onboarding flow.
                </p>
                <label className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-wider text-on-surface-variant">
                    Type RESET to confirm
                  </span>
                  <input
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    placeholder="RESET"
                    className="rounded-lg border border-outline-variant/50 bg-surface-dim px-3 py-2 body-sm text-on-surface focus:border-primary focus:outline-none"
                    autoComplete="off"
                  />
                </label>
                {resetError ? (
                  <p className="body-sm text-error">{resetError}</p>
                ) : null}
                <button
                  type="button"
                  disabled={resetConfirm !== "RESET" || resetting}
                  onClick={() => void handleNuclearReset()}
                  className="self-start rounded-lg bg-error px-4 py-2 body-sm text-on-error transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {resetting ? "Resetting…" : "Reset my progress"}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <footer className="mt-10 border-t border-outline-variant/20 bg-surface-container-lowest py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 body-sm text-on-surface-variant md:flex-row">
          <div>© 2024 Honed Systems Inc.</div>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-primary" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Status
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
