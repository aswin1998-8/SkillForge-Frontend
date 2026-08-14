"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/errors";
import {
  usePreviewInviteQuery,
  useRegisterMutation,
} from "@/services/api/authApi";
import { GoogleSignupButton } from "./GoogleSignupButton";

type FieldErrors = Partial<
  Record<"first_name" | "last_name" | "email" | "password" | "confirm", string>
>;

function validateClient(values: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.first_name.trim()) errors.first_name = "First name is required.";
  if (!values.last_name.trim()) errors.last_name = "Last name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email.";
  }
  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!values.confirm) errors.confirm = "Confirm your password.";
  else if (values.password !== values.confirm) {
    errors.confirm = "Passwords do not match.";
  }
  return errors;
}

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = (searchParams.get("invite") || "").trim();
  const {
    data: invite,
    isLoading: inviteLoading,
    isError: inviteInvalid,
  } = usePreviewInviteQuery(inviteToken, { skip: !inviteToken });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [register, { isLoading }] = useRegisterMutation();
  const email = invite?.email ?? "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const clientErrors = validateClient({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm,
    });
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    try {
      await register({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        invite_token: inviteToken,
      }).unwrap();
      router.replace("/dashboard");
    } catch (err) {
      const apiFields = getApiFieldErrors(err);
      setFieldErrors({
        first_name: apiFields.first_name,
        last_name: apiFields.last_name,
        email: apiFields.email,
        password: apiFields.password,
      });
      setFormError(getApiErrorMessage(err, "Could not create account."));
    }
  }

  const inputClass =
    "h-11 w-full border-0 border-b border-outline-variant bg-transparent px-0 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-0";
  const labelClass =
    "font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-[0.02em] text-on-surface-variant";

  if (!inviteToken || inviteInvalid) {
    return (
      <div className="relative flex w-full max-w-sm flex-col gap-6 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="mb-2 flex justify-center">
          <BrandLogo size={48} priority />
        </div>
        <h1 className="display-lg text-center text-on-surface !text-[32px] !leading-[40px]">
          Invite only
        </h1>
        <p className="body-sm text-center text-on-surface-variant">
          This signup link is invite-only. Join the waitlist and we will send you
          a link when a spot opens.
        </p>
        <Link
          href="/"
          className="mt-2 flex h-12 items-center justify-center rounded-lg font-[family-name:var(--font-geist)] text-[18px] font-semibold text-white"
          style={{ backgroundColor: "#3B82F6" }}
        >
          Back to Honed
        </Link>
      </div>
    );
  }

  if (inviteLoading || !invite) {
    return (
      <p className="body-sm text-on-surface-variant">Checking your invite…</p>
    );
  }

  return (
    <div className="relative flex w-full max-w-sm flex-col gap-6 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-tertiary" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-tertiary/5 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-1 text-center">
        <div className="mb-4 flex justify-center">
          <BrandLogo size={48} priority />
        </div>
        <h1 className="display-lg text-on-surface !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
          Honed
        </h1>
        <p className="body-lg mt-2 text-on-surface-variant">
          Build skills. Prove your thinking.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <GoogleSignupButton inviteToken={inviteToken} />

        <div className="my-1 flex items-center gap-2">
          <div className="h-px flex-grow bg-outline-variant" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-outline">
            or
          </span>
          <div className="h-px flex-grow bg-outline-variant" />
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          {formError ? (
            <p className="body-sm text-center text-error">{formError}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="first_name" className={labelClass}>
                First name
              </label>
              <input
                id="first_name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.first_name ? (
                <p className="body-sm text-error">{fieldErrors.first_name}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="last_name" className={labelClass}>
                Last name
              </label>
              <input
                id="last_name"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.last_name ? (
                <p className="body-sm text-error">{fieldErrors.last_name}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
              <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              readOnly
              className={`${inputClass} opacity-80`}
            />
            {fieldErrors.email ? (
              <p className="body-sm text-error">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {fieldErrors.password ? (
              <p className="body-sm text-error">{fieldErrors.password}</p>
            ) : (
              <p className="body-sm text-on-surface-variant">
                Use 8+ characters. Avoid common or all-numeric passwords.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm" className={labelClass}>
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
            {fieldErrors.confirm ? (
              <p className="body-sm text-error">{fieldErrors.confirm}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-2 flex h-12 w-full items-center justify-center gap-1 overflow-hidden rounded-lg font-[family-name:var(--font-geist)] text-[18px] font-semibold leading-6 text-white transition-colors hover:opacity-90 disabled:opacity-80"
            style={{ backgroundColor: "#3B82F6" }}
          >
            <span className="relative z-10 flex items-center gap-1">
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Creating…
                </>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </form>

        <p className="body-sm mt-2 text-center text-on-surface-variant">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary underline-offset-4 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        <p className="body-sm text-center text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="headline-sm text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
