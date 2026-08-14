"use client";

import { useMeQuery } from "@/services/api/authApi";

export function StaffGate({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMeQuery();

  if (isLoading) {
    return (
      <div className="px-4 py-10 body-sm text-on-surface-variant sm:px-6 md:px-10">
        Loading…
      </div>
    );
  }

  if (!user?.is_staff) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 py-10 sm:px-6 md:px-10">
        <h1 className="headline-sm text-on-surface">Not authorized</h1>
        <p className="body-sm text-on-surface-variant">
          This page is only available to staff.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
