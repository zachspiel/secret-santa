import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { GroupMember } from "../common/types";

interface MembersSlice {
    membersList: GroupMember[];
    editMemberIndex: number;
    enableExclusions: boolean;
}

const initialState: MembersSlice = {
    membersList: [],
    editMemberIndex: -1,
    enableExclusions: false,
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
        setEditMemberIndex: (state, action: PayloadAction<number>) => {
            state.editMemberIndex = action.payload;
        },
        toggleEnableExclusions: (state, action: PayloadAction<boolean>) => {
            state.enableExclusions = action.payload;
        }
    },
});

export const {
    addMember,
    removeMember,
    setMembersList,
    clearMembers,
    setEditMemberIndex,
    toggleEnableExclusions,
} = membersSlice.actions;
export default membersSlice.reducer;
