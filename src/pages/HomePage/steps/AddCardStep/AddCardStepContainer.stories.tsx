import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { withProvider } from '../../../../utils/storybook';
import { createStoreWithMiddlewares } from '../../../../app/store';
import { StepperSteps, WidgetSteps } from '../../../../state/applicationSlice';
import Widget from '../../Widget/Widget';

const store = createStoreWithMiddlewares({
  application: {
    widgetSteps: {
      currentStep: WidgetSteps.PAYMENT_ADDING,
    },
    stepperSteps: StepperSteps.PAYMENT_DETAILS,
  },
});

export default {
  component: Widget,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof Widget>;

export const Default: ComponentStory<typeof Widget> = (args) => (
  <Widget {...args} />
);
