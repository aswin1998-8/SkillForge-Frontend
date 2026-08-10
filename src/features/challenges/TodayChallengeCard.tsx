"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetTodayChallengeQuery,
  useTrackEventMutation,
} from "@/services/api/challengeApi";
import { useGetSessionsQuery } from "@/services/api/sessionApi";
import { getApiErrorMessage } from "@/lib/errors";

export function TodayChallengeCard() {
  const { data, isLoading, error } = useGetTodayChallengeQuery();
  const { data: sessions } = useGetSessionsQuery();
  const [trackEvent] = useTrackEventMutation();
  const trackedReturn = useRef(false);

  useEffect(() => {
    if (trackedReturn.current || !data || !sessions?.length) return;
    const prior = sessions.some((s) => {
      const d = new Date(s.created_at);
      const today = new Date(data.date + "T12:00:00");
      return d.toDateString() !== today.toDateString();
    });
    if (!prior) return;
    trackedReturn.current = true;
    void trackEvent({
      name: "day2_return",
      properties: { challenge_id: data.challenge.id, date: data.date },
    });
  }, [data, sessions, trackEvent]);

  if (isLoading) {
    return <p className="text-sm text-muted">Loading current challenge…</p>;
  }

  if (error) {
    return <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-muted">No challenge assigned yet.</p>
    );
  }

  const c = data.challenge;

  return (
    <div className="overflow-hidden rounded border border-border-subtle bg-surface-container">
      <div className="border-b border-border-subtle bg-surface-container-lowest px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">Current</Badge>
          <Badge>{data.status}</Badge>
          <Badge>{c.modality}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
          {c.description || c.scenario}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span>Difficulty {c.difficulty}</span>
          <span>{c.estimated_duration_minutes} min</span>
          <span>{c.skills.map((s) => s.skill.name).join(" · ")}</span>
        </div>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href={`/challenges/${c.id}`}>Open workspace</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/roadmap">Roadmap</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
