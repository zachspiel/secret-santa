export interface GroupMember {
    name: string;
    wishlist?: string;
    inviteLink?: string;
    assignedTo?: string;
}

export interface Group {
    _id: string;
    createdBy: string;
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

export interface LoginPayload {
    email: string;
    password: string;
}

export type ModalTypes = "LOGIN_MODAL" | "REGISTER_MODAL";
