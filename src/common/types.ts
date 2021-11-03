export interface GroupMember {
  _id: string;
  name: string;
  wishList: string;
}

export interface Group {
  _id: string;
  name: string;
  members: GroupMember[];
}

export interface User {
  _id: string;
  name: string;
  groups: Group[];
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type ModalTypes = 'LOGIN_MODAL' | 'REGISTER_MODAL';
