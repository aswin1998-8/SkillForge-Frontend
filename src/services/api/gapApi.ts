import { baseApi } from "./baseApi";
import type { SkillGapAnalysisData, UserSkillGap } from "@/types/api";

export const gapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGaps: build.query<UserSkillGap[], void>({
      query: () => "/gaps/",
      providesTags: ["Gaps"],
    }),
    getGapAnalysis: build.query<SkillGapAnalysisData, void>({
      query: () => "/gaps/analysis/",
      providesTags: ["Gaps"],
    }),
  }),
});

export const { useGetGapsQuery, useGetGapAnalysisQuery } = gapApi;
