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
  const { data: user, isLoading, isError, isUninitialized, isFetching } =
    useMeQuery();

  useEffect(() => {
    if (isLoading || isUninitialized || isFetching) return;

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
        return;
      }
      router.replace("/dashboard");
      return;
    }

    if (!authed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [
    user,
    isLoading,
    isUninitialized,
    isFetching,
    isError,
    mode,
    pathname,
    router,
  ]);

  if (isLoading || isUninitialized || isFetching) {
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
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
        Redirecting…
      </div>
    );
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
