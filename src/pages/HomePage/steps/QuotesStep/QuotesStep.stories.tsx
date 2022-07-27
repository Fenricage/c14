import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import QuotesStep from './QuotesStep';
import { mockFn, withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

const sourceCurrency = 'USD';
const sourceAmount = '100';
const targetAmount = '97';
const targetAssetId = 'b2384bf2-b14d-4916-aa97-85633ef05742';
const c14Fee = '2.99';
const networkFee = '0.01';
const totalFee = '3';

const store = createStoreWithMiddlewares({
  ...mockStore,
  application: {
    ...mockStore.application,
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
  onSourceAmountChange: mockFn,
  onTargetAmountChange: mockFn,
  onSourceCurrencyChange: mockFn,
  onTargetCurrencyChange: mockFn,
  submitForm: () => new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  }),
};
