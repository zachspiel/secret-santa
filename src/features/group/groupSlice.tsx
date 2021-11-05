import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group } from "../../common/types";

interface GroupSlice {
    groups: Group[];
}

const initialState: GroupSlice = {
    groups: [],
};

export const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        addGroup: (state, action: PayloadAction<Group>) => {
            state.groups = [...state.groups, action.payload];
        },
        removeMember: (state, action: PayloadAction<string>) => {
            state.groups = state.groups.filter((group) => group._id !== action.payload);
        },
        setGroups: (state, action: PayloadAction<Group[]>) => {
            state.groups = [...action.payload];
        },
    },
});

export const { addGroup, removeMember, setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
