"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileStepProps = {
  currentRole: string;
  years: string;
  onChange: (patch: { currentRole?: string; years?: string }) => void;
};

export function ProfileStep({ currentRole, years, onChange }: ProfileStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Your baseline</h2>
        <p className="text-sm text-muted">
          Tell us where you are so challenges match your depth.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="current_role">Current role</Label>
        <Input
          id="current_role"
          placeholder="e.g. Backend engineer"
          value={currentRole}
          onChange={(e) => onChange({ currentRole: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="years">Years of experience</Label>
        <Input
          id="years"
          type="number"
          min={0}
          max={50}
          value={years}
          onChange={(e) => onChange({ years: e.target.value })}
        />
      </div>
    </div>
  );
}
