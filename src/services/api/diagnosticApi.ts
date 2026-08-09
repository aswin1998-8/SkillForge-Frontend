import { baseApi } from "./baseApi";
import type {
  Diagnostic,
  DiagnosticAttempt,
  DiagnosticSession,
  DiagnosticSessionGoal,
  SaveAnswersRequest,
  SubmitTurnRequest,
} from "@/types/api";

export const diagnosticApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDiagnostics: build.query<Diagnostic[], void>({
      query: () => "/diagnostics/",
      providesTags: ["Diagnostics"],
    }),
    getDiagnostic: build.query<Diagnostic, number>({
      query: (id) => `/diagnostics/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Diagnostics", id }],
    }),
    startDiagnostic: build.mutation<DiagnosticAttempt, number>({
      query: (id) => ({
        url: `/diagnostics/${id}/start/`,
        method: "POST",
      }),
      invalidatesTags: ["DiagnosticAttempt", "Sessions", "Dashboard"],
    }),
    startDiagnosticSession: build.mutation<
      DiagnosticSession,
      { goal: DiagnosticSessionGoal; domain_slugs?: string[] }
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
        body: { answers: Array<{ question_id: number; answer_text: string }> };
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
    saveAnswers: build.mutation<
      DiagnosticAttempt,
      { attemptId: number; body: SaveAnswersRequest }
    >({
      query: ({ attemptId, body }) => ({
        url: `/attempts/${attemptId}/answers/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { attemptId }) => [
        { type: "DiagnosticAttempt", id: attemptId },
      ],
    }),
    submitAttempt: build.mutation<DiagnosticAttempt, number>({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, attemptId) => [
        { type: "DiagnosticAttempt", id: attemptId },
        "Gaps",
        "Dashboard",
        "Roadmap",
        "Sessions",
      ],
    }),
    getAttempt: build.query<DiagnosticAttempt, number>({
      query: (attemptId) => `/attempts/${attemptId}/`,
      providesTags: (_r, _e, id) => [{ type: "DiagnosticAttempt", id }],
    }),
    getNextTurn: build.mutation<DiagnosticAttempt, number>({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}/next/`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, attemptId) => [
        { type: "DiagnosticAttempt", id: attemptId },
      ],
    }),
    submitTurn: build.mutation<
      DiagnosticAttempt,
      { attemptId: number; body: SubmitTurnRequest }
    >({
      query: ({ attemptId, body }) => ({
        url: `/attempts/${attemptId}/turns/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { attemptId }) => [
        { type: "DiagnosticAttempt", id: attemptId },
        "Gaps",
        "Dashboard",
        "Roadmap",
        "Sessions",
      ],
    }),
  }),
});

export const {
  useGetDiagnosticsQuery,
  useGetDiagnosticQuery,
  useStartDiagnosticMutation,
  useStartDiagnosticSessionMutation,
  useGetDiagnosticSessionQuery,
  useSubmitSessionAnswersMutation,
  useSaveAnswersMutation,
  useSubmitAttemptMutation,
  useGetAttemptQuery,
  useGetNextTurnMutation,
  useSubmitTurnMutation,
} = diagnosticApi;
