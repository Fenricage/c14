import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';

export type ExecutePurchaseRequestBody = {
  quote_id: string;
  card_id: string;
  target_blockchain_address: string;
}

export type ExecutePurchaseResponse = {
  id: string;
}

export enum GetPurchaseDetailsResponseStatus {
  PENDING = 'PENDING',
  CUSTOMER_CHARGED = 'CUSTOMER_CHARGED',
  CUSTOMER_CHARGE_DECLINED = 'CUSTOMER_CHARGE_DECLINED',
  BLOCKCHAIN_TRANSFER_PENDING = 'BLOCKCHAIN_TRANSFER_PENDING',
  BLOCKCHAIN_TRANSFER_COMPLETE = 'BLOCKCHAIN_TRANSFER_COMPLETE'
}

export type GetPurchaseDetailsResponse = {
  source_amount: string;
  target_amount: string;
  target_blockchain_address: string;
  fiat_blockchain_fee: string;
  absolute_internal_fee: string;
  card_type: string;
  card_last4: string;
  blockchain_explorer_uri: string;
  status: GetPurchaseDetailsResponseStatus;
}

export const purchaseApi = createApi({
  keepUnusedDataFor: 0,
  reducerPath: 'purchaseApi',
  baseQuery,
  // add types
  endpoints: (build) => ({
    executePurchase: build.mutation<ExecutePurchaseResponse, ExecutePurchaseRequestBody>({
      query: (body) => ({
        url: '/purchases',
        method: 'POST',
        body,
      }),
    }),
    getPurchaseDetails: build.query<GetPurchaseDetailsResponse, string>({
      query: (id) => `/purchases/${id}`,
    }),
  }),
});

export const {
  useExecutePurchaseMutation,
  useGetPurchaseDetailsQuery,
  useLazyGetPurchaseDetailsQuery,
} = purchaseApi;
