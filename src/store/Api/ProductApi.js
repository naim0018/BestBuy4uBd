// Helper function to build query string
import baseApi from "./BaseApi/BaseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (options = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(options).forEach(([key, value]) => {
          if (value !== "" && value !== "undefined" && value !== null) {
            queryParams.append(key, value);
          }
        });
        return {
          url: `/product`,
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response) => {
        return {
          products: response.data,
          pagination: response.meta,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Products",
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
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
      invalidatesTags: ["Product", "Products", "Categories"],
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
