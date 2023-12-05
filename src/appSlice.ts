import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { SelectedForm } from "./types/FormTypes";

interface AppSlice {
    isUserSignedIn: boolean;
    currentStep: number;
    selectedForm: SelectedForm;
}

const initialState: AppSlice = {
    isUserSignedIn: localStorage.getItem("currentUser") !== null,
    currentStep: 0,
    selectedForm: "form-one",
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSignInStatus: (state, action: PayloadAction<boolean>) => {
            state.isUserSignedIn = action.payload;
        },
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        progressToPreviousStep: (state) => {
            state.currentStep--;
        },
        progressToNextStep: (state) => {
            state.currentStep++;
        },
        setSelectedForm: (state, action: PayloadAction<SelectedForm>) => {
            state.selectedForm = action.payload;
        },
    },
});

export const {
    setSignInStatus,
    progressToPreviousStep,
    progressToNextStep,
    setSelectedForm,
} = appSlice.actions;
export default appSlice.reducer;
