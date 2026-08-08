"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGetRolesQuery } from "@/services/api/rolesApi";
import { cn } from "@/lib/utils";

const FALLBACK_SUGGESTIONS = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
];

type Props = {
  currentRole: string;
  targetRole: string;
  onTargetChange: (value: string) => void;
  onStart: () => void;
  isLoading?: boolean;
};

export function OnboardingTargetStep({
  currentRole,
  targetRole,
  onTargetChange,
  onStart,
  isLoading,
}: Props) {
  const { data: roles } = useGetRolesQuery();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [ring, setRing] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const fromApi = roles?.map((r) => r.name) ?? [];
    return Array.from(new Set([...fromApi, ...FALLBACK_SUGGESTIONS]));
  }, [roles]);

  const filtered = useMemo(() => {
    const q = targetRole.trim().toLowerCase();
    if (q.length < 2) return [];
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [suggestions, targetRole]);

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
    setOpen(value.trim().length > 1);
  }

  function pick(name: string) {
    onTargetChange(name);
    setOpen(false);
    setRing(true);
    window.setTimeout(() => setRing(false), 500);
  }

  const display = targetRole.trim() || "Your Goal";

  return (
    <div className="relative mx-auto flex h-[calc(100vh-64px)] w-full max-w-[1440px] flex-col items-center justify-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-tertiary/5 blur-3xl" />
      </div>

      <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
        <span>STEP 03</span>
        <span className="text-on-surface/30">/</span>
        <span className="text-on-surface/30">03</span>
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <h1 className="display-lg text-on-background !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
            Where do you want to go?
          </h1>
          <p className="body-lg mx-auto max-w-lg text-on-surface-variant">
            We&apos;ll find the gap between where you are and where you want to
            be. Define your target destination to tailor your learning path.
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
            <div
              className={cn(
                "rounded-lg border border-primary/30 bg-primary-container/20 p-4 headline-md text-primary shadow-md transition-all duration-300",
                pulse && "scale-105 bg-primary-container/40",
                ring && "shadow-lg shadow-primary/30 ring-2 ring-primary",
              )}
            >
              {display}
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-outline-variant/10 bg-surface-container p-10 shadow-lg">
          <label
            htmlFor="target-role"
            className="mb-2 block headline-sm text-on-surface"
          >
            Target Role
          </label>
          <div className="group relative" ref={wrapRef}>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant transition-colors group-focus-within:text-primary">
              work
            </span>
            <input
              id="target-role"
              type="text"
              autoComplete="off"
              value={targetRole}
              onChange={(e) => handleInput(e.target.value)}
              onFocus={() => {
                if (targetRole.trim().length > 1) setOpen(true);
              }}
              placeholder="e.g. Machine Learning Engineer, Systems Architect..."
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-dim py-6 pl-10 pr-4 font-[family-name:var(--font-jetbrains-mono)] text-[16px] leading-6 text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {open && filtered.length > 0 ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-high shadow-xl">
                <ul className="py-2">
                  {filtered.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => pick(name)}
                        className="group flex w-full items-center justify-between px-4 py-2 body-sm text-on-surface hover:bg-surface-container-highest"
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
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onStart}
            disabled={isLoading}
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
