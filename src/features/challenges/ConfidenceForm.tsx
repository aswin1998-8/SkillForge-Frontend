"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSaveConfidenceMutation } from "@/services/api/challengeApi";
import { getApiErrorMessage } from "@/lib/errors";

type ConfidenceFormProps = {
  attemptId: number;
  onSaved?: () => void;
};

export function ConfidenceForm({ attemptId, onSaved }: ConfidenceFormProps) {
  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");
  const [save, { isLoading, error, isSuccess }] = useSaveConfidenceMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save({ attemptId, body: { score, note } }).unwrap();
    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border p-4"
    >
      <div>
        <h2 className="font-semibold">Confidence check</h2>
        <p className="text-sm text-muted">
          How solid did that attempt feel?
        </p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            className={cn(
              "h-10 w-10 rounded-md border font-mono text-sm transition-colors",
              score === n
                ? "border-primary-action bg-primary-action/15 text-primary-action"
                : "border-border-subtle text-on-surface-variant hover:border-primary/40",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      {error ? (
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-accent">Confidence saved.</p>
      ) : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving…" : "Save confidence"}
      </Button>
    </form>
  );
}
