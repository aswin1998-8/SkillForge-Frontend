import { baseApi } from "./baseApi";
import type {
  Challenge,
  ChallengeAttempt,
  ChallengeDebriefPayload,
  ChallengeRunTestsResponse,
  ChallengeSubmitRequest,
  ConfidenceCreateRequest,
  ConfidenceRating,
  DailyChallenge,
} from "@/types/api";

export const challengeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodayChallenge: build.query<DailyChallenge, void>({
      query: () => "/challenges/today/",
      providesTags: ["DailyChallenge"],
    }),
    getChallenge: build.query<Challenge, number>({
      query: (id) => `/challenges/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Challenge", id }],
    }),
    submitChallenge: build.mutation<
      ChallengeAttempt,
      { challengeId: number; body: ChallengeSubmitRequest }
    >({
      query: ({ challengeId, body }) => ({
        url: `/challenges/${challengeId}/submit/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "DailyChallenge",
        "Dashboard",
        "Sessions",
        "Roadmap",
        "Gaps",
      ],
    }),
    runChallengeTests: build.mutation<
      ChallengeRunTestsResponse,
      { challengeId: number; code: string; files?: Record<string, string> }
    >({
      query: ({ challengeId, code, files }) => ({
        url: `/challenges/${challengeId}/run-tests/`,
        method: "POST",
        body: { code, ...(files ? { files } : {}) },
      }),
    }),
    getWarRoomState: build.query<
      {
        attempt_id: number | null;
        current_index: number;
        complete: boolean;
        beats: Array<Record<string, unknown>>;
        answers: Record<string, string>;
      },
      number
    >({
      query: (challengeId) => `/challenges/${challengeId}/beats/`,
    }),
    advanceWarRoomBeat: build.mutation<
      {
        attempt_id: number;
        current_index: number;
        complete: boolean;
        beats: Array<Record<string, unknown>>;
        answers: Record<string, string>;
      },
      { challengeId: number; beat_id: string; text: string }
    >({
      query: ({ challengeId, beat_id, text }) => ({
        url: `/challenges/${challengeId}/beats/`,
        method: "POST",
        body: { beat_id, text },
      }),
    }),
    saveConfidence: build.mutation<
      ConfidenceRating,
      { attemptId: number; body: ConfidenceCreateRequest }
    >({
      query: ({ attemptId, body }) => ({
        url: `/attempts/${attemptId}/confidence/`,
        method: "POST",
        body,
      }),
    }),
    getDebrief: build.query<ChallengeDebriefPayload, number>({
      query: (attemptId) => `/attempts/${attemptId}/debrief/`,
      providesTags: (_r, _e, attemptId) => [{ type: "Debrief", id: attemptId }],
    }),
    submitDebriefChecklist: build.mutation<
      ChallengeDebriefPayload,
      { attemptId: number; checklist: Record<string, boolean> }
    >({
      query: ({ attemptId, checklist }) => ({
        url: `/attempts/${attemptId}/debrief/checklist/`,
        method: "POST",
        body: { checklist },
      }),
      invalidatesTags: (_r, _e, { attemptId }) => [
        { type: "Debrief", id: attemptId },
      ],
    }),
    completeDebrief: build.mutation<
      ChallengeDebriefPayload,
      { attemptId: number; follow_up_answers: Record<string, string> }
    >({
      query: ({ attemptId, follow_up_answers }) => ({
        url: `/attempts/${attemptId}/debrief/complete/`,
        method: "POST",
        body: { follow_up_answers },
      }),
      invalidatesTags: (_r, _e, { attemptId }) => [
        { type: "Debrief", id: attemptId },
        "Sessions",
        "Roadmap",
        "Dashboard",
      ],
    }),
    trackEvent: build.mutation<
      { id: number; name: string; created_at: string },
      { name: string; properties?: Record<string, unknown> }
    >({
      query: (body) => ({
        url: "/events/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetTodayChallengeQuery,
  useGetChallengeQuery,
  useSubmitChallengeMutation,
  useRunChallengeTestsMutation,
  useGetWarRoomStateQuery,
  useAdvanceWarRoomBeatMutation,
  useSaveConfidenceMutation,
  useGetDebriefQuery,
  useSubmitDebriefChecklistMutation,
  useCompleteDebriefMutation,
  useTrackEventMutation,
} = challengeApi;
