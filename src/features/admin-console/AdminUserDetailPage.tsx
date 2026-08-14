"use client";

import Link from "next/link";
import { getApiErrorMessage } from "@/lib/errors";
import { useStaffUserDetailQuery } from "@/services/api/staffApi";
import { AdminConsoleTabs } from "./AdminConsoleTabs";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function AdminUserDetailPage({ userId }: { userId: number }) {
  const { data, isLoading, error } = useStaffUserDetailQuery(userId);

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 md:px-10">
      <div>
        <h1 className="headline-sm text-on-surface">Admin console</h1>
        <p className="mt-1 body-sm text-on-surface-variant">User activity</p>
      </div>
      <AdminConsoleTabs />

      <Link
        href="/admin-console/users"
        className="body-sm text-primary hover:underline"
      >
        Back to users
      </Link>

      {isLoading ? (
        <p className="body-sm text-on-surface-variant">Loading…</p>
      ) : null}
      {error ? (
        <p className="body-sm text-error">
          {getApiErrorMessage(error, "Could not load this user.")}
        </p>
      ) : null}

      {data ? (
        <>
          <section className="rounded-xl border border-outline-variant/20 p-4">
            <h2 className="headline-sm text-on-surface">{data.user.email}</h2>
            <p className="mt-1 body-sm text-on-surface-variant">
              {[data.user.first_name, data.user.last_name].filter(Boolean).join(" ") ||
                "No name"}
              {data.user.is_staff ? " · staff" : ""}
              {data.user.email_verified ? " · verified" : " · unverified"}
            </p>
            <p className="mt-2 body-sm text-on-surface-variant">
              Joined {formatDate(data.user.date_joined)} · Last login{" "}
              {formatDate(data.user.last_login)}
            </p>
            {data.profile ? (
              <div className="mt-4 grid gap-2 body-sm text-on-surface-variant sm:grid-cols-2">
                <p>Onboarding: {data.profile.onboarding_completed ? "done" : "open"}</p>
                <p>Current role: {data.profile.current_role || "—"}</p>
                <p>
                  Target:{" "}
                  {data.profile.target_role?.name ||
                    data.profile.target_role_label ||
                    "—"}
                </p>
                <p>Goal: {data.profile.technical_goal || "—"}</p>
              </div>
            ) : null}
          </section>

          <ActivityTable
            title="Diagnostics"
            empty="No diagnostic sessions."
            headers={["Status", "Goal", "Roles", "Completed"]}
            rows={data.diagnostics.map((row) => [
              row.status,
              row.goal,
              [row.current_role, row.target_role].filter(Boolean).join(" → ") || "—",
              formatDate(row.completed_at),
            ])}
          />
          <ActivityTable
            title="Challenge attempts"
            empty="No challenge attempts."
            headers={["Challenge", "Modality", "Status", "Completed"]}
            rows={data.challenge_attempts.map((row) => [
              row.challenge_title,
              row.modality,
              row.status,
              formatDate(row.completed_at),
            ])}
          />
          <ActivityTable
            title="Learning sessions"
            empty="No learning sessions."
            headers={["Type", "Title", "When"]}
            rows={data.sessions.map((row) => [
              row.session_type,
              row.title,
              formatDate(row.created_at),
            ])}
          />
          <ActivityTable
            title="Skill gaps"
            empty="No skill gaps."
            headers={["Skill", "Status", "Updated"]}
            rows={data.gaps.map((row) => [
              row.skill_name,
              row.status,
              formatDate(row.updated_at),
            ])}
          />
        </>
      ) : null}
    </div>
  );
}

function ActivityTable({
  title,
  empty,
  headers,
  rows,
}: {
  title: string;
  empty: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <section>
      <h3 className="mb-2 body-sm font-medium text-on-surface">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low body-sm text-on-surface-variant">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-3 py-6 text-center body-sm text-on-surface-variant"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={`${title}-${i}`} className="border-t border-outline-variant/15">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 body-sm text-on-surface">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
