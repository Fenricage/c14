import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';
import { DocumentVerificationStatus } from '../state/applicationSlice';

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
// eslint-disable-next-line no-multiple-empty-lines
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

export type EmailVerificationCodeResponse = Record<string, never>

export type GetUserResponse = UserDetails & {
  identity_verified: boolean;
  email_verified: boolean;
  document_verification_status: DocumentVerificationStatus;
}

export type UpdateUserResponse = {
  identity_verified: boolean;
}

export type UpdateUserRequest = {
  email: string;
  building: string;
  street_name: string;
  unit_number: string;
  city: string;
  state_code: string;
  postal_code: string;
}

export type VerifyDocumentsResponse = Record<string, void>

export type VerifyDocumentsRequest = {
  document_verification_token: string
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
    sendEmailVerification: build.mutation<EmailVerificationCodeResponse, void>({
      query: () => ({
        url: '/send-verification-email',
        method: 'POST',
      }),
    }),
    verifyDocuments: build.mutation<VerifyDocumentsResponse, VerifyDocumentsRequest>({
      query: (body) => ({
        url: '/document-verification',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useVerifyPhoneNumberMutation,
  useSendEmailVerificationMutation,
  useUpdateUserMutation,
  useLazyGetUserQuery,
  useGetUserQuery,
  useLoginMutation,
  useVerifyDocumentsMutation,
} = userApi;
