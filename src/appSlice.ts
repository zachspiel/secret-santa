import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    isUserSignedIn: boolean;
}

const initialState: AppSlice = {
    isUserSignedIn: localStorage.getItem("currentUser") !== null,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSignInStatus: (state, action: PayloadAction<boolean>) => {
            state.isUserSignedIn = action.payload;
        },
    },
});

export const { setSignInStatus } = appSlice.actions;
export default appSlice.reducer;
