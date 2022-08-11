import React from 'react';
import { rest } from 'msw';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { GetUserResponse } from '../../../../redux/userApi';
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
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof App>;

export const Default: ComponentStory<typeof App> = () => (
  <App />
);

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
