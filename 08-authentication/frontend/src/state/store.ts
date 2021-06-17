import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { backendApi } from './backendApi';
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,

  // Adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store
