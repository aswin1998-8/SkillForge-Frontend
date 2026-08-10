import { baseApi } from "./baseApi";
import type {
  DiagnosticSession,
  DiagnosticSessionGoal,
  FrameworkTopic,
  SessionAnswerReveal,
} from "@/types/api";

export const diagnosticApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFrameworkTopics: build.query<FrameworkTopic[], void>({
      query: () => "/framework-topics/",
      providesTags: ["Diagnostics"],
    }),
    startDiagnosticSession: build.mutation<
      DiagnosticSession,
      { goal: DiagnosticSessionGoal; framework_slugs: string[] }
    >({
      query: (body) => ({
        url: "/diagnostic-sessions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sessions", "Dashboard", "Roadmap"],
    }),
    getDiagnosticSession: build.query<DiagnosticSession, number>({
      query: (id) => `/diagnostic-sessions/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "DiagnosticAttempt", id: `s-${id}` }],
    }),
    submitSessionAnswers: build.mutation<
      DiagnosticSession,
      {
        sessionId: number;
        body: {
          answers: Array<{
            question_id: number;
            answer_text: string;
            choice_id?: number;
            confidence_rating?: number;
          }>;
        };
      }
    >({
      query: ({ sessionId, body }) => ({
        url: `/diagnostic-sessions/${sessionId}/answers/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { sessionId }) => [
        { type: "DiagnosticAttempt", id: `s-${sessionId}` },
        "Gaps",
        "Dashboard",
        "Roadmap",
        "Sessions",
      ],
    }),
    revealSessionAnswer: build.mutation<
      SessionAnswerReveal,
      { sessionId: number; answerId: number }
    >({
      query: ({ sessionId, answerId }) => ({
        url: `/diagnostic-sessions/${sessionId}/answers/${answerId}/reveal/`,
        method: "POST",
      }),
    }),
    selfRateSessionAnswer: build.mutation<
      DiagnosticSession,
      {
        sessionId: number;
        answerId: number;
        rubric_alignment: Record<string, "yes" | "no" | "partial">;
      }
    >({
      query: ({ sessionId, answerId, rubric_alignment }) => ({
        url: `/diagnostic-sessions/${sessionId}/answers/${answerId}/self-rate/`,
        method: "POST",
        body: { rubric_alignment },
      }),
      invalidatesTags: (_r, _e, { sessionId }) => [
        { type: "DiagnosticAttempt", id: `s-${sessionId}` },
        "Roadmap",
      ],
    }),
    runSessionTests: build.mutation<
      { test_results: Array<Record<string, unknown>> },
      { sessionId: number; question_id: number; code: string }
    >({
      query: ({ sessionId, question_id, code }) => ({
        url: `/diagnostic-sessions/${sessionId}/run-tests/`,
        method: "POST",
        body: { question_id, code },
      }),
    }),
  }),
});

export const {
  useGetFrameworkTopicsQuery,
  useStartDiagnosticSessionMutation,
  useGetDiagnosticSessionQuery,
  useSubmitSessionAnswersMutation,
  useRevealSessionAnswerMutation,
  useSelfRateSessionAnswerMutation,
  useRunSessionTestsMutation,
} = diagnosticApi;
