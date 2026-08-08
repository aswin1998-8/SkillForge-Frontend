"use client";

import { useSearchParams } from "next/navigation";
import { DiagnosticIntro } from "@/features/diagnostics/DiagnosticIntro";

export function DiagnosticStart() {
  const searchParams = useSearchParams();
  const target = searchParams.get("target") ?? undefined;
  return <DiagnosticIntro targetProfile={target} />;
}
