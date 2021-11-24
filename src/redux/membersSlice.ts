import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { GroupMember } from "../common/types";

interface MembersSlice {
    membersList: GroupMember[];
    exclusions: GroupMember[][];
}

const initialState: MembersSlice = {
    membersList: [],
    exclusions: [],
};

export const membersSlice = createSlice({
    name: "members",
    initialState,
    reducers: {
        addMember: (state, action: PayloadAction<GroupMember>) => {
            state.membersList = [...state.membersList, action.payload];
        },
        removeMember: (state, action: PayloadAction<GroupMember>) => {
            state.membersList = state.membersList.filter(
                (member) => member.name !== action.payload.name,
            );
        },
        setMembersList: (state, action: PayloadAction<GroupMember[]>) => {
            state.membersList = [...action.payload];
        },
        clearMembers: (state) => {
            state.membersList = [];
        },
        setExclusions: (state, action: PayloadAction<GroupMember[][]>) => {
            state.exclusions = action.payload;
        },
    },
});

export const { addMember, removeMember, setMembersList, clearMembers, setExclusions } =
    membersSlice.actions;
export default membersSlice.reducer;
