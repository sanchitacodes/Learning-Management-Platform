// import {configureStore} from "@reduxjs/toolkit"
// import rootReducer from "../feature/authSlice";
// import {authApi} from "../feature/api/authApi.js";

// export const appStore = configureStore({
//     reducer:{
//         auth: rootReducer,
//         middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware)

//     }
// });

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {authApi} from "../feature/api/authApi";
import { courseApi } from "@/feature/api/courseApi";
import { purchaseApi } from "@/feature/api/purchaseApi";
import { courseProgressApi } from "@/feature/api/courseProgressApi";
import { recommendationApi } from "@/feature/api/recom";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware, recommendationApi.middleware)
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch:true}));
}

initializeApp();