import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({courseIds}) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseIds },
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
    getInstructorSalesSummary: builder.query({
      query: () => ({
        url: `/sales-summary`,
        method: "GET",
      }),
    }),
    // getRecommendedCourses: builder.query({
    //     // query: (courseId) => `/course/${courseId}/recommendations`,
    //     query: (courseId) => `http://localhost:8080/api/recommendations/${courseId}`,
    //   }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
  useGetInstructorSalesSummaryQuery,
  useGetRecommendedCoursesQuery
} = purchaseApi;
