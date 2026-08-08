"use client";

import { use } from "react";
import { DebriefPanel } from "@/features/debrief/DebriefPanel";

export default function DebriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <DebriefPanel sessionId={Number(id)} />;
}
