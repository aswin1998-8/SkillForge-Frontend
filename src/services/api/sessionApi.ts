import { baseApi } from "./baseApi";
import type { LearningSession } from "@/types/api";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSessions: build.query<LearningSession[], void>({
      query: () => "/sessions/",
      providesTags: ["Sessions"],
    }),
    getSession: build.query<LearningSession, number>({
      query: (id) => `/sessions/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Sessions", id }],
    }),
  }),
});

export const { useGetSessionsQuery, useGetSessionQuery } = sessionApi;
