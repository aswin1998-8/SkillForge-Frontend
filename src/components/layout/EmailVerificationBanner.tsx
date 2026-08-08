"use client";

import { useState } from "react";
import {
  useMeQuery,
  useResendVerificationMutation,
} from "@/services/api/authApi";
import { getApiErrorMessage } from "@/lib/errors";

export function EmailVerificationBanner() {
  const { data: user } = useMeQuery();
  const [resend, { isLoading }] = useResendVerificationMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.email_verified) return null;

  async function onResend() {
    setMessage(null);
    setError(null);
    try {
      await resend().unwrap();
      setMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend verification email."));
    }
  }

  return (
    <div className="border-b border-outline-variant/30 bg-primary-container/15 px-6 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="body-sm text-on-surface">
          Verify your email to secure your account. We sent a link to{" "}
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px]">
            {user.email}
          </span>
          .
        </p>
        <button
          type="button"
          onClick={onResend}
          disabled={isLoading}
          className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-[0.02em] text-primary underline-offset-4 hover:underline disabled:opacity-60"
        >
          {isLoading ? "Sending…" : "Resend email"}
        </button>
      </div>
      {message ? <p className="body-sm mt-1 text-primary">{message}</p> : null}
      {error ? <p className="body-sm mt-1 text-error">{error}</p> : null}
    </div>
  );
}
