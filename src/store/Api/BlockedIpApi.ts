import baseApi from "./BaseApi/BaseApi";

export interface BlockedIpItem {
  _id: string;
  ip: string;
  reason?: string;
  scope: "all" | "checkout";
  blockedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export const BlockedIpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlockedIps: builder.query<{ data: BlockedIpItem[]; meta: any }, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/blocked-ips",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["BlockedIps"],
    }),
    blockIp: builder.mutation<any, { ip: string; reason?: string; scope?: "all" | "checkout" }>({
      query: (body) => ({
        url: "/blocked-ips",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BlockedIps"],
    }),
    unblockIp: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blocked-ips/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlockedIps"],
    }),
  }),
});

export const {
  useGetBlockedIpsQuery,
  useBlockIpMutation,
  useUnblockIpMutation,
} = BlockedIpApi;
