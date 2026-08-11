"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";

type Mode = "auth" | "onboarding" | "dashboard";

function safeNextPath(raw: string | null, fallback = "/dashboard") {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

function nextFromLocation() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("next");
}

export function AuthGate({
  mode,
  children,
}: {
  mode: Mode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError, isUninitialized, isSuccess } =
    useMeQuery();

  // Only block the first auth check. Background refetches (e.g. after
  // updateProfile invalidates "User") must not unmount children — that
  // wiped onboarding step state and left users stuck on step 1.
  const waitingForInitialAuth = isUninitialized || (isLoading && !user);

  useEffect(() => {
    if (waitingForInitialAuth) return;

    const authed = Boolean(user) && !isError;

    if (mode === "auth") {
      if (authed) {
        router.replace(safeNextPath(nextFromLocation()));
      }
      return;
    }

    if (mode === "onboarding") {
      if (!authed) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    if (!authed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [
    user,
    waitingForInitialAuth,
    isError,
    isSuccess,
    mode,
    pathname,
    router,
  ]);

  if (waitingForInitialAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
        Loading…
      </div>
    );
  }

  const authed = Boolean(user) && !isError;

  if (mode === "auth") {
    if (authed) {
      return (
        <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
          Redirecting…
        </div>
      );
    }
    return <>{children}</>;
  }

  if (mode === "onboarding") {
    if (!authed) {
      return (
        <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
          Redirecting…
        </div>
      );
    }
    return <>{children}</>;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
