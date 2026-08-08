"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAnswerDebriefMutation, useGetDebriefQuery } from "@/services/api/debriefApi";
import { getApiErrorMessage } from "@/lib/errors";

export function DebriefPanel({ sessionId }: { sessionId: number }) {
  const { data, isLoading, error, refetch, isFetching } = useGetDebriefQuery(
    sessionId,
    { pollingInterval: 4000 },
  );
  const [answer, { isLoading: answering, error: answerError }] =
    useAnswerDebriefMutation();
  const [text, setText] = useState("");

  const openQuestion = useMemo(
    () => data?.questions.find((q) => q.status === "ASKED") ?? null,
    [data?.questions],
  );

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await answer({ sessionId, body: { answer_text: text } }).unwrap();
    setText("");
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading debrief…</p>;
  }

  if (error || !data) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
        <Button variant="secondary" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Debrief</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {data.challenge_title}
          </h1>
        </div>
        <Badge variant="accent">
          {data.status}
          {isFetching ? " · syncing" : ""}
        </Badge>
      </div>

      <div className="space-y-3">
        {data.questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-xs text-muted">
                Q{q.order}
              </span>
              <Badge>{q.status}</Badge>
            </div>
            <p className="text-sm leading-relaxed">
              {q.prompt_text || "Generating question…"}
            </p>
            {q.answer ? (
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs uppercase tracking-wide text-muted mb-1">
                  Your answer
                </p>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">
                  {q.answer.answer_text}
                </p>
              </div>
            ) : null}
          </div>
        ))}
        {!data.questions.length && data.status === "PENDING" ? (
          <p className="text-sm text-muted">
            Preparing the first probe. Hang tight.
          </p>
        ) : null}
      </div>

      {openQuestion ? (
        <form onSubmit={handleAnswer} className="space-y-3 rounded-lg border border-border p-4">
          <p className="text-sm text-muted">Respond to the open question above.</p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] font-mono text-[13px]"
            placeholder="Answer…"
          />
          {answerError ? (
            <p className="text-sm text-danger">
              {getApiErrorMessage(answerError)}
            </p>
          ) : null}
          <Button type="submit" disabled={answering || !text.trim()}>
            {answering ? "Sending…" : "Submit answer"}
          </Button>
        </form>
      ) : null}

      {data.evaluation ? (
        <section className="space-y-3 rounded border border-primary/25 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Evaluation</h2>
            {data.evaluation.score != null ? (
              <Badge variant="accent">Score {data.evaluation.score}</Badge>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed">{data.evaluation.summary}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <EvalList title="Strengths" items={data.evaluation.strengths} />
            <EvalList title="Gaps" items={data.evaluation.gaps} />
            <EvalList title="Next focus" items={data.evaluation.next_focus} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EvalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-muted">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {(items ?? []).map((item) => (
          <li key={item}>{item}</li>
        ))}
        {!items?.length ? <li className="text-muted">—</li> : null}
      </ul>
    </div>
  );
}
