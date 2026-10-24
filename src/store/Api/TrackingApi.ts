import baseApi from "./BaseApi/BaseApi";

export const TrackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackingSettings: builder.query({
      query: () => ({
        url: "/tracking",
        method: "GET",
      }),
      providesTags: ["Tracking"],
    }),
    updateTrackingSettings: builder.mutation({
      query: (data) => ({
        url: "/tracking/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tracking"],
    }),
    getAnalyticsDashboard: builder.query({
      query: () => ({
        url: "/analytics/dashboard",
        method: "GET",
      }),
    }),
    getInteractionEvents: builder.query({
      query: (params?: { page?: number; limit?: number; search?: string; category?: string }) => ({
        url: "/analytics/store-activity",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Tracking"],
    }),
    clearInteractionEvents: builder.mutation({
      query: () => ({
        url: "/analytics/store-activity",
        method: "DELETE",
      }),
      invalidatesTags: ["Tracking"],
    }),
  }),
});

export const {
  useGetTrackingSettingsQuery,
  useUpdateTrackingSettingsMutation,
  useGetAnalyticsDashboardQuery,
  useGetInteractionEventsQuery,
  useClearInteractionEventsMutation,
} = TrackingApi;
