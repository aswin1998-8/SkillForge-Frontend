"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/errors";
import {
  useCompleteDebriefMutation,
  useGetDebriefQuery,
  useSubmitDebriefChecklistMutation,
  useTrackEventMutation,
} from "@/services/api/challengeApi";
import { cn } from "@/lib/utils";

type DebriefFlowProps = {
  attemptId: number;
  challengeId: number;
};

type Phase = "checklist" | "followups" | "done";

export function DebriefFlow({ attemptId, challengeId }: DebriefFlowProps) {
  const { data, isLoading, error, refetch } = useGetDebriefQuery(attemptId);
  const [submitChecklist, { isLoading: savingChecklist }] =
    useSubmitDebriefChecklistMutation();
  const [completeDebrief, { isLoading: completing }] =
    useCompleteDebriefMutation();
  const [trackEvent] = useTrackEventMutation();

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("checklist");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const next: Record<string, boolean> = {};
    for (const item of data.rubric_items) {
      next[String(item.id)] = Boolean(data.checklist?.[String(item.id)]);
    }
    setChecklist(next);
    setAnswers(
      Object.fromEntries(
        Object.entries(data.follow_up_answers || {}).map(([k, v]) => [
          k,
          String(v),
        ]),
      ),
    );

    const status = (data.status || "").toUpperCase();
    if (status === "COMPLETED") setPhase("done");
    else if (
      status === "AWAITING_FOLLOWUPS" ||
      (data.selected_follow_ups?.length ?? 0) > 0
    )
      setPhase("followups");
    else setPhase("checklist");
  }, [data]);

  const sortedRubric = useMemo(
    () =>
      [...(data?.rubric_items ?? [])].sort((a, b) => a.order - b.order),
    [data?.rubric_items],
  );

  async function handleChecklistSubmit() {
    setActionError(null);
    try {
      const payload = await submitChecklist({
        attemptId,
        checklist,
      }).unwrap();
      if ((payload.selected_follow_ups?.length ?? 0) > 0) {
        setPhase("followups");
      } else {
        const completed = await completeDebrief({
          attemptId,
          follow_up_answers: {},
        }).unwrap();
        setPhase("done");
        void trackEvent({
          name: "debrief_completed",
          properties: {
            attempt_id: attemptId,
            checklist_score: completed.checklist_score,
          },
        });
      }
      void refetch();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not save checklist."));
    }
  }

  async function handleComplete() {
    setActionError(null);
    try {
      const completed = await completeDebrief({
        attemptId,
        follow_up_answers: answers,
      }).unwrap();
      setPhase("done");
      void trackEvent({
        name: "debrief_completed",
        properties: {
          attempt_id: attemptId,
          checklist_score: completed.checklist_score,
        },
      });
      void refetch();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not complete debrief."));
    }
  }

  if (isLoading) {
    return <p className="body-sm text-on-surface-variant">Loading debrief…</p>;
  }

  if (error || !data) {
    return (
      <p className="body-sm text-danger">
        {getApiErrorMessage(error, "Debrief unavailable.")}
      </p>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-widest text-primary">
            Debrief complete
          </p>
          <h1 className="mt-2 headline-md text-on-surface">Self-assessment</h1>
          {data.checklist_score != null ? (
            <p className="mt-2 body-sm text-on-surface-variant">
              Checklist score:{" "}
              <span className="text-primary">
                {Math.round(data.checklist_score * 100)}%
              </span>
            </p>
          ) : null}
        </div>

        <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
          <h2 className="headline-sm text-on-surface">Strengths</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 body-sm text-on-surface-variant">
            {(data.strengths || []).map((s) => (
              <li key={s}>{s}</li>
            ))}
            {!data.strengths?.length ? <li>None listed</li> : null}
          </ul>
        </section>

        <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
          <h2 className="headline-sm text-on-surface">Gaps</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 body-sm text-on-surface-variant">
            {(data.gaps || []).map((g) => (
              <li key={g}>{g}</li>
            ))}
            {!data.gaps?.length ? <li>None listed</li> : null}
          </ul>
        </section>

        <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
          <h2 className="headline-sm text-on-surface">Next focus</h2>
          <p className="mt-2 body-sm text-on-surface-variant">
            {data.next_focus || "Complete the debrief loop, then unlock the next roadmap challenge."}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/roadmap"
            className="rounded-xl bg-primary px-6 py-3 headline-sm text-on-primary"
          >
            Back to roadmap
          </Link>
          <Link
            href="/challenges/today"
            className="rounded-xl border border-outline-variant/40 px-6 py-3 body-sm text-on-surface"
          >
            Current challenge
          </Link>
          <Link
            href="/how-this-works"
            className="rounded-xl border border-outline-variant/40 px-6 py-3 body-sm text-primary"
          >
            How this works
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-widest text-primary">
          Challenge debrief
        </p>
        <h1 className="mt-2 headline-md text-on-surface">
          {phase === "checklist" ? "Model answer + checklist" : "Follow-ups"}
        </h1>
        <p className="mt-2 body-sm text-on-surface-variant">
          Self-rate against the reference answer. Scoring is rule-based — see{" "}
          <Link href="/how-this-works" className="text-primary hover:underline">
            how this works
          </Link>
          .
        </p>
      </div>

      {phase === "checklist" ? (
        <>
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
            <h2 className="headline-sm text-on-surface">Reference answer</h2>
            <p className="mt-3 whitespace-pre-wrap body-sm text-on-surface-variant">
              {data.reference_text || "No model answer available."}
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
            <h2 className="headline-sm text-on-surface">Rubric checklist</h2>
            <ul className="mt-4 space-y-3">
              {sortedRubric.map((item) => {
                const key = String(item.id);
                const checked = Boolean(checklist[key]);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setChecklist((prev) => ({ ...prev, [key]: !checked }))
                      }
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                        checked
                          ? "border-primary bg-primary/10"
                          : "border-outline-variant/40 bg-surface",
                      )}
                    >
                      <span className="material-symbols-outlined text-[20px] text-primary">
                        {checked ? "check_box" : "check_box_outline_blank"}
                      </span>
                      <span className="body-sm text-on-surface">{item.text}</span>
                    </button>
                  </li>
                );
              })}
              {!sortedRubric.length ? (
                <li className="body-sm text-on-surface-variant">
                  No rubric items for this challenge.
                </li>
              ) : null}
            </ul>
          </section>

          {actionError ? (
            <p className="body-sm text-danger">{actionError}</p>
          ) : null}

          <Button
            onClick={() => void handleChecklistSubmit()}
            disabled={savingChecklist || completing}
          >
            {savingChecklist || completing
              ? "Saving…"
              : "Submit checklist"}
          </Button>
        </>
      ) : (
        <>
          <section className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container p-5">
            <h2 className="headline-sm text-on-surface">Follow-up questions</h2>
            {(data.selected_follow_ups || []).map((fu) => (
              <div key={fu.id} className="space-y-2">
                <Label htmlFor={`fu-${fu.id}`}>{fu.question_text}</Label>
                <Textarea
                  id={`fu-${fu.id}`}
                  className="min-h-[100px]"
                  value={answers[String(fu.id)] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [String(fu.id)]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            {!data.selected_follow_ups?.length ? (
              <p className="body-sm text-on-surface-variant">
                No follow-ups required — finish to see your summary.
              </p>
            ) : null}
          </section>

          {actionError ? (
            <p className="body-sm text-danger">{actionError}</p>
          ) : null}

          <Button
            onClick={() => void handleComplete()}
            disabled={completing}
          >
            {completing ? "Completing…" : "Complete debrief"}
          </Button>
        </>
      )}
    </div>
  );
}
