import { Suspense } from "react";
import { DiagnosticStart } from "@/features/diagnostics/DiagnosticStart";

export default function DiagnosticPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-sm text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <DiagnosticStart />
    </Suspense>
  );
}
