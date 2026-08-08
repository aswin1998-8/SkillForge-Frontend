import { baseApi } from "./baseApi";
import type { DashboardData, RoadmapData } from "@/types/api";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardData, void>({
      query: () => "/dashboard/",
      providesTags: ["Dashboard"],
    }),
    getRoadmap: build.query<RoadmapData, void>({
      query: () => "/roadmap/",
      providesTags: ["Roadmap"],
    }),
  }),
});

export const { useGetDashboardQuery, useGetRoadmapQuery } = progressApi;
