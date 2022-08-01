import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DocumentVerificationStep from './DocumentVerificationStep';
import { withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';

const store = createStoreWithMiddlewares(mockStore);

export default {
  component: DocumentVerificationStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof DocumentVerificationStep>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DocumentVerificationStep> = (args) => <DocumentVerificationStep {...args} />;

export const Default = Template.bind({});
export const InProgress = Template.bind({});
export const Failed = Template.bind({});

Default.args = {
  documentVerificationStatus: 'NOT_STARTED',
};

InProgress.args = {
  documentVerificationStatus: 'IN_PROGRESS',
};

Failed.args = {
  documentVerificationStatus: 'FAILED',
};
