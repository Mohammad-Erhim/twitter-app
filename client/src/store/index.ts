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
import appSlice from "./app";
import dataSlice from "./data";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

export const authActions = authSlice.actions;
export const appActions = appSlice.actions;
export const dataActions = dataSlice.actions;



const reducers = combineReducers({ auth: authSlice.reducer, app: appSlice.reducer, data: dataSlice.reducer });
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
