"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/authApi";

type Mode = "auth" | "onboarding" | "dashboard";

export function AuthGate({
  mode,
  children,
}: {
  mode: Mode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError, isUninitialized } = useMeQuery();

  useEffect(() => {
    if (isLoading || isUninitialized) return;

    const authed = Boolean(user) && !isError;

    if (mode === "auth") {
      if (authed) {
        router.replace("/dashboard");
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
  }, [user, isLoading, isUninitialized, isError, mode, pathname, router]);

  if (isLoading || isUninitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  const authed = Boolean(user) && !isError;

  if (mode === "auth") {
    if (authed) {
      return (
        <div className="flex min-h-screen items-center justify-center text-sm text-muted">
          Redirecting…
        </div>
      );
    }
    return <>{children}</>;
  }

  if (mode === "onboarding") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Redirecting…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
