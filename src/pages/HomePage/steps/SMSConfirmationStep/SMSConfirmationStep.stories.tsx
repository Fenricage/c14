import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SMSConfirmationStep from './SMSConfirmationStep';
import { withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

export default {
  component: SMSConfirmationStep,
  decorators: [withProvider.bind(null, createStoreWithMiddlewares(mockStore))],
} as ComponentMeta<typeof SMSConfirmationStep>;

const Template: ComponentStory<typeof SMSConfirmationStep> = (args) => <SMSConfirmationStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialFormValues: {
    code: '',
  },
  submitForm: () => new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  }),
};
