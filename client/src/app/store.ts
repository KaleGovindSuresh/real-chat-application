// src/app/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "../features/auth/authSlice";
import messagesReducer from "../features/messages/messagesSlice";
import conversationsReducer from "../features/conversations/conversationsSlice";
import draftsReducer from "../features/drafts/draftsSlice";
import uploadReducer from "../features/upload/uploadSlice";
import uiReducer from "../features/ui/uiSlice";
import { localStorageAdapter } from "./persistStorage";

const rootReducer = combineReducers({
  auth: authReducer,
  messages: messagesReducer,
  conversations: conversationsReducer,
  drafts: draftsReducer,
  upload: uploadReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: "realchat",
  storage: localStorageAdapter,
  whitelist: ["auth", "drafts"], // Only persist auth session + unsent drafts
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
