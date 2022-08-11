import React from 'react';
import { rest } from 'msw';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { NestedPartial } from '../../../../utils/generics';
import { QuoteResponse } from '../../../../redux/quotesApi';
import { GetUserLimitsResponse } from '../../../../redux/limitsApi';
import App from '../../../../App';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.QUOTES,
    },
    stepperSteps: {
      currentStep: StepperSteps.QUOTES,
    },
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

export const DefaultQuoteResponse: QuoteResponse = {
  id: 'uuid534-23423423-234234-4343',
  source_currency: 'USD',
  target_crypto_asset_id: 'c00b9be1-9472-44cc-b384-7f549274de3b',
  source_amount: '100',
  target_amount: '110',
  fiat_blockchain_fee: '30',
  absolute_internal_fee: '40',
  internal_fee_percent: '0',
  total_fee: '70',
  expires_at: new Date(new Date().getTime() + 3 * 60000).toISOString(),
};

export const DefaultUserLimitsResponse: GetUserLimitsResponse = {
  weekly_limit_usd: '500',
  remaining_weekly_limit_usd: '500',
};

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
