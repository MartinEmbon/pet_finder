import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Create this slice in the next step

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
