import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PersonalInformationStep from './PersonalInformationStep';
import { mockFn, withProvider, mockStore } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { stateOptions } from './PersonalInformationStepContainer';

const store = createStoreWithMiddlewares(mockStore);

export default {
  component: PersonalInformationStep,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof PersonalInformationStep>;

const Template: ComponentStory<
  typeof PersonalInformationStep
  > = (args) => <PersonalInformationStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialValues: {
    building: '',
    city: '',
    dob: '',
    country: '',
    email: '',
    firstNames: '',
    lastNames: '',
    postalCode: '',
    stateCode: '',
    streetName: '',
    unitNumber: '',
  },
  submitForm: () => new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  }),
  isLoading: false,
  onClickNavigateBack: mockFn,
  stateOptions,
};
