import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PaymentSelectStep from './PaymentSelectStep';
import { mockFn, withProvider } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

const store = createStoreWithMiddlewares({
  application: {
    widgetSteps: {
      currentStep: 0,
    },
  },
});

const commonArgs = {
  deletingCards: [],
  onCardSelection: mockFn,
  onLogout: mockFn,
  onAddNewCardClick: mockFn,
  onSubmitClick: mockFn,
};

export default {
  component: PaymentSelectStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof PaymentSelectStep>;

const Template: ComponentStory<typeof PaymentSelectStep> = (args) => <PaymentSelectStep {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  ...commonArgs,
  customerCards: [],
  selectedCard: null,
  areCardsLoading: true,
};

export const Loaded = Template.bind({});
Loaded.args = {
  ...commonArgs,
  customerCards: [{
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
  selectedCard: {
    card_id: '123',
    type: 'Visa',
    last4: '4242',
    expiry_month: '02',
    expiry_year: '29',
  },
  areCardsLoading: false,
};

export const DeletingCard = Template.bind({});
DeletingCard.args = {
  ...commonArgs,
  deletingCards: ['123'],
  customerCards: [{
    card_id: '123',
    type: 'Visa',
    last4: '4242',
    expiry_month: '02',
    expiry_year: '29',
  }],
  selectedCard: {
    card_id: '123',
    type: 'Visa',
    last4: '4242',
    expiry_month: '02',
    expiry_year: '29',
  },
  areCardsLoading: false,
};
