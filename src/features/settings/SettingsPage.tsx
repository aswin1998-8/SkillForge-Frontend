"use client";

import { useState } from "react";
import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();
  const [editingObjective, setEditingObjective] = useState(false);
  const [objective, setObjective] = useState("");
  const [dailyNotifs, setDailyNotifs] = useState(true);
  const [timezone, setTimezone] = useState("system");
  const [language, setLanguage] = useState("en");
  const [twoFactor, setTwoFactor] = useState(true);
  const [mobileSession, setMobileSession] = useState(true);

  const goal =
    objective ||
    profile?.technical_goal ||
    "Switch to a new technical role to broaden architectural expertise.";
  const targetRole = profile?.target_role?.name || "AI Engineer";
  const readiness = 35;

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto flex w-full flex-col items-start gap-10 px-6 py-10 md:px-10">
        <div className="flex w-full flex-grow flex-col gap-10">
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
                    value={goal}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mt-1 min-h-[80px] w-full rounded-lg border border-outline-variant/50 bg-surface-dim p-3 body-lg text-on-surface focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="body-lg text-on-surface">{goal}</p>
                )}
                <button
                  type="button"
                  onClick={() => setEditingObjective((v) => !v)}
                  className="mt-2 self-start font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary hover:underline"
                >
                  {editingObjective ? "Done" : "Edit Objective"}
                </button>
              </div>

              <div className="h-px w-full bg-outline-variant/30" />

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
                  <div className="headline-md text-on-surface">{targetRole}</div>
                </div>
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
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                02
              </span>
              <h2 className="headline-sm text-on-surface">Preferences</h2>
            </div>
            <div className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container">
              <div className="flex items-center justify-between border-b border-outline-variant/30 p-4">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="body-lg font-medium text-on-surface">
                    Daily Challenge Notifications
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    Receive email alerts when new algorithmic challenges are
                    available.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dailyNotifs}
                  onClick={() => setDailyNotifs((v) => !v)}
                  className={cn(
                    "relative flex h-6 w-12 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors",
                    dailyNotifs ? "bg-primary" : "bg-surface-dim",
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-0.5 h-5 w-5 rounded-full transition-transform",
                      dailyNotifs
                        ? "translate-x-6 bg-on-primary"
                        : "translate-x-0 bg-outline-variant",
                    )}
                  />
                </button>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 border-b border-outline-variant/30 p-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="body-lg font-medium text-on-surface">
                    Timezone Override
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    Force UI to display a specific timezone instead of local
                    system time.
                  </div>
                </div>
                <div className="relative w-full md:w-64">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant/50 bg-surface-dim p-2 pr-8 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface transition-colors focus:border-primary focus:outline-none"
                  >
                    <option value="system">System Default</option>
                    <option value="utc">UTC</option>
                    <option value="pst">Pacific Time (PT)</option>
                    <option value="est">Eastern Time (ET)</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="body-lg font-medium text-on-surface">
                    Interface Language
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    Select the primary language for the Honed platform.
                  </div>
                </div>
                <div className="relative w-full md:w-64">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant/50 bg-surface-dim p-2 pr-8 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface transition-colors focus:border-primary focus:outline-none"
                  >
                    <option value="en">English (US)</option>
                    <option value="ja">Japanese</option>
                    <option value="es">Spanish</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-error">
                03
              </span>
              <h2 className="headline-sm text-on-surface">Account Security</h2>
            </div>
            <div className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container">
              <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/30 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="body-lg font-medium text-on-surface">
                    Authentication
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    {user?.email
                      ? `Signed in as ${user.email}`
                      : "Last changed 4 months ago"}
                  </div>
                </div>
                <button
                  type="button"
                  className="whitespace-nowrap rounded-lg border border-outline-variant/50 bg-surface-dim px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface transition-colors hover:border-primary"
                >
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-outline-variant/30 p-4">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="flex items-center gap-2 body-lg font-medium text-on-surface">
                    Two-Factor Authentication{" "}
                    {twoFactor ? (
                      <span
                        className="material-symbols-outlined text-[16px] text-primary"
                        title="Enabled"
                      >
                        verified_user
                      </span>
                    ) : null}
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    Adds an extra layer of security to your account.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor((v) => !v)}
                  className={cn(
                    "whitespace-nowrap rounded-lg border px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] transition-colors",
                    twoFactor
                      ? "border-transparent text-error hover:border-error/30 hover:bg-error/10"
                      : "border-outline-variant/50 text-primary hover:border-primary",
                  )}
                >
                  {twoFactor ? "Disable" : "Enable"}
                </button>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <div className="body-lg font-medium text-on-surface">
                    Active Sessions
                  </div>
                  <div className="body-sm text-on-surface-variant">
                    Devices currently logged into your account.
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-dim p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          laptop_mac
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                          macOS • Chrome
                        </span>
                        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary">
                          Current Session (San Francisco, CA)
                        </span>
                      </div>
                    </div>
                  </div>

                  {mobileSession ? (
                    <div className="flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-dim p-2 opacity-80">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high text-on-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">
                            smartphone
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                            iOS • Safari
                          </span>
                          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                            Last active 2 days ago (San Francisco, CA)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        title="Revoke Session"
                        onClick={() => setMobileSession(false)}
                        className="p-1 text-on-surface-variant transition-colors hover:text-error"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          close
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
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
