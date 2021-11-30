import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    isUserSignedIn: boolean;
    currentStep: number;
}

const initialState: AppSlice = {
    isUserSignedIn: localStorage.getItem("currentUser") !== null,
    currentStep: 0,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSignInStatus: (state, action: PayloadAction<boolean>) => {
            state.isUserSignedIn = action.payload;
        },
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload
        }
    },  
});

export const { setSignInStatus, setCurrentStep } = appSlice.actions;
export default appSlice.reducer;
