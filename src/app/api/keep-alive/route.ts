import { NextResponse } from "next/server";

/**
 * External uptime monitors (UptimeRobot, cron-job.org, etc.) can hit this
 * route every ~5 minutes to reduce Render free-tier cold starts:
 *   GET https://your-app.vercel.app/api/keep-alive
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";
  const healthUrl = `${apiBase.replace(/\/$/, "")}/health/`;

  const started = Date.now();
  try {
    const res = await fetch(healthUrl, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    const body = await res.text();
    return NextResponse.json(
      {
        ok: res.ok,
        upstream_status: res.status,
        ms: Date.now() - started,
        upstream: healthUrl,
        snippet: body.slice(0, 200),
      },
      { status: res.ok ? 200 : 502 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - started,
        upstream: healthUrl,
        error: err instanceof Error ? err.message : "upstream unreachable",
      },
      { status: 502 },
    );
  }
}
