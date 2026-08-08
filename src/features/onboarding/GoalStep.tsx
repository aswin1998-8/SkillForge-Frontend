"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type GoalStepProps = {
  goal: string;
  onChange: (goal: string) => void;
};

export function GoalStep({ goal, onChange }: GoalStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Technical goal</h2>
        <p className="text-sm text-muted">
          One sharp outcome — not a wishlist. What should ForgeIQ forge toward?
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal">Goal</Label>
        <Textarea
          id="goal"
          placeholder="Ship production systems design fluency for staff-level interviews"
          value={goal}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
