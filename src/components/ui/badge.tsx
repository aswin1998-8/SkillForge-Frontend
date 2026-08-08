import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2 py-0.5 mono-label uppercase",
  {
    variants: {
      variant: {
        default:
          "border-border-subtle bg-surface-container-highest/40 text-on-surface-variant",
        accent:
          "border-primary/25 bg-primary/10 text-primary",
        danger:
          "border-error/30 bg-error/10 text-error",
        success:
          "border-success/30 bg-success/10 text-success",
        warning:
          "border-warning/30 bg-warning/10 text-warning",
        progress:
          "border-primary-action/30 bg-primary-action/10 text-primary-action",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
