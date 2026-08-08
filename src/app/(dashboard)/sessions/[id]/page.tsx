"use client";

import { use } from "react";
import { SessionDetail } from "@/features/sessions/SessionDetail";

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SessionDetail sessionId={Number(id)} />;
}
