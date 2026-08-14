"use client";

import { useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/errors";
import {
  useSendWaitlistInviteMutation,
  useStaffWaitlistQuery,
} from "@/services/api/staffApi";
import { AdminConsoleTabs } from "./AdminConsoleTabs";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function AdminWaitlistPage() {
  const [q, setQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState("");
  const { data, isLoading, isFetching, error } = useStaffWaitlistQuery({
    q: submittedQ || undefined,
  });
  const [sendInvite, { isLoading: sending }] = useSendWaitlistInviteMutation();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = data?.results ?? [];
  const total = data?.total ?? 0;

  const inviteLabel = useMemo(
    () => (status: string, hasAccount: boolean) => {
      if (hasAccount) return "Has account";
      if (status === "pending") return "Resend invite";
      if (status === "used") return "Used";
      return "Send invite";
    },
    [],
  );

  async function onInvite(id: number) {
    setActionError(null);
    setPendingId(id);
    try {
      await sendInvite(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not send invite."));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 md:px-10">
      <div>
        <h1 className="headline-sm text-on-surface">Admin console</h1>
        <p className="mt-1 body-sm text-on-surface-variant">
          Waitlist signups and invite links. Tokens are emailed, not shown here.
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
          placeholder="Search email"
          className="h-10 min-w-[16rem] flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 body-sm text-on-surface"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-4 body-sm font-medium text-on-primary"
        >
          Search
        </button>
      </form>

      {actionError ? (
        <p className="body-sm text-error">{actionError}</p>
      ) : null}
      {error ? (
        <p className="body-sm text-error">
          {getApiErrorMessage(error, "Could not load waitlist.")}
        </p>
      ) : null}

      <p className="body-sm text-on-surface-variant">
        {isLoading || isFetching ? "Loading…" : `${total} signup${total === 1 ? "" : "s"}`}
      </p>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
        <table className="w-full min-w-[56rem] text-left">
          <thead className="bg-surface-container-low body-sm text-on-surface-variant">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role / stack</th>
              <th className="px-3 py-2 font-medium">Interest</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium">Invite</th>
              <th className="px-3 py-2 font-medium">Account</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const busy = sending && pendingId === row.id;
              const disableInvite = row.has_account || row.invite_status === "used";
              return (
                <tr key={row.id} className="border-t border-outline-variant/15">
                  <td className="px-3 py-2 body-sm text-on-surface">{row.email}</td>
                  <td className="px-3 py-2 body-sm text-on-surface-variant">
                    {row.role_or_stack || "—"}
                  </td>
                  <td className="max-w-[16rem] truncate px-3 py-2 body-sm text-on-surface-variant">
                    {row.interest_note || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 body-sm text-on-surface-variant">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-3 py-2 body-sm text-on-surface-variant">
                    {row.invite_status}
                    {row.invite_expires_at && row.invite_status === "pending"
                      ? ` · until ${formatDate(row.invite_expires_at)}`
                      : ""}
                  </td>
                  <td className="px-3 py-2 body-sm text-on-surface-variant">
                    {row.has_account ? "Yes" : "No"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      disabled={disableInvite || busy}
                      onClick={() => onInvite(row.id)}
                      className="rounded-lg border border-outline-variant/40 px-3 py-1.5 body-sm text-on-surface disabled:opacity-40"
                    >
                      {busy ? "Sending…" : inviteLabel(row.invite_status, row.has_account)}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!isLoading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center body-sm text-on-surface-variant"
                >
                  No waitlist signups yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
