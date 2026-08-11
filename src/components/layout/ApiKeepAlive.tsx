"use client";

import { useEffect } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

/**
 * Pings the API while the tab is visible so a free-tier Render dyno is less
 * likely to sleep mid-session. Does not prevent cold starts after long idle.
 */
export function ApiKeepAlive({ intervalMs = 4 * 60 * 1000 }: { intervalMs?: number }) {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    async function ping() {
      if (document.visibilityState !== "visible") return;
      try {
        await fetch(`${API_BASE}/health/`, {
          method: "GET",
          credentials: "omit",
          cache: "no-store",
        });
      } catch {
        // Ignore — cold start / offline
      }
    }

    function start() {
      void ping();
      if (timer) clearInterval(timer);
      timer = setInterval(() => void ping(), intervalMs);
    }

    function onVisibility() {
      if (document.visibilityState === "visible") start();
      else if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]);

  return null;
}
