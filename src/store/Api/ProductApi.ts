import baseApi from "./BaseApi/BaseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => {
        return {
          url: "/product/add-product",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllProduct: builder.query({
      query: () => ({
        url: `/product`,
        method: "GET",
      }),
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductQuery,
  useGetProductByIdQuery,
} = productApi;
export default productApi;
