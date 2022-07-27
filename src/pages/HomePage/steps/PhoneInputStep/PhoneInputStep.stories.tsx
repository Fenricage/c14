import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PhoneInputStep from './PhoneInputStep';
import { withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

export default {
  component: PhoneInputStep,
  decorators: [withProvider.bind(null, createStoreWithMiddlewares(mockStore))],
} as ComponentMeta<typeof PhoneInputStep>;

const Template: ComponentStory<typeof PhoneInputStep> = (args) => <PhoneInputStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialFormValues: {
    phone: '',
  },
  submitForm: () => new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  }),
};
