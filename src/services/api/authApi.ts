import { baseApi } from "./baseApi";
import type {
  ForgotPasswordRequest,
  GoogleAuthRequest,
  InvitePreview,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
} from "@/types/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Profile", "Dashboard"],
    }),
    login: build.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Profile", "Dashboard"],
    }),
    logout: build.mutation<null, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User", "Profile", "Dashboard", "Sessions", "Roadmap"],
    }),
    googleAuth: build.mutation<User, GoogleAuthRequest>({
      query: (body) => ({
        url: "/auth/google/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Profile", "Dashboard"],
    }),
    verifyEmail: build.mutation<User, VerifyEmailRequest>({
      query: (body) => ({
        url: "/auth/verify-email/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    resendVerification: build.mutation<null, void>({
      query: () => ({
        url: "/auth/resend-verification/",
        method: "POST",
      }),
    }),
    forgotPassword: build.mutation<{ message?: string } | null, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password/",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation<User, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Profile", "Dashboard"],
    }),
    me: build.query<User, void>({
      query: () => "/auth/me/",
      providesTags: ["User"],
    }),
    refresh: build.mutation<null, void>({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
      }),
    }),
    previewInvite: build.query<InvitePreview, string>({
      query: (token) => `/auth/invite/?token=${encodeURIComponent(token)}`,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
  useLazyMeQuery,
  useRefreshMutation,
  usePreviewInviteQuery,
} = authApi;
