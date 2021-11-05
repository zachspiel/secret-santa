import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupMember } from "../common/types";

interface MembersSlice {
    isUserSignedIn: boolean;
    membersList: GroupMember[];
    santaList: GroupMember[];
}

const initialState: MembersSlice = {
    isUserSignedIn: localStorage.getItem("currentUser") !== null,
    membersList: [],
    santaList: [],
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
        clearMembers: (state) => {
            state.membersList = [];
        },
        setSantasList: (state, action: PayloadAction<GroupMember[]>) => {
            state.santaList = [...action.payload];
        },
        setSignInStatus: (state, action: PayloadAction<boolean>) => {
            state.isUserSignedIn = action.payload;
        },
    },
});

export const { addMember, removeMember, setSantasList, setSignInStatus, clearMembers } =
    membersSlice.actions;
export default membersSlice.reducer;
