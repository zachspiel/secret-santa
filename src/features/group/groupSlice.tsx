import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../../common/types';

interface GroupSlice {
  groups: Group[];
}

const initialState: GroupSlice = {
  groups: [
    { _id: '1', name: 'Group1', members: [{ _id: '11', name: 'BOB', wishList: '' }] },
    { _id: '2', name: 'Group2', members: [{ _id: '22', name: 'BOB', wishList: '' }] },
    { _id: '3', name: 'Group3', members: [{ _id: '33', name: 'BOB', wishList: '' }] },
    { _id: '4', name: 'Group4', members: [{ _id: '44', name: 'BOB', wishList: '' }] },
  ],
};

export const groupsSlice = createSlice({
  name: 'groups',
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
