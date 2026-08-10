import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/services/api/baseApi";

// Ensure endpoint injection runs before store usage
import "@/services/api/authApi";
import "@/services/api/profileApi";
import "@/services/api/rolesApi";
import "@/services/api/diagnosticApi";
import "@/services/api/gapApi";
import "@/services/api/challengeApi";
import "@/services/api/sessionApi";
import "@/services/api/progressApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export function setupStoreListeners(store: AppStore) {
  setupListeners(store.dispatch);
}
