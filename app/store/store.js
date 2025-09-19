import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import notesReducer from "./slices/notesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    notes: notesReducer,
  },
});
