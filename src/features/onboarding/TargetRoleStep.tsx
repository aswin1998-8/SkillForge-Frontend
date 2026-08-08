"use client";

import { cn } from "@/lib/utils";
import { useGetRolesQuery } from "@/services/api/rolesApi";
import { Badge } from "@/components/ui/badge";

type TargetRoleStepProps = {
  targetRoleId: number | null;
  onChange: (id: number) => void;
};

export function TargetRoleStep({ targetRoleId, onChange }: TargetRoleStepProps) {
  const { data: roles, isLoading, error } = useGetRolesQuery();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Target role</h2>
        <p className="text-sm text-muted">
          Diagnostics and daily challenges align to this role&apos;s skill graph.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted">Loading roles…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-danger">Could not load roles.</p>
      ) : null}
      <div className="grid gap-2">
        {roles?.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={cn(
              "rounded-md border px-4 py-3 text-left transition-colors",
              targetRoleId === role.id
                ? "border-primary/50 bg-primary/10"
                : "border-border-subtle hover:border-primary/30",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{role.name}</span>
              <Badge variant={targetRoleId === role.id ? "accent" : "default"}>
                {role.skills.length} skills
              </Badge>
            </div>
            {role.description ? (
              <p className="mt-1 text-sm text-muted line-clamp-2">
                {role.description}
              </p>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
