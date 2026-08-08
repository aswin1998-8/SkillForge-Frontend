import { baseApi } from "./baseApi";
import type { DebriefAnswerRequest, DebriefSession } from "@/types/api";

export const debriefApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDebrief: build.query<DebriefSession, number>({
      query: (id) => `/debriefs/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Debrief", id }],
    }),
    answerDebrief: build.mutation<
      DebriefSession,
      { sessionId: number; body: DebriefAnswerRequest }
    >({
      query: ({ sessionId, body }) => ({
        url: `/debriefs/${sessionId}/answer/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { sessionId }) => [
        { type: "Debrief", id: sessionId },
        "Sessions",
        "Gaps",
        "Dashboard",
        "Roadmap",
      ],
    }),
  }),
});

export const { useGetDebriefQuery, useAnswerDebriefMutation } = debriefApi;
