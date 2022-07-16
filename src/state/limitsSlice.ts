import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { GetUserLimitsResponse, limitsApi } from '../redux/limitsApi';

export type LimitsState = {
  isLimitsLoading: boolean;
  isLimitsLoaded: boolean;
  limits: null | GetUserLimitsResponse;
  error: null | string;
}

export const initialState = {
  limits: null,
} as LimitsState;

const limitsSlice = createSlice({
  name: 'limits',
  initialState,
  reducers: {
    setLimitsLoaded(state, action: PayloadAction<boolean>) {
      state.isLimitsLoaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(limitsApi.endpoints.getUserLimits.matchPending, (state) => {
      state.isLimitsLoading = true;
    });

    builder.addMatcher(limitsApi.endpoints.getUserLimits.matchFulfilled, (state, { payload }) => {
      state.limits = payload;
      state.isLimitsLoaded = true;
      state.isLimitsLoading = false;
    });

    builder.addMatcher(limitsApi.endpoints.getUserLimits.matchRejected, (state) => {
      state.isLimitsLoaded = true;
      state.isLimitsLoading = false;
      state.error = 'Failed to fetch limits';
    });
  },
});

export const selectLimits = (state: RootState) => state.limits;

export const {
  setLimitsLoaded,
} = limitsSlice.actions;

export default limitsSlice;
