import { baseApi } from "./baseApi";
import type {
  Paginated,
  StaffUserDetail,
  StaffUserRow,
  StaffWaitlistRow,
} from "@/types/api";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    staffWaitlist: build.query<
      Paginated<StaffWaitlistRow>,
      { page?: number; q?: string } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page) params.set("page", String(args.page));
        if (args?.q) params.set("q", args.q);
        const qs = params.toString();
        return `/staff/waitlist/${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["StaffWaitlist"],
    }),
    sendWaitlistInvite: build.mutation<
      {
        id: number;
        email: string;
        invited: boolean;
        invited_at: string | null;
        invite_status: string;
        invite_expires_at: string;
      },
      number
    >({
      query: (id) => ({
        url: `/staff/waitlist/${id}/invite/`,
        method: "POST",
      }),
      invalidatesTags: ["StaffWaitlist"],
    }),
    staffUsers: build.query<
      Paginated<StaffUserRow>,
      { page?: number; q?: string } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page) params.set("page", String(args.page));
        if (args?.q) params.set("q", args.q);
        const qs = params.toString();
        return `/staff/users/${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["StaffUsers"],
    }),
    staffUserDetail: build.query<StaffUserDetail, number>({
      query: (id) => `/staff/users/${id}/`,
      providesTags: ["StaffUsers"],
    }),
  }),
});

export const {
  useStaffWaitlistQuery,
  useSendWaitlistInviteMutation,
  useStaffUsersQuery,
  useStaffUserDetailQuery,
} = staffApi;
