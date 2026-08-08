import { Suspense } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthGate mode="auth">
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 font-[family-name:var(--font-inter)] text-on-background">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(#dae2fd 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute right-1/4 top-1/4 h-[40vw] w-[40vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-1/4 left-1/4 h-[30vw] w-[30vw] rounded-full bg-tertiary/10 blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex w-full max-w-md justify-center">
          <Suspense
            fallback={
              <p className="body-sm text-on-surface-variant">Loading…</p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </AuthGate>
  );
}
