import baseApi from "./BaseApi/BaseApi";
import { ApiResponse } from "@/types/Api/ApiResponse";

export interface IGoogleAnalytics {
    _id: string;
    googleAnalyticsId: string;
}

export interface IFacebookPixel {
    _id: string;
    pixelId: string;
    accessToken?: string;
}

export const trackingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Google Analytics
        getGoogleAnalytics: builder.query<ApiResponse<IGoogleAnalytics>, void>({
            query: () => '/google-analytics',
            providesTags: ['GoogleAnalytics']
        }),
        createGoogleAnalytics: builder.mutation<ApiResponse<IGoogleAnalytics>, { id: string }>({
            query: (data) => ({
                url: '/google-analytics',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['GoogleAnalytics']
        }),
        updateGoogleAnalytics: builder.mutation<ApiResponse<IGoogleAnalytics>, { id: string }>({
            query: (data) => ({
                url: '/google-analytics',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['GoogleAnalytics']
        }),
        deleteGoogleAnalytics: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/google-analytics',
                method: 'DELETE'
            }),
            invalidatesTags: ['GoogleAnalytics']
        }),

        // Facebook Pixel
        getFacebookPixel: builder.query<ApiResponse<IFacebookPixel>, void>({
            query: () => '/facebook-pixel',
            providesTags: ['FacebookPixel']
        }),
        createFacebookPixel: builder.mutation<ApiResponse<IFacebookPixel>, { pixelId: string; accessToken?: string }>({
            query: (data) => ({
                url: '/facebook-pixel',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['FacebookPixel']
        }),
        updateFacebookPixel: builder.mutation<ApiResponse<IFacebookPixel>, { pixelId: string; accessToken?: string }>({
            query: (data) => ({
                url: '/facebook-pixel',
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['FacebookPixel']
        }),
        deleteFacebookPixel: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/facebook-pixel',
                method: 'DELETE'
            }),
            invalidatesTags: ['FacebookPixel']
        })
    })
});

export const {
    useGetGoogleAnalyticsQuery,
    useCreateGoogleAnalyticsMutation,
    useUpdateGoogleAnalyticsMutation,
    useDeleteGoogleAnalyticsMutation,
    useGetFacebookPixelQuery,
    useCreateFacebookPixelMutation,
    useUpdateFacebookPixelMutation,
    useDeleteFacebookPixelMutation
} = trackingApi;
