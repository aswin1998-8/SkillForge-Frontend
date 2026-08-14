import { Suspense } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { SignupForm } from "@/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthGate mode="auth">
      <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 font-[family-name:var(--font-inter)] text-on-background">
        <div className="relative flex w-full justify-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(173,198,255,0.08),_transparent_55%)]" />
          <div className="relative z-10 flex w-full justify-center">
            <Suspense
              fallback={
                <p className="body-sm text-on-surface-variant">Loading…</p>
              }
            >
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
