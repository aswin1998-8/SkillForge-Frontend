import { Suspense } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthGate mode="auth">
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-on-background">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute right-1/4 top-1/4 h-[40vw] w-[40vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
        </div>
        <div className="relative z-10 flex w-full max-w-md justify-center">
          <Suspense
            fallback={
              <p className="body-sm text-on-surface-variant">Loading…</p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </AuthGate>
  );
}
