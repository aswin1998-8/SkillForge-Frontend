import { baseApi } from "./baseApi";
import type { Role, Skill } from "@/types/api";

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<Role[], void>({
      query: () => "/roles/",
      providesTags: ["Roles"],
    }),
    getSkills: build.query<Skill[], void>({
      query: () => "/skills/",
      providesTags: ["Skills"],
    }),
  }),
});

export const { useGetRolesQuery, useGetSkillsQuery } = rolesApi;
