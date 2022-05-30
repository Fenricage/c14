import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_SERVER_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'no-cache');

    return headers;
  },

});

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
