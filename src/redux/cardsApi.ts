import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { baseQuery } from './utils';

export type AddUserCardRequestBody = {
  card_token: string;
}

export type AddUserCardResponse = {
  card_id: string;
}

export type PaymentCard = {
  card_id: string;
  type: string;
  last4: string;
  expiry_month: string;
  expiry_year: string;
}

export type GetUserCardsResponse = {
  customer_cards: PaymentCard[]
}

export const cardsApi = createApi({
  keepUnusedDataFor: 0,
  reducerPath: 'cardsApi',
  baseQuery,
  tagTypes: ['Cards'],
  // add types
  endpoints: (build) => ({
    addUserCard: build.mutation<AddUserCardResponse, AddUserCardRequestBody>({
      query: (body) => ({
        url: '/cards',
        method: 'POST',
        body,
      }),
    }),
    getUserCards: build.query<GetUserCardsResponse, Record<string, never>>({
      query: () => '/cards',
    }),
    deleteUserCard: build.mutation<null, string>({
      query: (cardId) => ({
        url: `/cards/${cardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cards'],
    }),
  }),
});

export const {
  useAddUserCardMutation,
  useGetUserCardsQuery,
  useLazyGetUserCardsQuery,
  useDeleteUserCardMutation,
} = cardsApi;
