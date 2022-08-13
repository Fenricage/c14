import React from 'react';
import { rest } from 'msw';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { GetUserResponse } from '../../../../redux/userApi';
import { NestedPartial } from '../../../../utils/generics';
import App from '../../../../App';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.EMAIL_VERIFICATION,
    },
    stepperSteps: {
      currentStep: StepperSteps.PERSONAL_INFORMATION,
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

export const DefaultGetUserResponse: GetUserResponse = {
  first_names: 'John',
  last_names: 'Doe',
  city: 'New York',
  email: 'johndoe@gmail.com',
  date_of_birth: '1992-05-31',
  unit_number: '124412',
  street_name: 'Washington Street',
  state_code: 'California',
  postal_code: '434555',
  building: '3',
  email_verified: false,
  document_verification_status: 'SUCCESS',
  identity_verified: false,
};

Default.parameters = {
  msw: {
    handlers: [
      rest.get<Record<string, never>, Record<string, never>, GetUserResponse>(
        `${process.env.REACT_APP_SERVER_URL}user-details`,
        (req, res, ctx) => res(
          ctx.json(DefaultGetUserResponse),
        ),
      ),
    ],
  },
};
