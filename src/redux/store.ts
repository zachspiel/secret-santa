import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "../redux/membersSlice";
import groupsReducer from "../features/group/groupSlice";

export const store = configureStore({
  reducer: {
    members: membersReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
