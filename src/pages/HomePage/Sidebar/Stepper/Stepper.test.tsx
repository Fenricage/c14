import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-styled-components';
import Stepper from './Stepper';
import { colors } from '../../../../theme';
import applicationSlice, {
  initialState,
  incrementStepperStep, StepperSteps,
} from '../../../../state/applicationSlice';
import { render } from '../../../../utils/test-utils';

describe('Stepper tests', () => {
  it('check initial Stepper active color style', () => {
    const { getByTestId } = render(<Stepper />);
    expect(getByTestId('ItemTitle-0')).toHaveStyle({ color: colors().alt3 });
    expect(getByTestId('ItemText-0')).toHaveStyle({ color: colors().alt3 });

    expect(getByTestId('ItemTitle-1')).toHaveStyle({ color: colors().alt3o1 });
    expect(getByTestId('ItemText-1')).toHaveStyle({ color: colors().alt3o2 });
  });

  it('set another step and check Stepper active color style', () => {
    const storeAfterIncrementStepperStep = applicationSlice.reducer(initialState, incrementStepperStep());

    expect(storeAfterIncrementStepperStep).toEqual({
      ...initialState,
      stepperSteps: {
        currentStep: StepperSteps.PHONE_VERIFICATION,
      },
    });

    const { getByTestId } = render(<Stepper />, {
      preloadedState: {
        [applicationSlice.name]: storeAfterIncrementStepperStep,
      },
    });

    expect(getByTestId('ItemTitle-1')).toHaveStyle({ color: colors().alt3 });
    expect(getByTestId('ItemText-1')).toHaveStyle({ color: colors().alt3 });
  });
});
