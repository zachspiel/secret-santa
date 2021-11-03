import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MembersSlice {
  membersList: string[];
  santaList: string[];
}

const initialState: MembersSlice = {
  membersList: [],
  santaList: [],
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state, action: PayloadAction<string>) => {
      state.membersList = [...state.membersList, action.payload];
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.membersList = state.membersList.filter((member) => member !== action.payload);
    },
    setSantasList: (state, action: PayloadAction<string[]>) => {
      state.santaList = [...action.payload];
    },
  },
});

export const { addMember, removeMember, setSantasList } = membersSlice.actions;
export default membersSlice.reducer;
