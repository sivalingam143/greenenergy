import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlice";
import authReducer from "../slices/authSlice";
import roleReducer from "../slices/roleSlice";
import partsReducer from "../slices/PartsSlice";
import csrReducer from "../slices/CsrSlice";
import csrMappingReducer from "../slices/CsrMappingSlice";
import csrEntryReducer from "../slices/CsrEntrySlice";
import LoginMiddleware from "../middleware/LoginMiddleware";

const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    roles: roleReducer,
    parts: partsReducer,
    csrs: csrReducer,
    csrMappings: csrMappingReducer,
    csrEntries: csrEntryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware),
});

export default store;
