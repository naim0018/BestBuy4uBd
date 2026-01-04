import baseApi from "./BaseApi/BaseApi";
import { ApiResponse } from "@/types/Api/ApiResponse";

export interface IBanner {
    _id: string;
    type: string;
    title: string;
    description: string;
    productId: string;
    image: string;
    isActive: boolean;
}

export const bannerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBanners: builder.query<ApiResponse<IBanner[]>, void>({
            query: () => '/banner',
            providesTags: ['Banner']
        }),
        createBanner: builder.mutation({
            query: (data) => ({
                url: '/banner/create-banner',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Banner']
        }),
        updateBanner: builder.mutation({
            query: ({id, data}) => ({
                url: `/banner/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Banner']
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/banner/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Banner']
        })
    })
});

export const {
    useGetAllBannersQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation
} = bannerApi;
