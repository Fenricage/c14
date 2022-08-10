import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import { withProvider } from '../../../../utils/storybook';
import { NestedPartial } from '../../../../utils/generics';
import App from '../../../../App';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PHONE_VERIFICATION,
    },
    stepperSteps: {
      currentStep: StepperSteps.PHONE_VERIFICATION,
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
