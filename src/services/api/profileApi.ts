import { baseApi } from "./baseApi";
import type { Profile, ProfileUpdate } from "@/types/api";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile, void>({
      query: () => "/profile/",
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation<Profile, ProfileUpdate>({
      query: (body) => ({
        url: "/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "User", "Dashboard", "Roadmap"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
