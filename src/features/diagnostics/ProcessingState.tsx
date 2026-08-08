"use client";

export function ProcessingState() {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-8 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full border-2 border-primary/40 border-t-primary" />
      <h2 className="text-lg font-semibold">Processing your diagnostic</h2>
      <p className="mt-2 text-sm text-muted">
        Extracting skill evidence and updating your gap map. This usually takes a
        moment.
      </p>
    </div>
  );
}
