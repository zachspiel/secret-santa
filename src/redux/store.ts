import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appReducer from "../appSlice";
import membersReducer from "../redux/membersSlice";
import groupsReducer from "../features/group/groupSlice";
import { api } from "./api";

const rootReducer = combineReducers({
    app: appReducer,
    members: membersReducer,
    groups: groupsReducer,
    [api.reducerPath]: api.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
