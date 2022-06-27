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
  }),
});

export const {
  useVerifyPhoneNumberMutation,
  useLoginMutation,
} = userApi;
