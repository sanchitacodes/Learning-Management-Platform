import authReducer from "../feature/authSlice.js";
import {combineReducers} from "@reduxjs/toolkit";
import {authApi} from "../feature/api/authApi.js";
import { courseApi } from "@/feature/api/courseApi.js";
import { purchaseApi } from "@/feature/api/purchaseApi";
import { courseProgressApi } from "@/feature/api/courseProgressApi.js";
import { recommendationApi } from "@/feature/api/recom.js";

const rootReducer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [recommendationApi.reducerPath]:recommendationApi.reducer,
    auth:authReducer
});
export default rootReducer;