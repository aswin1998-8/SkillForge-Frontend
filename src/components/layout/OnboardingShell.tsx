"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  children: ReactNode;
  footer: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidthClassName?: string;
};

/**
 * Viewport-fit onboarding layout: scrollable body + sticky footer CTA.
 * Keeps Continue visible on 14–16" laptop viewports without hunting for the button.
 */
export function OnboardingShell({
  children,
  footer,
  className,
  contentClassName,
  maxWidthClassName = "max-w-3xl",
}: OnboardingShellProps) {
  return (
    <div
      className={cn(
        "relative flex h-[calc(100dvh-3.5rem)] w-full min-w-0 flex-col overflow-hidden bg-background sm:h-[calc(100dvh-4rem)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col",
          maxWidthClassName,
        )}
      >
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5",
            contentClassName,
          )}
        >
          {children}
        </div>
        <div className="shrink-0 border-t border-outline-variant/30 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6">
          {footer}
        </div>
      </div>
    </div>
  );
}
