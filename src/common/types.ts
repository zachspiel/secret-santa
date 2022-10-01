export interface GroupMember {
    name: string;
    email: string;
    assignedTo: string;
    wishlist?: string;
    inviteLink?: string;
    notes?: string;
    favoriteStore?: string;
    favoriteFood?: string;
    favoriteColor?: string;
    exclusions: string[];
}

export interface Group {
    _id: string;
    createdBy: string;
    name: string;
    members: GroupMember[];
    currencySymbol?: string;
    budget?: string;
    date?: string;
}

export interface GroupFormValues {
    groupName: string;
    date: string;
    currency: string;
    budget: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
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

export interface RegisterUserValues extends RegisterPayload {
    passwordConfirmation: string;
}

export interface EmailGroupPayload {
    subject: string;
    message: string;
    members: GroupMember[];
}

export type ModalTypes = "LOGIN_MODAL" | "REGISTER_MODAL";
