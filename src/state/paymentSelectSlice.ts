import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cardsApi, PaymentCard } from '../redux/cardsApi';

import { RootState } from '../app/store';

export type PaymentSelectState = {
  userCards: PaymentCard[]
  selectedUserCard: PaymentCard | null
  isUserCardsLoaded: boolean
  userCardsError: string | null
  deletingCards: string[]
}

const initialState = {
  userCards: [{
    card_id: '123',
    type: 'Visa',
    last4: '4242',
    expiry_month: '02',
    expiry_year: '29',
  }, {
    card_id: '456',
    type: 'MasterCard',
    last4: '6969',
    expiry_month: '05',
    expiry_year: '29',
  }],
  selectedUserCard: null,
  isUserCardsLoaded: false,
  userCardsError: null,
  deletingCards: [],
} as PaymentSelectState;

const paymentSelectSlice = createSlice({
  name: 'paymentSelect',
  initialState,
  reducers: {
    setUserCardsEmpty(state) {
      state.userCards = [];
    },
    setSelectedUserCard(state, action: PayloadAction<PaymentCard>) {
      state.selectedUserCard = action.payload;
    },
    clearSelectedUserCard(state) {
      state.selectedUserCard = null;
    },
    resetUserCards(state) {
      state.userCards = [];
      state.isUserCardsLoaded = false;
      state.userCardsError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cardsApi.endpoints.getUserCards.matchRejected,
      (state) => {
        state.isUserCardsLoaded = true;
        state.userCardsError = 'Request is failed';
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.getUserCards.matchFulfilled,
      (state, { payload }) => {
        state.isUserCardsLoaded = true;
        state.userCardsError = '';
        state.userCards = payload.customer_cards;
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.deleteUserCard.matchPending,
      (state, { meta }) => {
        const toDeleteCardId = meta.arg.originalArgs;
        state.deletingCards = [...state.deletingCards, toDeleteCardId];
      },
    );

    builder.addMatcher(
      cardsApi.endpoints.deleteUserCard.matchFulfilled,
      (state, { meta }) => {
        const toDeleteCardId = meta.arg.originalArgs;
        state.userCards = state.userCards.filter((c) => c.card_id !== toDeleteCardId);
        state.deletingCards = state.deletingCards.filter((c) => c !== toDeleteCardId);
      },
    );
  },
});

export const selectPayment = (state: RootState) => state.paymentSelect;

export const {
  setSelectedUserCard,
  setUserCardsEmpty,
  resetUserCards,
} = paymentSelectSlice.actions;

export default paymentSelectSlice;
