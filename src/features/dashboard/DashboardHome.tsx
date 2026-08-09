"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProfileMutation } from "@/services/api/profileApi";
import { useGetRolesQuery } from "@/services/api/rolesApi";
import {
  OnboardingObjectiveStep,
  goalLabel,
  type OnboardingGoal,
} from "@/features/onboarding/OnboardingObjectiveStep";
import { OnboardingTargetStep } from "@/features/onboarding/OnboardingTargetStep";
import {
  OnboardingMasteryStep,
  domainLabels,
  type TechnicalDomain,
} from "@/features/onboarding/OnboardingMasteryStep";
import {
  setFocusDomain,
  setFocusDomainIds,
  setGrowthPath,
} from "@/lib/growthPath";
import { cn } from "@/lib/utils";

const DEFAULT_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Python",
  "AWS",
  "PostgreSQL",
] as const;

export function DashboardHome() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | "mastery" | 3>(1);
  const [currentRole, setCurrentRole] = useState("Frontend Developer");
  const [years, setYears] = useState("4");
  const [selected, setSelected] = useState<string[]>([
    "React",
    "TypeScript",
    "Next.js",
  ]);
  const [customSkill, setCustomSkill] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);
  const [skills, setSkills] = useState<string[]>([...DEFAULT_SKILLS]);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [domains, setDomains] = useState<TechnicalDomain[]>(["system-design"]);
  const [targetRole, setTargetRole] = useState("");
  const [learnSelected, setLearnSelected] = useState<string[]>([]);
  const [learnOptions, setLearnOptions] = useState<string[]>([]);
  const { data: roles } = useGetRolesQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleSkill(skill: string) {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function toggleLearnSkill(skill: string) {
    setLearnSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function addCustomSkill() {
    const name = customSkill.trim();
    if (!name) {
      setAddingCustom(false);
      return;
    }
    if (!skills.includes(name)) {
      setSkills((prev) => [...prev, name]);
    }
    setSelected((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setCustomSkill("");
    setAddingCustom(false);
  }

  function toggleDomain(id: TechnicalDomain) {
    setDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  async function continueFromBaseline() {
    try {
      const yearsNum = years === "" ? undefined : Number(years);
      await updateProfile({
        current_role: currentRole || undefined,
        years_of_experience:
          yearsNum != null && !Number.isNaN(yearsNum) ? yearsNum : undefined,
        known_skills: selected,
      }).unwrap();
    } catch {
      // Demo flow: continue even if API is unavailable
    }
    setStep(2);
  }

  async function continueFromGoal() {
    if (!goal) return;
    setGrowthPath(goal);
    if (goal === "current-job") {
      setStep("mastery");
    } else {
      setStep(3);
    }
    void updateProfile({
      technical_goal: goalLabel(goal),
      known_skills: selected,
    });
  }

  async function continueFromMastery() {
    if (!domains.length) return;

    const target = currentRole.trim() || "your current role";
    const matched = roles?.find(
      (r) => r.name.toLowerCase() === target.toLowerCase(),
    );
    const focus = domainLabels(domains);

    setGrowthPath("current-job");
    setFocusDomain(focus);
    setFocusDomainIds(domains);

    void updateProfile({
      current_role: currentRole || undefined,
      technical_goal: `${goalLabel("current-job")} · ${focus}`,
      target_role_label: target,
      target_role_id: matched?.id ?? null,
      known_skills: selected,
      complete_onboarding: true,
    });

    const q = new URLSearchParams();
    q.set("target", target);
    router.push(`/diagnostic?${q.toString()}`);
  }

  async function startDiagnostic() {
    const label = targetRole.trim();
    const matched = roles?.find(
      (r) => r.name.toLowerCase() === label.toLowerCase(),
    );
    setGrowthPath(goal === "current-job" ? "current-job" : "new-role");
    try {
      await updateProfile({
        current_role: currentRole || undefined,
        technical_goal: goal ? goalLabel(goal) : undefined,
        target_role_label: label,
        target_role_id: matched?.id ?? null,
        known_skills: selected,
        target_learn_skills: learnSelected,
        complete_onboarding: true,
      }).unwrap();
    } catch {
      // Demo flow
    }
    const q = new URLSearchParams();
    if (label) q.set("target", label);
    router.push(`/diagnostic${q.toString() ? `?${q}` : ""}`);
  }

  if (step === 2) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-background">
        <OnboardingObjectiveStep
          selected={goal}
          onSelect={setGoal}
          onContinue={continueFromGoal}
          onBack={() => setStep(1)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (step === "mastery") {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-background">
        <OnboardingMasteryStep
          domains={domains}
          onToggleDomain={toggleDomain}
          onContinue={continueFromMastery}
          onBack={() => setStep(2)}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-background">
        <OnboardingTargetStep
          currentRole={currentRole}
          targetRole={targetRole}
          onTargetChange={setTargetRole}
          learnSkills={learnSelected}
          learnSkillOptions={learnOptions}
          onToggleLearnSkill={toggleLearnSkill}
          onAddLearnSkill={(name) => {
            if (!learnOptions.includes(name)) {
              setLearnOptions((prev) => [...prev, name]);
            }
            setLearnSelected((prev) =>
              prev.includes(name) ? prev : [...prev, name],
            );
          }}
          onStart={startDiagnostic}
          onBack={() => setStep(2)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute right-0 top-0 -mr-[200px] -mt-[200px] h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-[150px] -ml-[150px] h-[600px] w-[600px] rounded-full bg-secondary-container/10 blur-[100px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-[600px] rounded-lg bg-surface-container-low p-6">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-2 w-8 rounded-full bg-primary" />
              <div className="h-2 w-8 rounded-full bg-surface-container-highest" />
              <div className="h-2 w-8 rounded-full bg-surface-container-highest" />
            </div>
            <div className="rounded bg-surface-container px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
              Step 01 / 03
            </div>
          </div>

          <div className="mb-10">
            <h1 className="display-lg mb-2 text-on-surface !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
              Where are you today?
            </h1>
            <p className="body-lg text-on-surface-variant">
              Let&apos;s establish your baseline to tailor the learning path.
            </p>
          </div>

          <div className="mb-10 space-y-6">
            <div className="group">
              <label className="mb-1 block font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
                Current Role
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
                  work
                </span>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g., Frontend Developer"
                  className="w-full rounded-lg bg-surface-container-lowest p-4 pl-12 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface transition-all focus:bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="group">
              <label className="mb-1 block font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
                Years of Experience
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
                  timeline
                </span>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="e.g., 4"
                  className="w-full rounded-lg bg-surface-container-lowest p-4 pl-12 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface transition-all focus:bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="mb-2 flex items-center justify-between">
              <label className="block font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
                Core Skills
              </label>
              <button
                type="button"
                onClick={() => setAddingCustom(true)}
                className="body-sm text-primary transition-colors hover:text-on-primary-container"
              >
                Add Custom
              </button>
            </div>

            {addingCustom && (
              <div className="mb-3 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                    if (e.key === "Escape") {
                      setAddingCustom(false);
                      setCustomSkill("");
                    }
                  }}
                  placeholder="Skill name"
                  className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="rounded-lg bg-primary-container px-3 py-2 text-sm text-on-primary-container"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const active = selectedSet.has(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 transition-all",
                      active
                        ? "border-primary bg-primary/20 text-primary hover:bg-primary/30"
                        : "border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined text-[16px] transition-all",
                        active ? "opacity-100" : "w-0 -ml-1 opacity-0",
                      )}
                    >
                      {active ? "check" : "add"}
                    </span>
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-surface-container-highest pt-6">
            <button
              type="button"
              onClick={continueFromBaseline}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg px-10 py-4 headline-sm shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundColor: "rgb(59, 130, 246)", color: "white" }}
            >
              {isLoading ? "Saving…" : "Continue"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
