import React from 'react';
import { rest } from 'msw';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { createStoreWithMiddlewares } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import Widget from '../../Widget/Widget';

const store = createStoreWithMiddlewares({
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PAYMENT_SELECT,
    },
    stepperSteps: StepperSteps.PAYMENT_DETAILS,
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
});

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
      rest.get('https://api-qjoa5a5qtq-uc.a.run.app/cards', (req, res, ctx) => res(
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
      )),
    ],
  },
};
