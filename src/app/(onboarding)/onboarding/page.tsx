"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/layout/AuthGate";
import { Button } from "@/components/ui/button";
import { ProfileStep } from "@/features/onboarding/ProfileStep";
import { GoalStep } from "@/features/onboarding/GoalStep";
import { TargetRoleStep } from "@/features/onboarding/TargetRoleStep";
import { useUpdateProfileMutation } from "@/services/api/profileApi";
import { getApiErrorMessage } from "@/lib/errors";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [currentRole, setCurrentRole] = useState("");
  const [years, setYears] = useState("2");
  const [goal, setGoal] = useState("");
  const [targetRoleId, setTargetRoleId] = useState<number | null>(null);
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  async function finish() {
    await updateProfile({
      current_role: currentRole,
      years_of_experience: years ? Number(years) : null,
      technical_goal: goal,
      target_role_id: targetRoleId,
      complete_onboarding: true,
    }).unwrap();
    router.replace("/dashboard");
  }

  return (
    <AuthGate mode="onboarding">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
          Onboarding · {step + 1}/3
        </p>
        <div className="mt-6 rounded border border-border-subtle bg-surface-container/90 p-6 backdrop-blur">
          {step === 0 ? (
            <ProfileStep
              currentRole={currentRole}
              years={years}
              onChange={(patch) => {
                if (patch.currentRole !== undefined) setCurrentRole(patch.currentRole);
                if (patch.years !== undefined) setYears(patch.years);
              }}
            />
          ) : null}
          {step === 1 ? <GoalStep goal={goal} onChange={setGoal} /> : null}
          {step === 2 ? (
            <TargetRoleStep
              targetRoleId={targetRoleId}
              onChange={setTargetRoleId}
            />
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-danger">{getApiErrorMessage(error)}</p>
          ) : null}

          <div className="mt-6 flex justify-between gap-3">
            <Button
              variant="secondary"
              disabled={step === 0 || isLoading}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 2 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 0 && !currentRole.trim()) ||
                  (step === 1 && !goal.trim())
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={finish}
                disabled={!targetRoleId || isLoading}
              >
                {isLoading ? "Saving…" : "Enter ForgeIQ"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
