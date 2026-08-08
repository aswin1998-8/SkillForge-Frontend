"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getApiErrorMessage } from "@/lib/errors";
import { useForgotPasswordMutation } from "@/services/api/authApi";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSent(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not send reset email."));
    }
  }

  return (
    <div className="relative z-10 flex w-full max-w-[400px] flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <div className="mb-4 flex justify-center">
          <BrandLogo size={48} priority />
        </div>
        <h1 className="display-lg text-on-background !text-[36px] !leading-[44px] sm:!text-[44px] sm:!leading-[52px]">
          Reset password
        </h1>
        <p className="body-lg text-on-surface-variant">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        {sent ? (
          <div className="relative z-10 space-y-4 text-center">
            <p className="body-sm text-on-surface">
              If an account exists for that email, a reset link has been sent.
              Check your inbox (and console mail in local dev).
            </p>
            <Link
              href="/login"
              className="headline-sm inline-block text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="relative z-10 flex flex-col gap-4" onSubmit={onSubmit}>
            {formError ? (
              <p className="body-sm text-center text-error">{formError}</p>
            ) : null}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="engineer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-[family-name:var(--font-geist)] text-[18px] font-semibold leading-6 text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#3B82F6" }}
            >
              {isLoading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="/login"
          className="body-sm text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
