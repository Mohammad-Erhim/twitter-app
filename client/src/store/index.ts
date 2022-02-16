import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authSlice from "./auth";

import dataSlice from "./data";
import searchSlice from "./app";
import appSlice from "./app";
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],

};
export const authActions = authSlice.actions;

export const dataAction = dataSlice.actions;
export const searchAction = searchSlice.actions;
const reducers = combineReducers({ auth: authSlice.reducer, data: dataSlice.reducer, app: appSlice.reducer });
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
