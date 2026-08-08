"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getApiErrorMessage } from "@/lib/errors";
import { useLoginMutation } from "@/services/api/authApi";
import { GoogleSignupButton } from "./GoogleSignupButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError("Email and password are required.");
      return;
    }
    try {
      await login({ email: email.trim(), password }).unwrap();
      router.replace(next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Invalid email or password."));
    }
  }

  return (
    <div className="relative z-10 flex w-full max-w-[400px] flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <div className="mb-4 flex justify-center">
          <BrandLogo size={48} priority />
        </div>
        <h1 className="display-lg text-on-background !text-[40px] !leading-[48px] sm:!text-[48px] sm:!leading-[56px]">
          Welcome back.
        </h1>
        <p className="body-lg text-on-surface-variant">
          Continue building your technical edge.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

        <div className="relative z-10">
          <GoogleSignupButton
            label="Continue with Google"
            variant="login"
          />
        </div>

        <div className="relative z-10 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-on-surface-variant">
            or
          </span>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

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

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-primary transition-colors hover:text-primary-fixed"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-[family-name:var(--font-geist)] text-[18px] font-semibold leading-6 text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: "#3B82F6" }}
          >
            {isLoading ? "Signing in…" : "Sign In"}
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="body-sm text-on-surface-variant">No account?</span>
        <Link
          href="/signup"
          className="headline-sm text-primary transition-colors hover:text-primary-fixed"
        >
          Request Access
        </Link>
      </div>
    </div>
  );
}
