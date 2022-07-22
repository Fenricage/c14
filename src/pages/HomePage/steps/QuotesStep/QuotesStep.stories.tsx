import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import QuotesStep from './QuotesStep';
import { mockFn, withProvider } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

const sourceCurrency = 'USD';
const sourceAmount = '100';
const targetAmount = '97';
const targetAssetId = 'b2384bf2-b14d-4916-aa97-85633ef05742';
const c14Fee = '2.99';
const networkFee = '0.01';
const totalFee = '3';

const store = createStoreWithMiddlewares({
  application: {
    isQuoteLoaded: true,
    quoteError: '',
    quotes: {
      id: 'c0dc71d2-b5da-45ac-be03-23db1a122932',
      source_currency: sourceCurrency,
      target_crypto_asset_id: targetAssetId,
      source_amount: sourceAmount,
      target_amount: targetAmount,
      fiat_blockchain_fee: networkFee,
      absolute_internal_fee: c14Fee,
      internal_fee_percent: '2.99',
      total_fee: totalFee,
      expires_at: '2022-07-20T20:26:04.075000+00:00',
    },
    user: null,
    generalError: null,
    skipPaymentStep: true,
    skipPersonalInfoStep: true,
    isUserLoading: false,
    isUserLoaded: false,
    isUserUpdating: false,
    isUserUpdated: false,
    isUserVerified: false,
    isEmailVerified: false,
    isQuoteLoading: false,
    isUserCardsEmpty: false,
    isQuotesAutoUpdateEnabled: false,
    lastChangedQuoteInputName: 'quoteSourceAmount',
    requestCounter: 1381977,
    fee: {
      c14: '2.99',
      network: '0.01',
      total: '3',
    },
    stepperSteps: {
      currentStep: 0,
    },
    widgetSteps: {
      currentStep: 0,
    },
    wizard: {
      'calculator-form': {
        initialValues: {
          quoteSourceAmount: sourceAmount,
          quoteTargetAmount: targetAmount,
          sourceCurrency,
          targetCurrency: targetAssetId,
        },
        snapshot: {
          quoteSourceAmount: sourceAmount,
          quoteTargetAmount: '',
          sourceCurrency,
          targetCurrency: targetAssetId,
        },
      },
      'payment-select-form': {
        initialValues: {},
        snapshot: {},
      },
    },
    userCards: {
      customer_cards: [],
    },
    selectedUserCard: null,
    isUserCardsLoading: true,
    isUserCardsLoaded: false,
    userCardsError: null,
    purchaseDetails: null,
    deletingCards: [],
    isSMSSended: false,
    jwtToken: null,
    isSMSSending: false,
    isAuthenticated: false,
    isAuthenticating: false,
    phoneNumber: null,
    isEmailVerificationSent: false,
    isEmailVerificationSending: false,
  },
});

export default {
  component: QuotesStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof QuotesStep>;

const Template: ComponentStory<typeof QuotesStep> = (args) => <QuotesStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialQuotesValuesForm: {
    quoteSourceAmount: sourceAmount,
    quoteTargetAmount: targetAmount,
    sourceCurrency,
    targetCurrency: targetAssetId,
  },
  c14Fee,
  networkFee,
  totalFee,
  onAmountChange: mockFn,
  onCurrencyChange: mockFn,
  updateQuotes: () => Promise.resolve(),
  submitForm: () => new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  }),
};
