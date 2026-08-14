"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/errors";
import { useJoinWaitlistMutation } from "@/services/api/waitlistApi";

const ROLE_OPTIONS = [
  "React/Next.js",
  "Django/FastAPI",
  "Both",
  "Other",
] as const;

type WaitlistModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const searchParams = useSearchParams();
  const [join, { isLoading, reset }] = useJoinWaitlistMutation();
  const [email, setEmail] = useState("");
  const [roleOrStack, setRoleOrStack] = useState("");
  const [interestNote, setInterestNote] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
    {},
  );

  useEffect(() => {
    setUtmSource(searchParams.get("utm_source") || "");
    setUtmMedium(searchParams.get("utm_medium") || "");
    setUtmCampaign(searchParams.get("utm_campaign") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setFormError("");
    setFieldErrors({});
    reset();
  }, [open, reset]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    if (!email.trim()) {
      setFieldErrors({ email: "Email is required." });
      return;
    }
    try {
      await join({
        email: email.trim(),
        role_or_stack: roleOrStack,
        interest_note: interestNote,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }).unwrap();
      setSuccess(true);
    } catch (err) {
      const fields = getApiFieldErrors(err);
      setFieldErrors(fields);
      setFormError(getApiErrorMessage(err, "Could not join the waitlist."));
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest text-primary">
              Beta access
            </p>
            <h2 id="waitlist-title" className="headline-sm mt-1 text-on-surface">
              Join the Honed waitlist
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-on-surface-variant hover:text-on-surface"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {success ? (
          <p className="body-md text-on-surface">
            You&apos;re on the list — we&apos;ll be in touch.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
            <div className="space-y-1.5">
              <Label htmlFor="waitlist-email">Email</Label>
              <Input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
              {fieldErrors.email ? (
                <p className="body-sm text-error">{fieldErrors.email}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="waitlist-stack">Role / stack</Label>
              <select
                id="waitlist-stack"
                value={roleOrStack}
                onChange={(e) => setRoleOrStack(e.target.value)}
                className="h-10 w-full rounded-md border border-outline-variant bg-transparent px-3 text-sm text-on-surface"
              >
                <option value="">Select one</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="waitlist-note">
                What does AI-skill-atrophy look like for you right now?
              </Label>
              <Textarea
                id="waitlist-note"
                className="min-h-[120px]"
                value={interestNote}
                onChange={(e) => setInterestNote(e.target.value)}
                placeholder="Rubber-stamping Copilot PRs, skipping tests, avoiding on-call…"
              />
            </div>
            {formError && !fieldErrors.email ? (
              <p className="body-sm text-error">{formError}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Joining…" : "Join waitlist"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
