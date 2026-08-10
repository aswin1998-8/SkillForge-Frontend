import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    resetProgress: build.mutation<{ ok: boolean; deleted?: Record<string, number> }, { confirm: string }>({
      query: (body) => ({
        url: "/admin/reset-progress/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "User",
        "Profile",
        "Dashboard",
        "Gaps",
        "Roadmap",
        "Sessions",
        "DailyChallenge",
        "Challenge",
        "Diagnostics",
        "Debrief",
      ],
    }),
  }),
});

export const { useResetProgressMutation } = adminApi;
