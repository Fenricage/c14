import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';

export type VerifyNumberRequestBody = {
  phone_number: string;
}

export type LoginResponse = {
  jwt_token: string;
}

export type LoginRequestBody = {
  phone_number: string;
  verification_code: string;
}

export type UserDetails = {
  email: string;
  first_names: string;
  last_names: string;
  building: string;
  street_name: string;
  unit_number: string;
  city: string;
  state_code: string;
  postal_code: string;
  date_of_birth: string;
}

export type GetUserResponse = UserDetails & {
  identity_verified: boolean;
}

export type UpdateUserResponse = {
  identity_verified: boolean;
}

export type UpdateUserRequest = UserDetails

export const userApi = createApi({
  keepUnusedDataFor: 0,
  reducerPath: 'userApi',
  baseQuery,
  // add types
  endpoints: (build) => ({
    verifyPhoneNumber: build.mutation<Record<string, never>, VerifyNumberRequestBody>({
      query: (body) => ({
        url: '/verify-phone-number',
        method: 'POST',
        body,
      }),
    }),
    login: build.mutation<LoginResponse, LoginRequestBody>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    getUser: build.query<GetUserResponse, void>({
      query: () => '/user-details',
    }),
    updateUser: build.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: '/user-details',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useVerifyPhoneNumberMutation,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useGetUserQuery,
  useLoginMutation,
} = userApi;
