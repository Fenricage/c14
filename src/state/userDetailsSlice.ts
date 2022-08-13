import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { userApi, UserDetails } from '../redux/userApi';
import { DocumentVerificationStatus } from './applicationSlice';

export type UserDetailsState = {
  user: null | UserDetails
  isUserLoading: boolean
  skipPersonalInfoStep: boolean
  isUserLoaded: boolean
  isUserUpdating: boolean
  isUserUpdated: boolean
  isUserVerified: boolean;
  isEmailVerified: boolean;
  documentVerificationStatus: DocumentVerificationStatus | null;
  phoneNumber: string | null;
  isEmailVerificationSent: boolean;
  isEmailVerificationSending: boolean;
  isSMSSended: boolean;
  isSMSSending: boolean;
}

export const initialState: UserDetailsState = {
  user: null,
  skipPersonalInfoStep: true,
  isUserLoading: false,
  isUserLoaded: false,
  isUserUpdating: false,
  isUserUpdated: false,
  isEmailVerified: false,
  documentVerificationStatus: null,
  phoneNumber: null,
  isEmailVerificationSent: false,
  isEmailVerificationSending: false,
  isSMSSended: false,
  isSMSSending: false,
} as UserDetailsState;

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUserUpdated: (state, action: PayloadAction<boolean>) => {
      state.isUserUpdated = action.payload;
    },
    setSkipPersonalInfoStep: (state, { payload }: PayloadAction<boolean>) => {
      state.skipPersonalInfoStep = payload;
    },
    setEmailVerificationSent: (state, { payload }: PayloadAction<boolean>) => {
      state.isEmailVerificationSent = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchPending,
      (state) => {
        state.isSMSSending = true;
      },
    );
    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchFulfilled,
      (state, { meta }) => {
        state.isSMSSending = false;
        state.phoneNumber = meta.arg.originalArgs.phone_number;

        state.isSMSSended = true;
      },
    );
    builder.addMatcher(
      userApi.endpoints.verifyPhoneNumber.matchRejected,
      (state) => {
        state.isSMSSending = false;
      },
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchPending,
      (state) => {
        state.isUserLoading = true;
      },
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isUserVerified = payload.identity_verified;
        state.isEmailVerified = payload.email_verified;
        state.documentVerificationStatus = payload.document_verification_status;
        state.isUserLoaded = true;
        state.isUserLoading = false;
      },
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchRejected,
      (state) => {
        state.isUserLoading = false;
      },
    );
    builder.addMatcher(
      userApi.endpoints.updateUser.matchPending,
      (state) => {
        state.isUserUpdating = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        state.isUserUpdated = true;
        state.isUserUpdating = false;
        state.isUserVerified = payload.identity_verified;
      },
    );
    builder.addMatcher(
      userApi.endpoints.updateUser.matchRejected,
      (state) => {
        state.isUserUpdating = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchPending,
      (state) => {
        state.isEmailVerificationSending = true;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchFulfilled,
      (state) => {
        state.isEmailVerificationSent = true;
        state.isEmailVerificationSending = false;
      },
    );

    builder.addMatcher(
      userApi.endpoints.sendEmailVerification.matchRejected,
      (state) => {
        state.isEmailVerificationSending = false;
      },
    );
  },
});

export const selectUserDetails = (state: RootState) => state.userDetails;

export const {
  setUserUpdated,
  setSkipPersonalInfoStep,
  setEmailVerificationSent,
} = userDetailsSlice.actions;

export default userDetailsSlice;
