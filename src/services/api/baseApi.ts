import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { ApiSuccess } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function getUrl(args: string | FetchArgs): string {
  if (typeof args === "string") return args;
  return args.url ?? "";
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = getUrl(args);
    const skipRefresh =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/google");

    if (!skipRefresh) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  }

  if (result.data && typeof result.data === "object" && result.data !== null) {
    const envelope = result.data as Partial<ApiSuccess<unknown>>;
    if ("data" in envelope) {
      return { ...result, data: envelope.data };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Profile",
    "Roles",
    "Skills",
    "Diagnostics",
    "DiagnosticAttempt",
    "Gaps",
    "Challenge",
    "DailyChallenge",
    "Debrief",
    "Sessions",
    "Dashboard",
    "Roadmap",
  ],
  endpoints: () => ({}),
});
