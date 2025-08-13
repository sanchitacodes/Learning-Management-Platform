// feature/api/recommendationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/recommendations",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getRecommendedCourses: builder.query({
      query: (courseId) => `/${courseId}`,
    }),
  }),
});

export const { useGetRecommendedCoursesQuery } = recommendationApi;
