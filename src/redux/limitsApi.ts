import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';

export type GetUserLimitsResponse = {
  weekly_limit_usd: string;
  remaining_weekly_limit_usd: string | null;
}

export const limitsApi = createApi({
  keepUnusedDataFor: 0,
  reducerPath: 'limitsApi',
  baseQuery,
  // add types
  endpoints: (build) => ({
    getUserLimits: build.query<GetUserLimitsResponse, void>({
      query: () => '/user-limits',
    }),
  }),
});

export const {
  useGetUserLimitsQuery,
} = limitsApi;
