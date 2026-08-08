import { baseApi } from "./baseApi";
import type { UserSkillGap } from "@/types/api";

export const gapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGaps: build.query<UserSkillGap[], void>({
      query: () => "/gaps/",
      providesTags: ["Gaps"],
    }),
  }),
});

export const { useGetGapsQuery } = gapApi;
