"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getApiErrorMessage } from "@/lib/errors";
import { useVerifyEmailMutation } from "@/services/api/authApi";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [verifyEmail] = useVerifyEmailMutation();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!token) {
      setError("Missing verification token.");
      setStatus("done");
      return;
    }

    setStatus("working");
    verifyEmail({ token })
      .unwrap()
      .then(() => {
        setStatus("done");
        router.replace("/dashboard");
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, "Verification failed."));
        setStatus("done");
      });
  }, [token, verifyEmail, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-on-background">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <BrandLogo size={48} priority />
        <h1 className="headline-sm text-on-surface">Verify email</h1>
        {status === "working" || status === "idle" ? (
          <p className="body-sm text-on-surface-variant">
            Confirming your email…
          </p>
        ) : null}
        {error ? (
          <div className="space-y-3">
            <p className="body-sm text-error">{error}</p>
            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              className="body-sm text-primary underline-offset-4 hover:underline"
            >
              Continue to dashboard
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted">
          Loading…
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
