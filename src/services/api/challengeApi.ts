import { baseApi } from "./baseApi";
import type {
  Challenge,
  ChallengeAttempt,
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
  }),
});

export const {
  useGetTodayChallengeQuery,
  useGetChallengeQuery,
  useSubmitChallengeMutation,
  useSaveConfidenceMutation,
} = challengeApi;
