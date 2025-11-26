import type { FormType } from "../types/FormTypes";

export interface GroupMember {
    id: string;
    name: string;
    email: string;
    assignedTo: string;
    exclusions: string[];
    groupId?: string;
    qAndA?: QAndA[];
    [key: string]: any;
}

export interface QAndA {
    id: string;
    question: string;
    answer: string;
}

export interface Group {
    _id: string;
    formType: FormType;
    createdBy: string;
    name: string;
    members: GroupMember[];
    currencySymbol?: string;
    budget?: string;
    date?: string;
    inviteLink?: string;
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
    groupId: string;
    formType: FormType;
}

export type ModalTypes = "LOGIN_MODAL" | "REGISTER_MODAL";
