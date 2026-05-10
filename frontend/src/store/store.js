import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import hcpReducer from "./slices/hcpSlice";
import interactionReducer from "./slices/interactionSlice";
import aiReducer from "./slices/aiSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    hcp: hcpReducer,
    interaction: interactionReducer,
    ai: aiReducer,
    notification: notificationReducer,
  },
});
