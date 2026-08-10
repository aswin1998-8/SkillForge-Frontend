import { baseApi } from "./baseApi";
import type {
  QuickScoreAttempt,
  QuickScoreQuestionsPayload,
} from "@/types/api";

type RawQuickScoreQuestion = {
  id: number;
  track: string;
  competency_area: string;
  prompt_text?: string;
  question_text?: string;
  weight: number;
  order: number;
  choices: Array<{ id: number; choice_text: string }>;
};

type RawQuickScoreAttempt = {
  id: number;
  track: string;
  total_score: number;
  band: string;
  band_label: string;
  paragraph?: string;
  paragraph_text?: string;
  paragraph_key?: string;
  created_at: string;
};

function normalizeQuestion(q: RawQuickScoreQuestion) {
  return {
    id: q.id,
    track: q.track,
    competency_area: q.competency_area,
    prompt_text: q.prompt_text ?? q.question_text ?? "",
    weight: q.weight,
    order: q.order,
    choices: q.choices ?? [],
  };
}

function normalizeAttempt(a: RawQuickScoreAttempt): QuickScoreAttempt {
  return {
    id: a.id,
    track: a.track,
    total_score: a.total_score,
    band: a.band,
    band_label: a.band_label,
    paragraph: a.paragraph ?? a.paragraph_text ?? "",
    paragraph_key: a.paragraph_key ?? a.band ?? "",
    created_at: a.created_at,
  };
}

export const quickScoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuickScoreQuestions: build.query<
      QuickScoreQuestionsPayload,
      string | void
    >({
      query: (track) =>
        track
          ? `/quick-score/questions/?track=${encodeURIComponent(track)}`
          : "/quick-score/questions/",
      transformResponse: (raw: {
        track: string;
        questions: RawQuickScoreQuestion[];
      }): QuickScoreQuestionsPayload => ({
        track: raw.track,
        questions: (raw.questions ?? []).map(normalizeQuestion),
      }),
    }),
    submitQuickScore: build.mutation<
      QuickScoreAttempt,
      {
        track?: string;
        answers: Array<{ question_id: number; choice_id: number }>;
      }
    >({
      query: (body) => ({
        url: "/quick-score/",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawQuickScoreAttempt) => normalizeAttempt(raw),
    }),
    getQuickScoreAttempt: build.query<QuickScoreAttempt, number>({
      query: (id) => `/quick-score/${id}/`,
      transformResponse: (raw: RawQuickScoreAttempt) => normalizeAttempt(raw),
    }),
  }),
});

export const {
  useGetQuickScoreQuestionsQuery,
  useSubmitQuickScoreMutation,
  useGetQuickScoreAttemptQuery,
} = quickScoreApi;
