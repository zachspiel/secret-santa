import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { EmailGroupPayload, Group, User } from "../common/types";

type Payload = {
    _id: string;
    body: Group | Partial<User>;
};

type LoginPayload = {
    email: string;
    password: string;
};

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface Authenticationresponse {
    error: string | undefined;
    data: {
        token: string;
        currentUser: string;
    };
}

export interface SendMessagePayload {
    subject: string;
    message: string;
    email: string;
    url: string;
    type: "question" | "answer";
}

export const PRODUCTION_URL = "https://spiel-secret-santa.vercel.app";
export const BASE_API_URL = "https://secret-santa-server-zachspiel.vercel.app";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/api/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token") || "";
            headers.set("auth-token", token);
            return headers;
        },
    }),
    tagTypes: ["GROUPS", "USER"],
    endpoints: (builder) => ({
        emailGroups: builder.mutation({
            query: (body: EmailGroupPayload) => ({
                url: `email`,
                method: "POST",
                body: body,
            }),
        }),
        getAllGroups: builder.query<Group[], string>({
            query: (id: string) => `groups/${id}`,
            providesTags: ["GROUPS"],
        }),
        getGroupById: builder.query<Group, string>({
            query: (id: string) => `group/${id}`,
        }),
        insertGroup: builder.mutation<Group, Group>({
            query: (body: Group) => ({
                url: "groups",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["GROUPS"],
        }),
        updateGroupById: builder.mutation({
            query: (data: Payload) => ({
                url: `groups/${data._id}`,
                method: "PUT",
                body: data.body,
            }),
            invalidatesTags: ["GROUPS"],
        }),
        deleteGroupById: builder.mutation({
            query: (id: string) => ({
                url: `groups/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["GROUPS"],
        }),
        loginUser: builder.mutation<Authenticationresponse, LoginPayload>({
            query: (body) => ({
                url: "user/login",
                method: "POST",
                body: body,
                invalidatesTags: ["GROUPS, USER"],
            }),
        }),
        registerUser: builder.mutation<Authenticationresponse, RegisterPayload>({
            query: (body) => ({
                url: "user/register",
                method: "POST",
                body: body,
            }),
        }),
        getUserById: builder.query<User, string>({
            query: (id: string) => ({
                url: `user/${id}`,
                providesTags: ["USER"],
            }),
        }),
        updateUserById: builder.mutation({
            query: (data: Payload) => ({
                url: `user/${data._id}`,
                method: "PUT",
                body: data.body,
            }),
            invalidatesTags: ["USER"],
        }),
        sendMessage: builder.mutation<undefined, SendMessagePayload>({
            query: (body) => ({
                url: "sendMessage",
                method: "POST",
                body: body,
            }),
        }),
    }),
});

export const {
    useEmailGroupsMutation,
    useGetAllGroupsQuery,
    useInsertGroupMutation,
    useUpdateGroupByIdMutation,
    useDeleteGroupByIdMutation,
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserByIdQuery,
    useGetGroupByIdQuery,
    useUpdateUserByIdMutation,
    useSendMessageMutation,
} = api;
