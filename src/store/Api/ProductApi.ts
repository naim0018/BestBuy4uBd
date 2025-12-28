// Helper function to build query string
import { Product } from "@/types/Product/Product";
import baseApi from "./BaseApi/BaseApi";
import { ApiResponse, QueryOptions } from "@/types/Api/ApiResponse";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ApiResponse<Product[]>, void | QueryOptions>({
      query: (options = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(options as QueryOptions).forEach(
          ([key, value]: [string, string]) => {
            if (value !== "" && value !== "undefined" && value !== null) {
              queryParams.append(key, value);
            }
          }
        );
        return {
          url: `/product`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Product"],
    }),
    getProductById: builder.query<ApiResponse<Product>, { id: string }>({
      query: (id) => `/product/${id}`,
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: `/product/add-product`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/product/${id}/update-product`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}/delete-product`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
