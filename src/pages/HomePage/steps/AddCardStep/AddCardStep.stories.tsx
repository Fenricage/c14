import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddCardStep from './AddCardStep';
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
  isFormValid: true,
  isCardSubmitted: false,
  onSubmit: mockFn,
  onGoBack: mockFn,
  onFrameValidationChanged: mockFn,
  onCardSubmitted: mockFn,
  onCardTokenized: mockFn,
};

export default {
  component: AddCardStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof AddCardStep>;

const Template: ComponentStory<typeof AddCardStep> = (args) => <AddCardStep {...args} />;

export const InvalidForm = Template.bind({});
InvalidForm.args = {
  ...commonArgs,
  isFormValid: false,
};

export const CardSubmitting = Template.bind({});
CardSubmitting.args = {
  ...commonArgs,
  isCardSubmitted: true,
};

export const ValidForm = Template.bind({});
ValidForm.args = {
  ...commonArgs,
};
