import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EmailVerificationStep from './EmailVerificationStep';
import { mockFn, withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

const store = createStoreWithMiddlewares(mockStore);

export default {
  component: EmailVerificationStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof EmailVerificationStep>;

const Template: ComponentStory<
  typeof EmailVerificationStep
  > = (args) => <EmailVerificationStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  onClickResendEmail: () => Promise.resolve(),
  isLoading: false,
  onClickModifyEmail: mockFn,
};
