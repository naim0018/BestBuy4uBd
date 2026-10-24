import baseApi from "./BaseApi/BaseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateAdminInfo: builder.mutation({
      query: (data) => ({
        url: "/settings/admin-info",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    addTheme: builder.mutation({
      query: (theme) => ({
        url: "/settings/theme",
        method: "POST",
        body: theme,
      }),
      invalidatesTags: ["Settings"],
    }),
    deleteTheme: builder.mutation({
      query: (themeId: string) => ({
        url: `/settings/theme/${themeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
    setSiteDefaultTheme: builder.mutation({
      query: (themeId: string) => ({
        url: "/settings/theme",
        method: "PATCH",
        body: { themeId },
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateAdminInfoMutation,
  useAddThemeMutation,
  useDeleteThemeMutation,
  useSetSiteDefaultThemeMutation,
} = settingsApi;
