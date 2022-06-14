import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';

export type QuoteRequestBody = {
  source_currency: string;
  target_currency: string;
  source_amount?: string;
  target_amount?: string;
}

export type QuoteResponse = {
  id: string;
  source_currency: string;
  target_currency: string;
  source_amount: string;
  target_amount: string;
  fiat_blockchain_fee: string;
  absolute_internal_fee: string;
  internal_fee_percent: string;
  total_fee: string;
  expires_at: string;
}

export const quotesApi = createApi({
  keepUnusedDataFor: 0,
  reducerPath: 'quotesApi',
  baseQuery,
  // add types
  endpoints: (build) => ({
    getQuote: build.mutation<QuoteResponse, QuoteRequestBody>({
      query: (body) => ({
        url: '/quotes',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetQuoteMutation,
} = quotesApi;
