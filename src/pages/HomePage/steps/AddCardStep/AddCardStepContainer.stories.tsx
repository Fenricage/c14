import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { withProvider } from '../../../../utils/storybook';
import { createStoreWithMiddlewares, RootState } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import App from '../../../../App';
import { NestedPartial } from '../../../../utils/generics';

const initialStore: NestedPartial<RootState> = {
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PAYMENT_ADDING,
    },
    stepperSteps: {
      currentStep: StepperSteps.PAYMENT_DETAILS,
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
