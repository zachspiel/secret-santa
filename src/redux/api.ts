import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Group, User } from "../common/types";

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

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://spiel-secret-santa-server.herokuapp.com/api/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token") || "";

            headers.set("auth-token", token);

            return headers;
        },
    }),
    tagTypes: ["GROUPS", "USER"],
    endpoints: (builder) => ({
        getAllGroups: builder.query<Group[], string>({
            query: (id: string) => `groups/${id}`,
            providesTags: ["GROUPS"],
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
    }),
});

export const {
    useGetAllGroupsQuery,
    useInsertGroupMutation,
    useUpdateGroupByIdMutation,
    useDeleteGroupByIdMutation,
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserByIdQuery,
    useUpdateUserByIdMutation,
} = api;
