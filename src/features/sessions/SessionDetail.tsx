"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSessionQuery } from "@/services/api/sessionApi";
import { getApiErrorMessage } from "@/lib/errors";

export function SessionDetail({ sessionId }: { sessionId: number }) {
  const { data, isLoading, error } = useGetSessionQuery(sessionId);

  if (isLoading) {
    return <p className="text-sm text-muted">Loading session…</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>;
  }

  const deepLink =
    data.session_type === "DIAGNOSTIC"
      ? `/diagnostic/session/${data.reference_id}`
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Session</p>
          <h1 className="text-2xl font-semibold tracking-tight">{data.title}</h1>
        </div>
        <Badge variant="accent">{data.session_type}</Badge>
      </div>
      <dl className="grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Created</dt>
          <dd className="mt-1 font-mono">
            {new Date(data.created_at).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Reference
          </dt>
          <dd className="mt-1 font-mono">{data.reference_id}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-muted">Summary</dt>
          <dd className="mt-1 leading-relaxed">{data.summary || "—"}</dd>
        </div>
      </dl>
      <div className="flex gap-2">
        {deepLink ? (
          <Button asChild>
            <Link href={deepLink}>Open related work</Link>
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link href="/sessions">Back to list</Link>
        </Button>
      </div>
    </div>
  );
}
