import { baseApi } from "./baseApi";

export type WaitlistJoinRequest = {
  email: string;
  role_or_stack?: string;
  interest_note?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export const waitlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    joinWaitlist: build.mutation<{ email: string }, WaitlistJoinRequest>({
      query: (body) => ({
        url: "/waitlist/join/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useJoinWaitlistMutation } = waitlistApi;
