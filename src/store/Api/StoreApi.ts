import baseApi from "./BaseApi/BaseApi";

const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoreConfig: builder.query({
      query: () => ({
        url: "/store/config",
        method: "GET",
      }),
      providesTags: ["Store"],
    }),
  }),
});

export const { useGetStoreConfigQuery } = storeApi;
