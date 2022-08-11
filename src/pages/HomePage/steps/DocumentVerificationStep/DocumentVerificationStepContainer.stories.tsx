import React from 'react';
import { rest } from 'msw';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { NestedPartial } from '../../../../utils/generics';
import App from '../../../../App';
import { GetUserResponse, VerifyDocumentsResponse } from '../../../../redux/userApi';
import { DefaultGetUserResponse } from '../EmailVerificationStep/EmailVerificationStepContainer.stories';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.DOCUMENT_VERIFICATION,
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

export const DefaultVerifyDocumentsResponse = {};

Default.parameters = {
  msw: {
    handlers: [
      rest.get<Record<string, never>, Record<string, never>, GetUserResponse>(
        `${process.env.REACT_APP_SERVER_URL}user-details`,
        (req, res, ctx) => res(
          ctx.json(DefaultGetUserResponse),
        ),
      ),
      rest.post<Record<string, never>, Record<string, never>, VerifyDocumentsResponse>(
        `${process.env.REACT_APP_SERVER_URL}document-verification`,
        (req, res, ctx) => res(
          ctx.json(DefaultVerifyDocumentsResponse),
        ),
      ),
    ],
  },
};
