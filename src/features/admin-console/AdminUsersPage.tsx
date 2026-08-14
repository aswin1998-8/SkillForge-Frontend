"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiErrorMessage } from "@/lib/errors";
import { useStaffUsersQuery } from "@/services/api/staffApi";
import { AdminConsoleTabs } from "./AdminConsoleTabs";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState("");
  const { data, isLoading, isFetching, error } = useStaffUsersQuery({
    q: submittedQ || undefined,
  });
  const rows = data?.results ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 md:px-10">
      <div>
        <h1 className="headline-sm text-on-surface">Admin console</h1>
        <p className="mt-1 body-sm text-on-surface-variant">
          People who already have accounts, and what they have done.
        </p>
      </div>
      <AdminConsoleTabs />

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedQ(q.trim());
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email or name"
          className="h-10 min-w-[16rem] flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 body-sm text-on-surface"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-4 body-sm font-medium text-on-primary"
        >
          Search
        </button>
      </form>

      {error ? (
        <p className="body-sm text-error">
          {getApiErrorMessage(error, "Could not load users.")}
        </p>
      ) : null}

      <p className="body-sm text-on-surface-variant">
        {isLoading || isFetching ? "Loading…" : `${total} user${total === 1 ? "" : "s"}`}
      </p>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
        <table className="w-full min-w-[60rem] text-left">
          <thead className="bg-surface-container-low body-sm text-on-surface-variant">
            <tr>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium">Last login</th>
              <th className="px-3 py-2 font-medium">Onboarding</th>
              <th className="px-3 py-2 font-medium">Diagnostics</th>
              <th className="px-3 py-2 font-medium">Challenges</th>
              <th className="px-3 py-2 font-medium">Open gaps</th>
              <th className="px-3 py-2 font-medium">Last session</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-outline-variant/15">
                <td className="px-3 py-2">
                  <Link
                    href={`/admin-console/users/${row.id}`}
                    className="body-sm text-primary hover:underline"
                  >
                    {row.email}
                  </Link>
                  <div className="body-sm text-on-surface-variant">
                    {[row.first_name, row.last_name].filter(Boolean).join(" ") || "—"}
                    {row.is_staff ? " · staff" : ""}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2 body-sm text-on-surface-variant">
                  {formatDate(row.date_joined)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 body-sm text-on-surface-variant">
                  {formatDate(row.last_login)}
                </td>
                <td className="px-3 py-2 body-sm text-on-surface-variant">
                  {row.onboarding_completed ? "Done" : "Open"}
                </td>
                <td className="px-3 py-2 body-sm text-on-surface">{row.diagnostics_completed}</td>
                <td className="px-3 py-2 body-sm text-on-surface">{row.challenges_completed}</td>
                <td className="px-3 py-2 body-sm text-on-surface">{row.open_gaps}</td>
                <td className="whitespace-nowrap px-3 py-2 body-sm text-on-surface-variant">
                  {formatDate(row.last_session_at)}
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center body-sm text-on-surface-variant"
                >
                  No users match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
