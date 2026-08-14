"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChallengeWorkspace,
  type WorkspaceValue,
} from "@/features/challenges/ChallengeWorkspace";
import { SubmitForm } from "@/features/challenges/SubmitForm";
import { useGetChallengeQuery } from "@/services/api/challengeApi";
import { getApiErrorMessage } from "@/lib/errors";

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String);
}

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const challengeId = Number(id);
  const router = useRouter();
  const { data: challenge, isLoading, error } = useGetChallengeQuery(challengeId);
  const [workspace, setWorkspace] = useState<WorkspaceValue>({
    text_answer: "",
    code: "// Write your solution\n",
    architecture_data: {},
    research_data: {},
    metadata: {},
  });

  if (isLoading) {
    return <p className="text-sm text-muted">Loading challenge…</p>;
  }

  if (error || !challenge) {
    return <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>;
  }

  const requirements = asStringList(challenge.requirements);
  const constraints = asStringList(challenge.constraints);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
      {challenge.is_locked ? (
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 body-sm text-on-surface">
          This challenge is locked. Complete your current roadmap challenge first.
          {challenge.today_challenge_id || challenge.current_challenge_id ? (
            <>
              {" "}
              <Link
                href={`/challenges/${challenge.current_challenge_id || challenge.today_challenge_id}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                Open current challenge
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="accent">{challenge.modality}</Badge>
            <Badge>diff {challenge.difficulty}</Badge>
            <Badge>{challenge.estimated_duration_minutes}m</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {challenge.title}
          </h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {challenge.description}
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/roadmap">Roadmap</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-xs uppercase tracking-wide text-muted">
              Scenario
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {challenge.scenario || "—"}
            </p>
          </section>
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-xs uppercase tracking-wide text-muted">
              Requirements
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {requirements.map((r) => (
                <li key={r} className="border-l border-accent/40 pl-2">
                  {r}
                </li>
              ))}
              {!requirements.length ? (
                <li className="text-muted">None specified</li>
              ) : null}
            </ul>
          </section>
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-xs uppercase tracking-wide text-muted">
              Constraints
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {constraints.map((c) => (
                <li key={c} className="border-l border-border pl-2">
                  {c}
                </li>
              ))}
              {!constraints.length ? (
                <li className="text-muted">None specified</li>
              ) : null}
            </ul>
          </section>
          <section className="rounded-lg border border-border p-4">
            <h2 className="text-xs uppercase tracking-wide text-muted">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {challenge.skills.map((s) => (
                <Badge key={s.id}>{s.skill.name}</Badge>
              ))}
            </div>
          </section>
        </aside>

        <div className="space-y-4 min-w-0">
          <ChallengeWorkspace
            challenge={challenge}
            value={workspace}
            onChange={setWorkspace}
            disabled={Boolean(challenge.is_locked)}
          />
          <SubmitForm
            challengeId={challenge.id}
            payload={workspace}
            disabled={
              Boolean(challenge.is_locked) ||
              (challenge.modality === "WAR_ROOM" &&
                !(workspace.metadata?.war_room as { complete?: boolean } | undefined)
                  ?.complete)
            }
            onSubmitted={(attempt) => {
              router.push(
                `/challenges/${challenge.id}/submit?attempt=${attempt.id}`,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
