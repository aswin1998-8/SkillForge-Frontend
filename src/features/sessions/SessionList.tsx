"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGetSessionsQuery } from "@/services/api/sessionApi";
import type { LearningSession } from "@/types/api";
import { cn } from "@/lib/utils";

type HistoryEntry = {
  id: string;
  href: string;
  dateLabel: string;
  isToday: boolean;
  title: string;
  focus: string;
  score: string | null;
};

const DEMO_ENTRIES: HistoryEntry[] = [
  {
    id: "demo-1",
    href: "/diagnostic/demo",
    dateLabel: "TODAY",
    isToday: true,
    title: "Diagnose — RAG Retrieval Failure",
    focus: "Focus: Retrieval evaluation",
    score: "78%",
  },
  {
    id: "demo-2",
    href: "/sessions",
    dateLabel: "AUG 7",
    isToday: false,
    title: "Architect — Agent vs Pipeline",
    focus: "Focus: Failure handling",
    score: "82%",
  },
  {
    id: "demo-3",
    href: "/sessions",
    dateLabel: "AUG 6",
    isToday: false,
    title: "Theory — Vector Search",
    focus: "Focus: Embedding limitations",
    score: "74%",
  },
];

const VISUAL_CARD_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA8dRGHCSPqhDgpdE3Karozg47-PgDyHQqgNy-8GtjuzO5YU4esMY2aL46z-qIfIaVgew5RKWdjIW2tmFu132QWcuKpb8yMUiiFds2lj1LDUyts9c6zg_9Bt2nqPNS0xkNbNJRzQJ77GniIjMd4i0AQjhVA2cbPYBbUvu_yuI10X1YcbHmdIlINW-P4rXN-Y93_8zjsc_12p7GVLbAKVLXN5ETbW_bWNTPkelsIHqNt8HhwYpqAmCVt";

function sessionHref(session: LearningSession) {
  if (session.session_type === "DIAGNOSTIC") {
    return `/diagnostic/session/${session.reference_id}`;
  }
  return `/sessions/${session.id}`;
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return { label: "TODAY", isToday: true };
  }
  return {
    label: date
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase()
      .replace(" ", " "),
    isToday: false,
  };
}

function focusFromSession(session: LearningSession) {
  const summary = session.summary?.trim();
  if (summary) {
    return summary.startsWith("Focus:") ? summary : `Focus: ${summary}`;
  }
  return `Focus: ${session.session_type.replaceAll("_", " ").toLowerCase()}`;
}

function toEntry(session: LearningSession): HistoryEntry {
  const { label, isToday } = formatDateLabel(session.created_at);
  return {
    id: String(session.id),
    href: sessionHref(session),
    dateLabel: label,
    isToday,
    title: session.title,
    focus: focusFromSession(session),
    score: null,
  };
}

export function SessionList() {
  const { data, isLoading } = useGetSessionsQuery();

  const entries = useMemo(() => {
    if (data?.length) return data.map(toEntry);
    return DEMO_ENTRIES;
  }, [data]);

  const avgScore = useMemo(() => {
    const scored = entries.filter((e) => e.score);
    if (!scored.length) return "—";
    const sum = scored.reduce(
      (acc, e) => acc + Number.parseFloat(e.score ?? "0"),
      0,
    );
    return `${(sum / scored.length).toFixed(1)}%`;
  }, [entries]);

  const lastSync = useMemo(() => {
    const now = new Date();
    return `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-primary/5 via-primary/5 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-10 p-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <div className="mb-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-widest text-primary">
                Log Archive
              </span>
            </div>
            <h1 className="headline-md text-on-background">Session History</h1>
          </div>

          {isLoading ? (
            <p className="body-sm text-on-surface-variant">Loading sessions…</p>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={entry.href}
                  className="group relative flex w-full flex-col gap-4 overflow-hidden rounded-lg bg-surface-container p-4 text-left shadow-sm transition-all hover:bg-surface-container-high hover:shadow-md md:flex-row md:items-center"
                >
                  <div className="absolute inset-y-0 left-0 w-1 origin-left scale-x-0 transform bg-primary transition-transform group-hover:scale-x-100" />
                  <div className="flex shrink-0 items-center gap-4 md:w-32">
                    <div
                      className={cn(
                        "rounded px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5",
                        entry.isToday
                          ? "bg-primary/10 text-primary"
                          : "bg-surface text-on-surface-variant transition-colors group-hover:text-on-surface",
                      )}
                    >
                      {entry.dateLabel}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="truncate headline-sm text-on-surface transition-colors group-hover:text-primary">
                      {entry.title}
                    </h2>
                    <div className="mt-1 truncate body-sm text-on-surface-variant">
                      {entry.focus}
                    </div>
                  </div>
                  <div className="mt-4 flex shrink-0 items-center gap-4 md:mt-0">
                    <div className="flex flex-col items-end rounded bg-surface px-2 py-1 md:items-start">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                        SCORE
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-primary">
                        {entry.score ?? "—"}
                      </span>
                    </div>
                    <span className="material-symbols-outlined translate-x-0 text-on-surface-variant transition-all group-hover:translate-x-1 group-hover:text-primary">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
          <div className="group relative h-48 w-full overflow-hidden rounded-xl bg-surface-container shadow-md lg:h-64">
            <div
              className="h-full w-full bg-cover bg-center opacity-60 mix-blend-luminosity transition-opacity duration-700 group-hover:opacity-80"
              style={{ backgroundImage: `url('${VISUAL_CARD_BG}')` }}
              role="img"
              aria-label="Abstract data stream visualization"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                  SYS_INTEGRITY
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface">
                  NOMINAL
                </span>
              </div>
              <span className="material-symbols-outlined text-[24px] text-primary">
                analytics
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl bg-surface-container p-4 shadow-sm">
            <div className="flex items-center justify-between rounded bg-surface-container-high/50 p-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                AVG_SCORE_30D
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-primary">
                {avgScore}
              </span>
            </div>
            <div className="flex items-center justify-between rounded bg-surface-container-high/50 p-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                TOTAL_SESSIONS
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface">
                {String(entries.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between rounded bg-surface-container-high/50 p-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                LAST_SYNC
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-5 text-on-surface-variant">
                {lastSync}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
