"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGetRolesQuery } from "@/services/api/rolesApi";
import { cn } from "@/lib/utils";

const FALLBACK_SUGGESTIONS = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Backend Engineer",
  "Staff Engineer",
  "Full Stack Developer",
];

const LEARN_STACK_OPTIONS = [
  "Node.js",
  "Python",
  "Django",
  "FastAPI",
  "Go",
  "Java",
  "Spring",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "TypeScript",
  "Rust",
];

type Props = {
  currentRole: string;
  targetRole: string;
  onTargetChange: (value: string) => void;
  /** Languages/frameworks the user wants to learn for the target role. */
  learnSkills: string[];
  learnSkillOptions: string[];
  onToggleLearnSkill: (skill: string) => void;
  onAddLearnSkill: (skill: string) => void;
  onStart: () => void;
  onBack?: () => void;
  isLoading?: boolean;
};

export function OnboardingTargetStep({
  currentRole,
  targetRole,
  onTargetChange,
  learnSkills,
  learnSkillOptions,
  onToggleLearnSkill,
  onAddLearnSkill,
  onStart,
  onBack,
  isLoading,
}: Props) {
  const { data: roles } = useGetRolesQuery();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [ring, setRing] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const fromApi = roles?.map((r) => r.name) ?? [];
    return Array.from(new Set([...fromApi, ...FALLBACK_SUGGESTIONS]));
  }, [roles]);

  const filtered = useMemo(() => {
    const q = targetRole.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 8);
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [suggestions, targetRole]);

  const options = useMemo(() => {
    const merged = new Set([
      ...LEARN_STACK_OPTIONS,
      ...learnSkillOptions,
      ...learnSkills,
    ]);
    return Array.from(merged);
  }, [learnSkillOptions, learnSkills]);

  const selectedSet = useMemo(() => new Set(learnSkills), [learnSkills]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleInput(value: string) {
    onTargetChange(value);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 200);
    setOpen(true);
  }

  function pick(name: string) {
    onTargetChange(name);
    setOpen(false);
    setRing(true);
    window.setTimeout(() => setRing(false), 500);
    inputRef.current?.focus();
  }

  function focusTargetInput() {
    inputRef.current?.focus();
    setOpen(true);
  }

  function submitCustomSkill() {
    const name = customSkill.trim();
    if (!name) {
      setAddingCustom(false);
      return;
    }
    onAddLearnSkill(name);
    setCustomSkill("");
    setAddingCustom(false);
  }

  const display = targetRole.trim() || "Your goal";
  const canStart =
    targetRole.trim().length > 0 && learnSkills.length > 0 && !isLoading;

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1440px] flex-col items-center justify-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-tertiary/5 blur-3xl" />
      </div>

      <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
        <span>STEP 03</span>
        <span className="text-on-surface/30">/</span>
        <span className="text-on-surface/30">03</span>
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-8">
        <div className="space-y-4 text-center">
          <h1 className="display-lg text-on-background !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
            Where do you want to go?
          </h1>
          <p className="body-lg mx-auto max-w-lg text-on-surface-variant">
            Pick your target role, then the languages and frameworks you want to
            learn for it. Your Step 01 stack stays as what you already know for
            transferable skills.
          </p>
        </div>

        <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-surface-container p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant">
              Current
            </span>
            <div className="relative rounded-lg border border-outline-variant/30 bg-surface p-4 headline-md text-on-surface shadow-sm">
              {currentRole.trim() || "Your role"}
              <div className="absolute -right-2 -top-2 h-4 w-4 animate-ping rounded-full bg-primary/20" />
              <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary" />
            </div>
          </div>

          <div className="relative flex items-center justify-center px-6">
            <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-gradient-to-r from-outline-variant to-primary">
              <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-on-surface to-transparent" />
            </div>
            <span className="material-symbols-outlined absolute rounded-full bg-surface-container p-1 text-[24px] text-primary shadow-sm">
              arrow_forward
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-primary">
              Target
            </span>
            <button
              type="button"
              onClick={focusTargetInput}
              className={cn(
                "rounded-lg border border-primary/30 bg-primary-container/20 p-4 headline-md text-primary shadow-md transition-all duration-300 hover:bg-primary-container/30",
                pulse && "scale-105 bg-primary-container/40",
                ring && "shadow-lg shadow-primary/30 ring-2 ring-primary",
                !targetRole.trim() && "text-primary/60",
              )}
            >
              {display}
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl border border-outline-variant/10 bg-surface-container p-8 shadow-lg sm:p-10">
          <div className="mb-2 flex items-end justify-between gap-3">
            <label
              htmlFor="target-role"
              className="block headline-sm text-on-surface"
            >
              Target Role
            </label>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-on-surface-variant">
              Editable
            </span>
          </div>
          <div className="group relative" ref={wrapRef}>
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[20px] text-on-surface-variant transition-colors group-focus-within:text-primary">
              work
            </span>
            <input
              ref={inputRef}
              id="target-role"
              type="text"
              name="target_role"
              autoComplete="off"
              spellCheck={false}
              value={targetRole}
              onChange={(e) => handleInput(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="Type a role, e.g. Full Stack Developer"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim py-5 pl-12 pr-20 font-[family-name:var(--font-jetbrains-mono)] text-[16px] leading-6 text-on-surface caret-primary outline-none transition-all placeholder:text-on-surface-variant/70 focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {targetRole ? (
                <button
                  type="button"
                  aria-label="Clear target role"
                  onClick={() => {
                    onTargetChange("");
                    setOpen(true);
                    inputRef.current?.focus();
                  }}
                  className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Show role suggestions"
                onClick={() => {
                  setOpen((v) => !v);
                  inputRef.current?.focus();
                }}
                className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {open ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>

            {open && filtered.length > 0 ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-high shadow-xl">
                <ul className="max-h-64 overflow-auto py-2">
                  {filtered.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => pick(name)}
                        className={cn(
                          "group flex w-full items-center justify-between px-4 py-2.5 body-sm text-on-surface hover:bg-surface-container-highest",
                          name.toLowerCase() ===
                            targetRole.trim().toLowerCase() &&
                            "bg-primary-container/20 text-primary",
                        )}
                      >
                        <span>{name}</span>
                        <span className="material-symbols-outlined text-[16px] text-primary opacity-0 group-hover:opacity-100">
                          check
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <p className="mt-3 body-sm text-on-surface-variant">
            Choose from suggestions or type any role name.
          </p>
        </div>

        <div className="relative rounded-2xl border border-outline-variant/10 bg-surface-container p-8 shadow-lg sm:p-10">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="headline-sm text-on-surface">
                Languages &amp; frameworks to learn
              </h2>
              <p className="mt-1 body-sm text-on-surface-variant">
                For your target role — e.g. backend language if you&apos;re going
                full stack. Used for diagnostic questions, gaps, roadmap, and
                transferable skills.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddingCustom(true)}
              className="shrink-0 body-sm text-primary transition-colors hover:text-on-primary-container"
            >
              Add custom
            </button>
          </div>

          {addingCustom ? (
            <div className="mb-4 flex gap-2">
              <input
                autoFocus
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitCustomSkill();
                  }
                  if (e.key === "Escape") {
                    setAddingCustom(false);
                    setCustomSkill("");
                  }
                }}
                placeholder="e.g. Node.js, Django, Go"
                className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-dim px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={submitCustomSkill}
                className="rounded-lg bg-primary-container px-3 py-2 text-sm text-on-primary-container"
              >
                Add
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {options.map((skill) => {
              const active = selectedSet.has(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => onToggleLearnSkill(skill)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 transition-all",
                    active
                      ? "border-primary bg-primary/20 text-primary hover:bg-primary/30"
                      : "border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high",
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[16px] transition-all",
                      active ? "opacity-100" : "ml-[-4px] w-0 opacity-0",
                    )}
                  >
                    {active ? "check" : "add"}
                  </span>
                  {skill}
                </button>
              );
            })}
          </div>

          {learnSkills.length === 0 ? (
            <p className="mt-3 body-sm text-error">
              Select at least one language or framework you want to learn.
            </p>
          ) : (
            <p className="mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant">
              Learning: {learnSkills.join(", ")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-5 py-4 body-sm text-on-surface transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            Back
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={!canStart}
            className="flex items-center gap-2 rounded-xl bg-primary px-10 py-6 headline-sm text-on-primary shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
          >
            <span>{isLoading ? "Starting…" : "Start Diagnostic"}</span>
            <span className="material-symbols-outlined text-[20px]">
              psychiatry
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
