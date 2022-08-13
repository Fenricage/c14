import React from 'react';
import { rest } from 'msw';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { GetUserResponse, UpdateUserResponse } from '../../../../redux/userApi';
import { NestedPartial } from '../../../../utils/generics';
import App from '../../../../App';
import { DefaultGetUserResponse } from '../EmailVerificationStep/EmailVerificationStepContainer.stories';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PERSONAL_INFORMATION,
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

export const DefaultUpdateUserResponse: UpdateUserResponse = {
  identity_verified: true,
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
      rest.put<Record<string, never>, Record<string, never>, UpdateUserResponse>(
        `${process.env.REACT_APP_SERVER_URL}user-details`,
        (req, res, ctx) => res(
          ctx.json(DefaultUpdateUserResponse),
        ),
      ),
    ],
  },
};
