import { baseApi } from "./baseApi";
import type {
  Diagnostic,
  DiagnosticAttempt,
  SaveAnswersRequest,
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
  }),
});

export const {
  useGetDiagnosticsQuery,
  useGetDiagnosticQuery,
  useStartDiagnosticMutation,
  useSaveAnswersMutation,
  useSubmitAttemptMutation,
  useGetAttemptQuery,
} = diagnosticApi;
