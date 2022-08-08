import React from 'react';
import { rest } from 'msw';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import Widget from '../../Widget/Widget';
import { GetUserCardsResponse } from '../../../../redux/cardsApi';
import { NestedPartial } from '../../../../utils/generics';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PAYMENT_SELECT,
    },
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
  component: Widget,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof Widget>;

export const Default: ComponentStory<typeof Widget> = (args) => (
  <Widget {...args} />
);

Default.parameters = {
  msw: {
    handlers: [
      rest.get<Record<string, never>, Record<string, never>, GetUserCardsResponse>(
        `${process.env.REACT_APP_SERVER_URL}cards`,
        (req, res, ctx) => res(
          ctx.json({
            customer_cards: [{
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
          }),
        ),
      ),
    ],
  },
};
