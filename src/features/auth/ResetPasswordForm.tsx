"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/errors";
import { useResetPasswordMutation } from "@/services/api/authApi";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldError(null);

    if (!token) {
      setFormError("Missing reset token. Open the link from your email.");
      return;
    }
    if (!password || password.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setFieldError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      router.replace("/dashboard");
    } catch (err) {
      const fields = getApiFieldErrors(err);
      setFieldError(fields.password || fields.token || null);
      setFormError(getApiErrorMessage(err, "Could not reset password."));
    }
  }

  return (
    <div className="relative z-10 flex w-full max-w-[400px] flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <div className="mb-4 flex justify-center">
          <BrandLogo size={48} priority />
        </div>
        <h1 className="display-lg text-on-background !text-[36px] !leading-[44px] sm:!text-[44px] sm:!leading-[52px]">
          Choose a new password
        </h1>
        <p className="body-lg text-on-surface-variant">
          Use at least 8 characters. Avoid common passwords.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <form className="relative z-10 flex flex-col gap-4" onSubmit={onSubmit}>
          {formError ? (
            <p className="body-sm text-center text-error">{formError}</p>
          ) : null}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirm"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none"
            />
            {fieldError ? (
              <p className="body-sm text-error">{fieldError}</p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-[family-name:var(--font-geist)] text-[18px] font-semibold leading-6 text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#3B82F6" }}
          >
            {isLoading ? "Updating…" : "Update password"}
          </button>
        </form>
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
