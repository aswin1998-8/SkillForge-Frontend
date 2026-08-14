"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProfileMutation } from "@/services/api/profileApi";
import { useGetRolesQuery } from "@/services/api/rolesApi";
import { useGetDashboardQuery } from "@/services/api/progressApi";
import { OnboardingObjectiveStep, goalLabel, type OnboardingGoal } from "@/features/onboarding/OnboardingObjectiveStep";
import {
  OnboardingMasteryStep,
  frameworkLabels,
  type FrameworkSlug,
} from "@/features/onboarding/OnboardingMasteryStep";
import { QuickScoreFlow } from "@/features/quick-score/QuickScoreFlow";
import { PostOnboardingHome } from "@/features/dashboard/PostOnboardingHome";
import {
  setFocusFrameworkLabels,
  setFocusFrameworks,
  setGrowthPath,
} from "@/lib/growthPath";
import { OnboardingShell } from "@/components/layout/OnboardingShell";
import { cn } from "@/lib/utils";

type LanguageId = "javascript" | "python" | "sql";

const LANGUAGES: {
  id: LanguageId;
  label: string;
  frameworks: FrameworkSlug[];
}[] = [
  {
    id: "javascript",
    label: "JavaScript / TypeScript",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "python",
    label: "Python",
    frameworks: ["django", "fastapi"],
  },
  {
    id: "sql",
    label: "SQL",
    frameworks: ["postgresql"],
  },
];

const FRAMEWORK_OPTIONS: {
  id: FrameworkSlug;
  label: string;
  language: LanguageId;
}[] = [
  { id: "react", label: "React", language: "javascript" },
  { id: "nextjs", label: "Next.js", language: "javascript" },
  { id: "django", label: "Django", language: "python" },
  { id: "fastapi", label: "FastAPI", language: "python" },
  { id: "postgresql", label: "PostgreSQL", language: "sql" },
];

export function DashboardHome() {
  const router = useRouter();
  const { data: dashboard, isLoading: dashboardLoading } = useGetDashboardQuery();
  const [step, setStep] = useState<1 | "quick" | 2 | "mastery" | 3>(1);
  const [currentRole, setCurrentRole] = useState("");
  const [years, setYears] = useState("");
  const [languages, setLanguages] = useState<LanguageId[]>([]);
  const [frameworks, setFrameworks] = useState<FrameworkSlug[]>([]);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [targetFrameworks, setTargetFrameworks] = useState<FrameworkSlug[]>([]);
  const { data: roles } = useGetRolesQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const languageSet = useMemo(() => new Set(languages), [languages]);
  const frameworkSet = useMemo(() => new Set(frameworks), [frameworks]);

  const availableFrameworks = useMemo(
    () =>
      FRAMEWORK_OPTIONS.filter((f) =>
        languages.length ? languageSet.has(f.language) : false,
      ),
    [languages, languageSet],
  );

  const knownSkills = useMemo(() => {
    const langLabels = LANGUAGES.filter((l) => languageSet.has(l.id)).map(
      (l) => l.label,
    );
    const fwLabels = FRAMEWORK_OPTIONS.filter((f) => frameworkSet.has(f.id)).map(
      (f) => f.label,
    );
    return [...langLabels, ...fwLabels];
  }, [languageSet, frameworkSet]);

  const canContinueBaseline =
    currentRole.trim().length > 0 &&
    years.trim().length > 0 &&
    !Number.isNaN(Number(years)) &&
    Number(years) >= 0 &&
    languages.length > 0 &&
    frameworks.length > 0;

  useEffect(() => {
    const sessionId = dashboard?.active_diagnostic_session_id;
    if (!sessionId) return;
    router.replace(`/diagnostic/session/${sessionId}`);
  }, [dashboard?.active_diagnostic_session_id, router]);

  function toggleLanguage(id: LanguageId) {
    setLanguages((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      const allowed = new Set(
        FRAMEWORK_OPTIONS.filter((f) => next.includes(f.language)).map(
          (f) => f.id,
        ),
      );
      setFrameworks((fw) => fw.filter((f) => allowed.has(f)));
      return next;
    });
  }

  function toggleFramework(id: FrameworkSlug) {
    const option = FRAMEWORK_OPTIONS.find((f) => f.id === id);
    if (!option || !languageSet.has(option.language)) return;
    setFrameworks((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  function toggleTargetFramework(id: FrameworkSlug) {
    setTargetFrameworks((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  async function continueFromBaseline() {
    if (!canContinueBaseline) return;
    // Advance UI first so a slow/refetching profile PATCH cannot leave the
    // user staring at step 1 after they already submitted.
    setFocusFrameworks(frameworks);
    setFocusFrameworkLabels(frameworkLabels(frameworks));
    setStep(2);
    try {
      const yearsNum = Number(years);
      await updateProfile({
        current_role: currentRole.trim(),
        years_of_experience: yearsNum,
        known_skills: knownSkills,
      }).unwrap();
    } catch {
      // Demo flow: continue even if API is unavailable
    }
  }

  async function continueFromGoal() {
    if (!goal) return;
    setGrowthPath(goal);
    void updateProfile({
      technical_goal: goalLabel(goal),
      known_skills: knownSkills,
    });
    setStep("quick");
  }

  function continueFromQuickScore() {
    if (goal === "current-job") {
      // Current stack already chosen in step 1 — go straight to diagnostic.
      void goToDiagnostic(frameworks, "current-job");
    } else {
      setStep(3);
    }
  }

  async function goToDiagnostic(
    focusFrameworks: FrameworkSlug[],
    path: OnboardingGoal,
  ) {
    if (!focusFrameworks.length) return;
    const focus = frameworkLabels(focusFrameworks);
    const target =
      path === "current-job"
        ? currentRole.trim() || "your current role"
        : focus;
    const matched = roles?.find(
      (r) => r.name.toLowerCase() === target.toLowerCase(),
    );

    setGrowthPath(path);
    setFocusFrameworks(focusFrameworks);
    setFocusFrameworkLabels(focus);

    try {
      await updateProfile({
        current_role: currentRole.trim() || undefined,
        technical_goal: `${goalLabel(path)} · ${focus}`,
        target_role_label: target,
        target_role_id: matched?.id ?? null,
        known_skills: knownSkills,
        complete_onboarding: true,
      }).unwrap();
    } catch {
      // Demo flow
    }

    const q = new URLSearchParams();
    q.set("target", target);
    router.push(`/diagnostic?${q.toString()}`);
  }

  if (dashboardLoading) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">Loading your progress…</p>
    );
  }

  if (dashboard?.active_diagnostic_session_id) {
    return (
      <p className="p-6 text-sm text-on-surface-variant">
        Resuming your diagnostic…
      </p>
    );
  }

  if (dashboard?.onboarding_completed) {
    return <PostOnboardingHome dashboard={dashboard} />;
  }

  if (step === 2) {
    return (
      <OnboardingObjectiveStep
        selected={goal}
        onSelect={setGoal}
        onContinue={continueFromGoal}
        onBack={() => setStep(1)}
        isLoading={isLoading}
      />
    );
  }

  if (step === "quick") {
    return (
      <QuickScoreFlow
        currentRole={currentRole}
        knownSkills={knownSkills}
        onBack={() => setStep(2)}
        onComplete={continueFromQuickScore}
      />
    );
  }

  if (step === "mastery") {
    return (
      <OnboardingMasteryStep
        frameworks={frameworks}
        onToggleFramework={toggleFramework}
        onContinue={() => void goToDiagnostic(frameworks, "current-job")}
        onBack={() => setStep("quick")}
      />
    );
  }

  if (step === 3) {
    return (
      <OnboardingMasteryStep
        frameworks={targetFrameworks}
        onToggleFramework={toggleTargetFramework}
        onContinue={() => void goToDiagnostic(targetFrameworks, "new-role")}
        onBack={() => setStep("quick")}
        isLoading={isLoading}
        title="Which stack are you switching toward?"
        subtitle="Select only the frameworks for your target role. Diagnostics stay scoped to that stack."
      />
    );
  }

  return (
    <OnboardingShell
      maxWidthClassName="max-w-2xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate body-sm text-on-surface-variant">* Required</p>
          <button
            type="button"
            onClick={continueFromBaseline}
            disabled={isLoading || !canContinueBaseline}
            className="flex shrink-0 items-center gap-1 rounded-md bg-primary px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-primary shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Continue"}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-7 rounded-full bg-primary" />
          <div className="h-1.5 w-7 rounded-full bg-surface-container-highest" />
          <div className="h-1.5 w-7 rounded-full bg-surface-container-highest" />
        </div>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
          Step 01 / 03
        </span>
      </div>

      <h1 className="text-[28px] font-semibold leading-8 tracking-tight text-on-surface sm:text-[32px] sm:leading-9">
        Where are you today?
      </h1>
      <p className="mt-1.5 body-sm text-on-surface-variant">
        Role, experience, and the language + framework stack to scope your
        diagnostic.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="group sm:col-span-2">
          <label className="mb-1 block font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            Current Role <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant group-focus-within:text-primary">
              work
            </span>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g., Backend Developer"
              required
              className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-3 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface outline-none ring-1 ring-outline-variant/30 focus:ring-primary"
            />
          </div>
        </div>

        <div className="group sm:col-span-2">
          <label className="mb-1 block font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            Years of Experience <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant group-focus-within:text-primary">
              timeline
            </span>
            <input
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g., 4"
              required
              className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-3 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface outline-none ring-1 ring-outline-variant/30 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
          Programming Language <span className="text-primary">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = languageSet.has(lang.id);
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => toggleLanguage(lang.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[12px] transition-all",
                  active
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
          Framework <span className="text-primary">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {availableFrameworks.length ? (
            availableFrameworks.map((fw) => {
              const active = frameworkSet.has(fw.id);
              return (
                <button
                  key={fw.id}
                  type="button"
                  onClick={() => toggleFramework(fw.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[12px] transition-all",
                    active
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                  )}
                >
                  {fw.label}
                </button>
              );
            })
          ) : (
            <p className="body-sm text-on-surface-variant">
              Select a language to unlock frameworks.
            </p>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}
