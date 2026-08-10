"use client";

export function ProcessingState() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-5%] top-[-10%] h-1/2 w-1/2 rounded-full bg-primary opacity-30 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] h-1/2 w-1/2 rounded-full bg-secondary opacity-20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-widest text-primary">
          Preparing assessment
        </p>
        <h2 className="mt-3 headline-md text-on-surface">
          Processing your diagnostic
        </h2>
        <p className="mt-3 body-sm text-on-surface-variant">
          Calibrating questions to your experience level and selecting a unique
          path from your skill map. This usually takes a moment.
        </p>
      </div>
    </div>
  );
}
