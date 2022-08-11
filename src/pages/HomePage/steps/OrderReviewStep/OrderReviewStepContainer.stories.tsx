import React from 'react';
import { rest } from 'msw';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { NestedPartial } from '../../../../utils/generics';
import App from '../../../../App';
import { QuoteResponse } from '../../../../redux/quotesApi';
import { DefaultQuoteResponse, DefaultUserLimitsResponse } from '../QuotesStep/QuotesStepContainer.stories';
import { GetUserLimitsResponse } from '../../../../redux/limitsApi';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.REVIEW_ORDER,
    },
    stepperSteps: {
      currentStep: StepperSteps.REVIEW_ORDER,
    },
    quotes: {
      target_amount: '100',
      total_fee: '70',
      fiat_blockchain_fee: '40',
      absolute_internal_fee: '30',
      target_crypto_asset_id: 'c00b9be1-9472-44cc-b384-7f549274de3b',
      source_amount: '90',
      expires_at: new Date(new Date().getTime() + 3 * 60000).toISOString(),
      source_currency: 'USD',
      id: '24234',
      internal_fee_percent: '20',
    },
  },
  userDetails: {
    user: {
      email: 'fenricage+9@gmail.com',
      first_names: 'Bran',
      last_names: 'Ganza',
      building: '20',
      street_name: 'Central Avenue',
      unit_number: '10',
      city: 'Tucson',
      state_code: 'DE',
      postal_code: '97531',
      date_of_birth: '1992-05-31',
    },
    documentVerificationStatus: 'SUCCESS',
    isUserLoaded: true,
    isUserUpdated: false,
    isUserLoading: false,
    isUserUpdating: false,
    isUserVerified: true,
    isEmailVerificationSending: false,
    isSMSSended: true,
    isEmailVerificationSent: true,
    isEmailVerified: true,
    isSMSSending: false,
    phoneNumber: '44123123123',
    skipPersonalInfoStep: true,
  },
  paymentSelect: {
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
    selectedUserCard: {
      card_id: '123',
      type: 'Visa',
      last4: '4242',
      expiry_month: '02',
      expiry_year: '29',
    },
    deletingCards: [],
    userCardsError: '',
    isUserCardsLoaded: true,
  },
};

const store = createStoreWithMiddlewares(initialStore);

export default {
  component: App,
  decorators: [
    withProvider.bind(null, store),
    withQuery,
  ],
  parameters: {
    layout: 'fullscreen',
    query: {
      targetAddress: '0xaisughi23423sdg',
    },
  },
} as ComponentMeta<typeof App>;

export const Default: ComponentStory<typeof App> = () => (
  <App />
);

Default.parameters = {
  msw: {
    handlers: [
      rest.post<Record<string, never>, Record<string, never>, QuoteResponse>(
        `${process.env.REACT_APP_SERVER_URL}quotes`,
        (req, res, ctx) => res(
          ctx.json(DefaultQuoteResponse),
        ),
      ),
      rest.get<Record<string, never>, Record<string, never>, GetUserLimitsResponse>(
        `${process.env.REACT_APP_SERVER_URL}user-limits`,
        (req, res, ctx) => res(
          ctx.json(DefaultUserLimitsResponse),
        ),
      ),
    ],
  },
};
