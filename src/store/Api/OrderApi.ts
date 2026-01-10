import baseApi from "./BaseApi/BaseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/order/create-order',
        method: 'POST',
        body: orderData.body,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}/delete-order`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
    getAllOrders: builder.query({
      query: () => '/order',
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} = orderApi;